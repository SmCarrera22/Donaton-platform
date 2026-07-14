#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${PROJECT_ROOT}/docs/openapi"

mkdir -p "${OUTPUT_DIR}"

export_specification() {
    local service_name="$1"
    local url="$2"
    local output_file="${OUTPUT_DIR}/${service_name}-openapi.json"

    echo "Exporting OpenAPI specification for ${service_name}..."

    curl \
        --fail \
        --silent \
        --show-error \
        --max-time 30 \
        "${url}" \
        --output "${output_file}"

    python3 -m json.tool "${output_file}" >/dev/null

    echo "OK: ${output_file}"
}

export_specification \
    "bff" \
    "http://localhost:8080/v3/api-docs"

export_specification \
    "ms-user" \
    "http://localhost:8081/v3/api-docs"

export_specification \
    "ms-auth" \
    "http://localhost:8082/v3/api-docs"

export_specification \
    "ms-donation" \
    "http://localhost:8083/v3/api-docs"

export_specification \
    "ms-campaign" \
    "http://localhost:8084/v3/api-docs"

echo
echo "OpenAPI specifications exported successfully:"
ls -lh "${OUTPUT_DIR}"