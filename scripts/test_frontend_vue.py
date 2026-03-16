#!/usr/bin/env python3
"""Vue.js frontend smoke test script.

Usage example:
  python3 scripts/test_frontend_vue.py \
    --url http://localhost:5173 \
    --mount-selector 'id="app"' \
    --expect-text '歡迎'
"""

from __future__ import annotations

import argparse
import sys
import urllib.error
import urllib.request


class FrontendTestError(RuntimeError):
    """Raised when frontend validation fails."""


def fetch_html(url: str, timeout: float) -> str:
    request = urllib.request.Request(url=url, method="GET")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        status_code = response.status
        body = response.read().decode("utf-8", errors="replace")

    if status_code < 200 or status_code >= 300:
        raise FrontendTestError(f"Unexpected HTTP status: {status_code}")

    return body


def run_frontend_smoke_test(url: str, mount_selector: str, expect_text: str | None, timeout: float) -> None:
    html = fetch_html(url, timeout)

    if mount_selector not in html:
        raise FrontendTestError(f"Cannot find Vue mount selector '{mount_selector}' in page source")

    if expect_text and expect_text not in html:
        raise FrontendTestError(f"Cannot find expected text '{expect_text}' in page source")

    print("✅ Frontend smoke test passed")
    print(f"Checked URL: {url}")
    print(f"Verified selector: {mount_selector}")
    if expect_text:
        print(f"Verified text: {expect_text}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Smoke test for Vue.js frontend page")
    parser.add_argument("--url", required=True, help="Frontend URL, e.g. http://localhost:5173")
    parser.add_argument("--mount-selector", default='id="app"', help="Vue mount selector fragment in HTML")
    parser.add_argument("--expect-text", default=None, help="Optional text expected in HTML")
    parser.add_argument("--timeout", type=float, default=10.0, help="HTTP timeout seconds")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    try:
        run_frontend_smoke_test(
            url=args.url,
            mount_selector=args.mount_selector,
            expect_text=args.expect_text,
            timeout=args.timeout,
        )
    except urllib.error.URLError as error:
        print(f"❌ HTTP request failed: {error}", file=sys.stderr)
        return 1
    except FrontendTestError as error:
        print(f"❌ Frontend assertion failed: {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
