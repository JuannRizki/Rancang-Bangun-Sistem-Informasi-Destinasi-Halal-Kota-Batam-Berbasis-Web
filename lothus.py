#!/usr/bin/env python3
"""lothus.py

Demonstration helper for Laravel project testing.
Use this script to run the test suites and show commands for presentation.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
ARTISAN = PROJECT_ROOT / "artisan"


def find_executable(name: str) -> str:
    exe = shutil.which(name)
    if exe:
        return exe
    raise FileNotFoundError(f"Unable to find required executable '{name}'.")


def run_command(command: list[str], dry_run: bool = False) -> int:
    command_str = " ".join(command)
    print(f"\n> {command_str}")
    if dry_run:
        return 0

    result = subprocess.run(command, cwd=PROJECT_ROOT)
    if result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}.")
    return result.returncode


def show_environment() -> int:
    print("Laravel project demo helper: lothus.py")
    print(f"Project root: {PROJECT_ROOT}")

    commands = [
        [find_executable("php"), "-v"],
        [find_executable("composer"), "--version"],
    ]

    exit_code = 0
    for command in commands:
        if run_command(command) != 0:
            exit_code = 1
    return exit_code


def run_tests(suite: str | None = None, dry_run: bool = False) -> int:
    if not ARTISAN.exists():
        print("Error: artisan file not found in project root.")
        return 1

    php = find_executable("php")
    base_command = [php, str(ARTISAN), "test", "--colors=always"]

    if suite:
        base_command.append(f"--testsuite={suite}")

    return run_command(base_command, dry_run=dry_run)


def demo_flow(dry_run: bool = False) -> int:
    print("Demo flow: presentasi pengujian project")
    print("1. Menjalankan informasi lingkungan.")
    if show_environment() != 0:
        return 1

    print("2. Menjalankan unit tests.")
    if run_tests("Unit", dry_run=dry_run) != 0:
        return 1

    print("3. Menjalankan feature tests.")
    if run_tests("Feature", dry_run=dry_run) != 0:
        return 1

    print("\nDemo selesai. Semua pengujian telah dijalankan.")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="lothus.py - demo dan pengujian Laravel project")
    parser.add_argument("--all", action="store_true", help="Jalankan semua test suite")
    parser.add_argument("--unit", action="store_true", help="Jalankan unit tests")
    parser.add_argument("--feature", action="store_true", help="Jalankan feature tests")
    parser.add_argument("--env", action="store_true", help="Tampilkan informasi lingkungan dan versi PHP/composer")
    parser.add_argument("--demo", action="store_true", help="Jalankan demo pengujian lengkap untuk presentasi")
    parser.add_argument("--dry-run", action="store_true", help="Tampilkan perintah tanpa mengeksekusi")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.env:
        return show_environment()

    if args.demo:
        return demo_flow(dry_run=args.dry_run)

    if args.unit:
        return run_tests("Unit", dry_run=args.dry_run)

    if args.feature:
        return run_tests("Feature", dry_run=args.dry_run)

    if args.all:
        return run_tests(None, dry_run=args.dry_run)

    print("Tidak ada opsi yang dipilih. Gunakan --help untuk melihat pilihan yang tersedia.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
