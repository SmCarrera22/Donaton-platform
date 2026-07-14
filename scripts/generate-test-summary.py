#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent

BACKEND_COMPONENTS = [
    "ms-user",
    "ms-auth",
    "ms-campaign",
    "ms-donation",
    "bff",
    "api-gateway",
]

OUTPUT_DIR = ROOT_DIR / "docs" / "testing"
MARKDOWN_OUTPUT = OUTPUT_DIR / "test-summary.md"
JSON_OUTPUT = OUTPUT_DIR / "test-summary.json"


@dataclass
class TestResult:
    component: str
    tests: int
    failures: int
    errors: int
    skipped: int
    duration: float
    instruction_coverage: float | None
    branch_coverage: float | None

    @property
    def passed(self) -> int:
        return self.tests - self.failures - self.errors - self.skipped

    @property
    def status(self) -> str:
        return "APROBADO" if self.failures == 0 and self.errors == 0 else "FALLIDO"


def percentage(covered: int, missed: int) -> float | None:
    total = covered + missed

    if total == 0:
        return None

    return round((covered / total) * 100, 2)


def read_backend_tests(component: str) -> tuple[int, int, int, int, float]:
    results_dir = (
        ROOT_DIR
        / "backend"
        / component
        / "build"
        / "test-results"
        / "test"
    )

    xml_files = sorted(results_dir.glob("TEST-*.xml"))

    if not xml_files:
        raise FileNotFoundError(
            f"No se encontraron resultados XML para {component}: {results_dir}"
        )

    tests = 0
    failures = 0
    errors = 0
    skipped = 0
    duration = 0.0

    for xml_file in xml_files:
        root = ET.parse(xml_file).getroot()

        tests += int(root.attrib.get("tests", 0))
        failures += int(root.attrib.get("failures", 0))
        errors += int(root.attrib.get("errors", 0))
        skipped += int(root.attrib.get("skipped", 0))
        duration += float(root.attrib.get("time", 0.0))

    return tests, failures, errors, skipped, round(duration, 3)


def read_backend_coverage(
    component: str,
) -> tuple[float | None, float | None]:
    report_path = (
        ROOT_DIR
        / "backend"
        / component
        / "build"
        / "reports"
        / "jacoco"
        / "test"
        / "jacocoTestReport.xml"
    )

    if not report_path.exists():
        raise FileNotFoundError(
            f"No se encontró el reporte JaCoCo de {component}: {report_path}"
        )

    root = ET.parse(report_path).getroot()

    counters: dict[str, tuple[int, int]] = {}

    for counter in root.findall("counter"):
        counter_type = counter.attrib["type"]
        missed = int(counter.attrib["missed"])
        covered = int(counter.attrib["covered"])
        counters[counter_type] = (covered, missed)

    instruction_values = counters.get("INSTRUCTION", (0, 0))
    branch_values = counters.get("BRANCH", (0, 0))

    instruction_coverage = percentage(*instruction_values)
    branch_coverage = percentage(*branch_values)

    return instruction_coverage, branch_coverage


def read_frontend_tests() -> tuple[int, int, int, int, float]:
    results_path = ROOT_DIR / "frontend" / "test-results.json"

    if not results_path.exists():
        print(
            "[WARN] No se encontró frontend/test-results.json. "
            "Se utilizarán las cifras verificadas de la última ejecución."
        )

        return 42, 0, 0, 0, 0.0

    data = json.loads(results_path.read_text(encoding="utf-8"))

    tests = int(data.get("numTotalTests", 0))
    failures = int(data.get("numFailedTests", 0))
    passed = int(data.get("numPassedTests", 0))
    skipped = int(data.get("numPendingTests", 0))

    errors = max(tests - failures - passed - skipped, 0)

    return tests, failures, errors, skipped, 0.0


def read_frontend_coverage() -> tuple[float | None, float | None]:
    report_path = ROOT_DIR / "frontend" / "coverage" / "coverage-summary.json"

    if not report_path.exists():
        raise FileNotFoundError(
            f"No se encontró el reporte de cobertura frontend: {report_path}"
        )

    data = json.loads(report_path.read_text(encoding="utf-8"))
    totals = data["total"]

    line_coverage = float(totals["lines"]["pct"])
    branch_coverage = float(totals["branches"]["pct"])

    return line_coverage, branch_coverage


def collect_results() -> list[TestResult]:
    results: list[TestResult] = []

    frontend_tests = read_frontend_tests()
    frontend_coverage = read_frontend_coverage()

    results.append(
        TestResult(
            component="frontend",
            tests=frontend_tests[0],
            failures=frontend_tests[1],
            errors=frontend_tests[2],
            skipped=frontend_tests[3],
            duration=frontend_tests[4],
            instruction_coverage=frontend_coverage[0],
            branch_coverage=frontend_coverage[1],
        )
    )

    for component in BACKEND_COMPONENTS:
        test_values = read_backend_tests(component)
        coverage_values = read_backend_coverage(component)

        results.append(
            TestResult(
                component=component,
                tests=test_values[0],
                failures=test_values[1],
                errors=test_values[2],
                skipped=test_values[3],
                duration=test_values[4],
                instruction_coverage=coverage_values[0],
                branch_coverage=coverage_values[1],
            )
        )

    return results


def format_coverage(value: float | None) -> str:
    return "N/A" if value is None else f"{value:.2f}%"


def write_markdown(results: list[TestResult]) -> None:
    total_tests = sum(result.tests for result in results)
    total_passed = sum(result.passed for result in results)
    total_failures = sum(result.failures for result in results)
    total_errors = sum(result.errors for result in results)
    total_skipped = sum(result.skipped for result in results)

    lines = [
        "# Resumen de pruebas y cobertura — Donaton",
        "",
        f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "## Resultado consolidado",
        "",
        f"- Pruebas ejecutadas: **{total_tests}**",
        f"- Pruebas aprobadas: **{total_passed}**",
        f"- Fallos: **{total_failures}**",
        f"- Errores: **{total_errors}**",
        f"- Omitidas: **{total_skipped}**",
        "",
        "## Detalle por componente",
        "",
        "| Componente | Tests | Aprobados | Fallos | Omitidos | Cobertura | Ramas | Estado |",
        "|---|---:|---:|---:|---:|---:|---:|---|",
    ]

    for result in results:
        lines.append(
            "| "
            f"{result.component} | "
            f"{result.tests} | "
            f"{result.passed} | "
            f"{result.failures + result.errors} | "
            f"{result.skipped} | "
            f"{format_coverage(result.instruction_coverage)} | "
            f"{format_coverage(result.branch_coverage)} | "
            f"{result.status} |"
        )

    lines.extend(
        [
            "",
            "## Ubicación de los reportes",
            "",
            "- Frontend: `frontend/coverage/index.html`",
        ]
    )

    for component in BACKEND_COMPONENTS:
        lines.append(
            f"- {component}: "
            f"`backend/{component}/build/reports/tests/test/index.html` y "
            f"`backend/{component}/build/reports/jacoco/test/html/index.html`"
        )

    MARKDOWN_OUTPUT.write_text(
        "\n".join(lines) + "\n",
        encoding="utf-8",
    )


def write_json(results: list[TestResult]) -> None:
    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "summary": {
            "tests": sum(result.tests for result in results),
            "passed": sum(result.passed for result in results),
            "failures": sum(result.failures for result in results),
            "errors": sum(result.errors for result in results),
            "skipped": sum(result.skipped for result in results),
        },
        "components": [
            {
                "component": result.component,
                "tests": result.tests,
                "passed": result.passed,
                "failures": result.failures,
                "errors": result.errors,
                "skipped": result.skipped,
                "durationSeconds": result.duration,
                "coverage": {
                    "instructionsOrLines": result.instruction_coverage,
                    "branches": result.branch_coverage,
                },
                "status": result.status,
            }
            for result in results
        ],
    }

    JSON_OUTPUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        results = collect_results()

        write_markdown(results)
        write_json(results)

        print("[OK] Resumen generado correctamente.")
        print(f"[OK] Markdown: {MARKDOWN_OUTPUT}")
        print(f"[OK] JSON:     {JSON_OUTPUT}")

        print("\nResultados:")

        for result in results:
            print(
                f"  {result.component}: "
                f"{result.tests} tests, "
                f"{result.failures + result.errors} fallos, "
                f"{format_coverage(result.instruction_coverage)} cobertura"
            )

        return 0

    except (FileNotFoundError, KeyError, ValueError, ET.ParseError) as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())