#!/usr/bin/env bash

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BACKEND_SERVICES=(
  "ms-user"
  "ms-auth"
  "ms-campaign"
  "ms-donation"
  "bff"
  "api-gateway"
)

PASSED_COMPONENTS=()
FAILED_COMPONENTS=()

separator() {
  printf '\n============================================================\n'
}

title() {
  separator
  printf '%s\n' "$1"
  separator
}

mark_success() {
  local component="$1"

  PASSED_COMPONENTS+=("$component")
  printf '\n[OK] %s finalizado correctamente.\n' "$component"
}

mark_failure() {
  local component="$1"

  FAILED_COMPONENTS+=("$component")
  printf '\n[ERROR] Falló la validación de %s.\n' "$component"
}

run_frontend() {
  title "Frontend: TypeScript, ESLint, pruebas, cobertura y build"

  cd "$ROOT_DIR/frontend" || return 1

  pnpm exec tsc --noEmit &&
  pnpm lint &&
  pnpm test &&
  pnpm test:coverage &&
  pnpm build
}

run_backend() {
  local service="$1"
  local service_dir="$ROOT_DIR/backend/$service"

  title "Backend: $service"

  cd "$service_dir" || return 1

  ./gradlew clean test jacocoTestReport
}

show_summary() {
  title "Resumen integral de calidad"

  printf 'Componentes aprobados: %s\n' "${#PASSED_COMPONENTS[@]}"

  for component in "${PASSED_COMPONENTS[@]}"; do
    printf '  [OK] %s\n' "$component"
  done

  if ((${#FAILED_COMPONENTS[@]} > 0)); then
    printf '\nComponentes con errores: %s\n' "${#FAILED_COMPONENTS[@]}"

    for component in "${FAILED_COMPONENTS[@]}"; do
      printf '  [ERROR] %s\n' "$component"
    done

    printf '\nLa suite integral terminó con errores.\n'
    return 1
  fi

  printf '\n[OK] Todos los componentes finalizaron correctamente.\n'
  printf '[OK] Se generaron los reportes de pruebas y cobertura.\n'

  printf '\nReportes disponibles:\n'
  printf '  Frontend:\n'
  printf '    %s\n' "$ROOT_DIR/frontend/coverage/index.html"

  for service in "${BACKEND_SERVICES[@]}"; do
    printf '\n  %s:\n' "$service"
    printf '    Tests:  %s\n' \
      "$ROOT_DIR/backend/$service/build/reports/tests/test/index.html"
    printf '    JaCoCo: %s\n' \
      "$ROOT_DIR/backend/$service/build/reports/jacoco/test/html/index.html"
  done
}

main() {
  title "Suite integral de calidad Donaton"

  printf 'Proyecto: %s\n' "$ROOT_DIR"

  if run_frontend; then
    mark_success "frontend"
  else
    mark_failure "frontend"
  fi

  for service in "${BACKEND_SERVICES[@]}"; do
    if run_backend "$service"; then
      mark_success "$service"
    else
      mark_failure "$service"
    fi
  done

  show_summary
}

main "$@"