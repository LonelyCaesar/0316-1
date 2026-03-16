#!/usr/bin/env python3
"""Node.js backend smoke test script.

Usage example:
  python3 scripts/test_backend_node.py \
    --base-url http://localhost:3000 \
    --health-path /api/health \
    --expect-status ok
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from typing import Any, Dict


class BackendTestError(RuntimeError):
    """Raised when backend validation fails."""


def request_json(url: str, timeout: float) -> Dict[str, Any]:
    request = urllib.request.Request(url=url, method="GET")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        status_code = response.status
        body = response.read().decode("utf-8")

    if status_code < 200 or status_code >= 300:
        raise BackendTestError(f"Unexpected HTTP status: {status_code}")

    try:
        return json.loads(body)
    except json.JSONDecodeError as error:
        raise BackendTestError(f"{url} did not return valid JSON") from error


def run_backend_smoke_test(base_url: str, health_path: str, expect_status: str, timeout: float) -> None:
    health_url = f"{base_url.rstrip('/')}{health_path}"
    payload = request_json(health_url, timeout)

    status = payload.get("status")
    if status != expect_status:
        raise BackendTestError(
            f"Unexpected health status: expected '{expect_status}', got '{status}'. Full body: {payload}"
        )

    print("✅ Backend smoke test passed")
    print(f"Checked endpoint: {health_url}")
    print(f"Response body: {payload}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Smoke test for Node.js backend API")
    parser.add_argument("--base-url", required=True, help="Backend base URL, e.g. http://localhost:3000")
    parser.add_argument("--health-path", default="/api/health", help="Health check API path")
    parser.add_argument("--expect-status", default="ok", help="Expected JSON field 'status'")
    parser.add_argument("--timeout", type=float, default=10.0, help="HTTP timeout seconds")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    try:
        run_backend_smoke_test(
            base_url=args.base_url,
            health_path=args.health_path,
            expect_status=args.expect_status,
            timeout=args.timeout,
        )
    except urllib.error.URLError as error:
        print(f"❌ HTTP request failed: {error}", file=sys.stderr)
        return 1
    except BackendTestError as error:
        print(f"❌ Backend assertion failed: {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
