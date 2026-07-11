#!/usr/bin/env bash

set -u

# ============================================================
# Configuración general
# ============================================================

NAMESPACE="donaton"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

RUNTIME_DIR="${PROJECT_ROOT}/.runtime"
PID_DIR="${RUNTIME_DIR}/port-forwards"
LOG_DIR="${RUNTIME_DIR}/logs"

NAMESPACE_FILE="${PROJECT_ROOT}/k8s/namespace.yaml"
CONFIGMAP_FILE="${PROJECT_ROOT}/k8s/configmap.yaml"
DEPLOYMENTS_FILE="${PROJECT_ROOT}/k8s/deployments.yaml"
SERVICES_FILE="${PROJECT_ROOT}/k8s/services.yaml"

if [ -e "${PID_DIR}" ] && [ ! -d "${PID_DIR}" ]; then
    echo "ERROR: ${PID_DIR} existe, pero no es un directorio."
    echo "Eliminando el archivo inválido..."
    rm -f "${PID_DIR}"
fi

if [ -e "${LOG_DIR}" ] && [ ! -d "${LOG_DIR}" ]; then
    echo "ERROR: ${LOG_DIR} existe, pero no es un directorio."
    echo "Eliminando el archivo inválido..."
    rm -f "${LOG_DIR}"
fi

mkdir -p "${PID_DIR}"
mkdir -p "${LOG_DIR}"

cd "${PROJECT_ROOT}" || exit 1

# ============================================================
# Colores
# ============================================================

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

separator() {
    echo
    echo "============================================================"
    echo "$1"
    echo "============================================================"
}

# ============================================================
# Validaciones
# ============================================================

validate_dependencies() {
    separator "1. Validando herramientas"

    if ! command -v kubectl >/dev/null 2>&1; then
        error "kubectl no está instalado o no está disponible en PATH."
        exit 1
    fi

    success "kubectl disponible."

    if ! command -v docker >/dev/null 2>&1; then
        error "Docker no está instalado o no está disponible en PATH."
        exit 1
    fi

    success "Docker disponible."

    if ! docker info >/dev/null 2>&1; then
        error "Docker Desktop no está iniciado."
        echo "Abre Docker Desktop y espera hasta que Docker esté operativo."
        exit 1
    fi

    success "Docker Desktop está iniciado."

    if ! kubectl cluster-info >/dev/null 2>&1; then
        error "Kubernetes no está disponible."
        echo "Revisa Docker Desktop > Kubernetes y espera que indique Running."
        exit 1
    fi

    success "Kubernetes está disponible."

    local context
    context="$(kubectl config current-context 2>/dev/null)"

    info "Contexto actual: ${context}"

    if [ "${context}" != "docker-desktop" ]; then
        warning "El contexto actual no es docker-desktop."
        warning "El proyecto fue preparado para Kubernetes de Docker Desktop."
    else
        success "Contexto docker-desktop correcto."
    fi
}

validate_manifest_files() {
    separator "2. Validando manifiestos"

    local files=(
        "${NAMESPACE_FILE}"
        "${CONFIGMAP_FILE}"
        "${DEPLOYMENTS_FILE}"
        "${SERVICES_FILE}"
    )

    for file in "${files[@]}"; do
        if [ ! -f "${file}" ]; then
            error "No se encontró el archivo: ${file}"
            exit 1
        fi

        success "Encontrado: ${file#${PROJECT_ROOT}/}"
    done
}

validate_images() {
    separator "3. Validando imágenes Docker"

    local images=(
        "donaton-platform-ms-user:latest"
        "donaton-platform-ms-auth:latest"
        "donaton-platform-ms-donation:latest"
        "donaton-platform-ms-campaign:latest"
        "donaton-platform-bff:latest"
        "donaton-platform-api-gateway:latest"
        "donaton-platform-frontend:latest"
    )

    local missing=false

    for image in "${images[@]}"; do
        if docker image inspect "${image}" >/dev/null 2>&1; then
            success "Imagen disponible: ${image}"
        else
            error "Imagen no encontrada: ${image}"
            missing=true
        fi
    done

    if [ "${missing}" = true ]; then
        echo
        error "Faltan imágenes Docker necesarias."
        echo "Debes reconstruir las imágenes antes de continuar."
        exit 1
    fi
}

# ============================================================
# Kubernetes
# ============================================================

apply_kubernetes_resources() {
    separator "4. Aplicando recursos Kubernetes"

    info "Aplicando Namespace..."
    kubectl apply -f "${NAMESPACE_FILE}" || exit 1

    info "Aplicando ConfigMap..."
    kubectl apply -f "${CONFIGMAP_FILE}" || exit 1

    info "Validando Secret de bases de datos..."

    if ! kubectl get secret donaton-db-secrets \
        -n "${NAMESPACE}" >/dev/null 2>&1; then

        error "No existe el Secret donaton-db-secrets."
        echo
        echo "Ejecuta primero:"
        echo
        echo "  ./k8s/create-secrets-local.sh"
        echo
        echo "Después vuelve a ejecutar:"
        echo
        echo "  ./scripts/donaton.sh start"
        echo
        exit 1
    fi

    success "Secret donaton-db-secrets disponible."

    info "Aplicando Deployments..."
    kubectl apply -f "${DEPLOYMENTS_FILE}" || exit 1

    info "Aplicando Services..."
    kubectl apply -f "${SERVICES_FILE}" || exit 1

    success "Recursos Kubernetes aplicados."
}

wait_for_deployments() {
    separator "5. Esperando disponibilidad"

    info "Esperando que todos los Deployments estén disponibles..."
    info "El primer inicio puede tardar algunos minutos."

    if ! kubectl wait \
        --namespace "${NAMESPACE}" \
        --for=condition=Available \
        deployment \
        --all \
        --timeout=300s; then

        error "Uno o más Deployments no quedaron disponibles."

        kubectl get pods -n "${NAMESPACE}"

        echo
        echo "Para revisar errores:"
        echo
        echo "  kubectl get events -n ${NAMESPACE} --sort-by=.metadata.creationTimestamp"
        echo
        echo "  kubectl logs -n ${NAMESPACE} deployment/<nombre>"
        echo

        exit 1
    fi

    success "Todos los Deployments están disponibles."

    echo
    kubectl get deployments -n "${NAMESPACE}"

    echo
    kubectl get pods -n "${NAMESPACE}"
}

# ============================================================
# Port-forward
# ============================================================

stop_port_forwards() {
    separator "Deteniendo port-forwards"

    local found=false

    for pid_file in "${PID_DIR}"/*.pid; do
        if [ ! -e "${pid_file}" ]; then
            continue
        fi

        found=true

        local pid
        pid="$(cat "${pid_file}")"

        if kill -0 "${pid}" >/dev/null 2>&1; then
            kill "${pid}" >/dev/null 2>&1 || true
            success "Proceso ${pid} detenido."
        fi

        rm -f "${pid_file}"
    done

    if [ "${found}" = false ]; then
        info "No había port-forwards registrados."
    fi
}

check_port_available() {
    local port="$1"

    if command -v lsof >/dev/null 2>&1; then
        if lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
            error "El puerto ${port} ya está siendo utilizado."
            echo "Revisa el proceso con:"
            echo
            echo "  lsof -i :${port}"
            echo
            return 1
        fi
    fi

    return 0
}

start_single_port_forward() {
    local service="$1"
    local local_port="$2"
    local remote_port="$3"

    local pid_file="${PID_DIR}/${service}.pid"
    local log_file="${LOG_DIR}/${service}-port-forward.log"

    check_port_available "${local_port}" || return 1

    nohup kubectl port-forward \
        --namespace "${NAMESPACE}" \
        "service/${service}" \
        "${local_port}:${remote_port}" \
        --address 127.0.0.1 \
        > "${log_file}" 2>&1 &

    local pid=$!

    if ! echo "${pid}" > "${pid_file}"; then
        error "No fue posible registrar el PID de ${service}."

        if kill -0 "${pid}" >/dev/null 2>&1; then
            kill "${pid}" >/dev/null 2>&1 || true
        fi

        return 1
    fi

    local attempts=0
    local max_attempts=20

    while [ "${attempts}" -lt "${max_attempts}" ]; do
        if nc -z 127.0.0.1 "${local_port}" >/dev/null 2>&1; then
            success "${service}: localhost:${local_port}"
            return 0
        fi

        if ! kill -0 "${pid}" >/dev/null 2>&1; then
            error "El port-forward de ${service} terminó inesperadamente."
            echo "Revisa el log:"
            echo
            echo "  cat ${log_file}"
            echo
            return 1
        fi

        attempts=$((attempts + 1))
        sleep 1
    done

    error "No fue posible habilitar localhost:${local_port}."
    echo "Revisa el log:"
    echo
    echo "  cat ${log_file}"

    return 1
}

start_port_forwards() {
    separator "6. Iniciando accesos localhost"

    stop_existing_port_forwards_silently

    local forwards=(
        "frontend:3000:3000"
        "bff:8080:8080"
        "ms-user:8081:8081"
        "ms-auth:8082:8082"
        "ms-donation:8083:8083"
        "ms-campaign:8084:8084"
        "api-gateway:8090:8090"
    )

    for forward in "${forwards[@]}"; do
        IFS=":" read -r service local_port remote_port <<< "${forward}"

        start_single_port_forward \
            "${service}" \
            "${local_port}" \
            "${remote_port}" || exit 1
    done

    success "Todos los port-forwards están activos."
}

stop_existing_port_forwards_silently() {
  pkill -f "kubectl port-forward.*service/frontend.*3000:3000" >/dev/null 2>&1 || true
  pkill -f "kubectl port-forward.*service/bff.*8080:8080" >/dev/null 2>&1 || true
  pkill -f "kubectl port-forward.*service/ms-user.*8081:8081" >/dev/null 2>&1 || true
  pkill -f "kubectl port-forward.*service/ms-auth.*8082:8082" >/dev/null 2>&1 || true
  pkill -f "kubectl port-forward.*service/ms-donation.*8083:8083" >/dev/null 2>&1 || true
  pkill -f "kubectl port-forward.*service/ms-campaign.*8084:8084" >/dev/null 2>&1 || true
  pkill -f "kubectl port-forward.*service/api-gateway.*8090:8090" >/dev/null 2>&1 || true

    for pid_file in "${PID_DIR}"/*.pid; do
        if [ ! -e "${pid_file}" ]; then
            continue
        fi

        local pid
        pid="$(cat "${pid_file}")"

        if kill -0 "${pid}" >/dev/null 2>&1; then
            kill "${pid}" >/dev/null 2>&1 || true
        fi

        rm -f "${pid_file}"
    done

    sleep 1
}

# ============================================================
# Validación HTTP
# ============================================================

validate_url() {
    local name="$1"
    local url="$2"

    if curl --silent --fail --max-time 15 "${url}" >/dev/null 2>&1; then
        success "${name}"
    else
        warning "${name} no respondió todavía."
        warning "URL: ${url}"
    fi
}

validate_services() {
    separator "7. Validando servicios"

    validate_url \
        "Frontend" \
        "http://localhost:3000"

    validate_url \
        "API Gateway - campañas" \
        "http://localhost:8090/api/campaigns"

    validate_url \
        "BFF health" \
        "http://localhost:8080/actuator/health"

    validate_url \
        "MS User health" \
        "http://localhost:8081/actuator/health"

    validate_url \
        "MS Auth health" \
        "http://localhost:8082/actuator/health"

    validate_url \
        "MS Donation health" \
        "http://localhost:8083/actuator/health"

    validate_url \
        "MS Campaign health" \
        "http://localhost:8084/actuator/health"
}

# ============================================================
# Estado
# ============================================================

show_status() {
    separator "Estado de Donaton"

    if ! kubectl cluster-info >/dev/null 2>&1; then
        error "Kubernetes no está disponible."
        exit 1
    fi

    echo
    echo "Deployments:"
    kubectl get deployments -n "${NAMESPACE}" 2>/dev/null || true

    echo
    echo "Pods:"
    kubectl get pods -n "${NAMESPACE}" 2>/dev/null || true

    echo
    echo "Services:"
    kubectl get services -n "${NAMESPACE}" 2>/dev/null || true

    echo
    echo "Port-forwards:"

    local found=false

    for pid_file in "${PID_DIR}"/*.pid; do
        if [ ! -e "${pid_file}" ]; then
            continue
        fi

        found=true

        local pid
        local service

        pid="$(cat "${pid_file}")"
        service="$(basename "${pid_file}" .pid)"

        if kill -0 "${pid}" >/dev/null 2>&1; then
            echo "  ${service}: activo, PID ${pid}"
        else
            echo "  ${service}: detenido"
        fi
    done

    if [ "${found}" = false ]; then
        echo "  No hay port-forwards registrados."
    fi
}

# ============================================================
# Escalado para ahorrar recursos
# ============================================================

sleep_project() {
    separator "Suspendiendo Donaton"

    stop_existing_port_forwards_silently

    info "Escalando todos los Deployments a cero réplicas..."

    kubectl scale deployment \
        --all \
        --replicas=0 \
        -n "${NAMESPACE}" || exit 1

    success "Proyecto suspendido."
    echo
    echo "Los recursos Kubernetes permanecen configurados,"
    echo "pero los pods fueron detenidos para ahorrar memoria."
    echo
    echo "Para levantarlo nuevamente:"
    echo
    echo "  ./scripts/donaton.sh start"
}

# ============================================================
# URLs
# ============================================================

show_urls() {
    separator "Donaton está disponible"

    echo "Aplicación:"
    echo "  http://localhost:3000"
    echo
    echo "API Gateway:"
    echo "  http://localhost:8090"
    echo
    echo "Swagger:"
    echo "  BFF:          http://localhost:8080/swagger-ui/index.html"
    echo "  Usuarios:     http://localhost:8081/swagger-ui/index.html"
    echo "  Autenticación:http://localhost:8082/swagger-ui/index.html"
    echo "  Donaciones:   http://localhost:8083/swagger-ui/index.html"
    echo "  Campañas:     http://localhost:8084/swagger-ui/index.html"
    echo
    echo "Comandos:"
    echo "  Estado:       ./scripts/donaton.sh status"
    echo "  Detener web:  ./scripts/donaton.sh stop"
    echo "  Suspender:    ./scripts/donaton.sh sleep"
    echo
    echo "Logs de port-forward:"
    echo "  ${LOG_DIR}"
}

# ============================================================
# Inicio completo
# ============================================================

start_project() {
    validate_dependencies
    validate_manifest_files
    validate_images
    apply_kubernetes_resources
    wait_for_deployments
    start_port_forwards
    validate_services
    show_urls
}

# ============================================================
# Comando principal
# ============================================================

COMMAND="${1:-}"

case "${COMMAND}" in
    start)
        start_project
        ;;

    stop)
        stop_port_forwards
        echo
        success "Los accesos localhost fueron detenidos."
        echo "Los pods de Kubernetes siguen funcionando."
        ;;

    status)
        show_status
        ;;

    sleep)
        sleep_project
        ;;

    *)
        echo "Uso:"
        echo
        echo "  ./scripts/donaton.sh start"
        echo "  ./scripts/donaton.sh stop"
        echo "  ./scripts/donaton.sh status"
        echo "  ./scripts/donaton.sh sleep"
        echo
        echo "Comandos:"
        echo
        echo "  start   Levanta/verifica Kubernetes y crea los port-forward."
        echo "  stop    Detiene solamente los port-forward de localhost."
        echo "  status  Muestra el estado de Kubernetes y los port-forward."
        echo "  sleep   Detiene los pods para ahorrar memoria."
        exit 1
        ;;
esac