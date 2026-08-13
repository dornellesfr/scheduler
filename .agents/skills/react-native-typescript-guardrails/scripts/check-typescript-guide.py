#!/usr/bin/env python3

from __future__ import annotations

import pathlib
import re
import sys


IGNORED_DIRECTORIES = {'.git', 'node_modules', 'dist', 'build', 'coverage', '.expo'}
TARGET_SUFFIXES = ('.ts', '.tsx')

RULES = (
    ('any', re.compile(r'\bany\b'), 'Avoid any; prefer a concrete type and use unknown plus narrowing only as a last resort.'),
    ('array-is-array', re.compile(r'\bArray\.isArray\s*\('), 'Avoid defensive Array.isArray when the type already guarantees an array.'),
    ('usememo', re.compile(r'\buseMemo\s*\('), 'Avoid manual useMemo unless profiling shows a need.'),
    ('usecallback', re.compile(r'\buseCallback\s*\('), 'Avoid manual useCallback unless profiling shows a need.'),
    ('else', re.compile(r'\belse\b'), 'Prefer early returns and guard clauses over else.'),
    ('explicit-any-catch', re.compile(r'catch\s*\([^)]*:\s*any\b'), 'Do not type catch errors as any; use unknown.'),
)


def main() -> int:
    if len(sys.argv) < 2:
        print('Usage: python3 check-typescript-guide.py <file-or-dir> [...more paths]', file=sys.stderr)
        return 1

    file_paths = collect_files([pathlib.Path(argument) for argument in sys.argv[1:]])
    findings = []

    for file_path in file_paths:
        content = file_path.read_text(encoding='utf-8')
        is_inside_block_comment = False
        for line_number, line in enumerate(content.splitlines(), start=1):
            stripped_line = line.strip()
            skip_line = should_skip_line(stripped_line, is_inside_block_comment)
            is_inside_block_comment = update_block_comment_state(stripped_line, is_inside_block_comment)

            if skip_line:
                continue

            for rule_id, pattern, message in RULES:
                if pattern.search(line) is None:
                    continue

                findings.append(
                    {
                        'file_path': file_path,
                        'line_number': line_number,
                        'rule_id': rule_id,
                        'message': message,
                        'sample': stripped_line,
                    }
                )

    if not findings:
        print(f'No heuristic violations found in {len(file_paths)} file(s).')
        return 0

    for finding in findings:
        print(f"{relative_path(finding['file_path'])}:{finding['line_number']} [{finding['rule_id']}] {finding['message']}")
        print(f"  {finding['sample']}")

    return 1


def collect_files(paths: list[pathlib.Path]) -> list[pathlib.Path]:
    files: list[pathlib.Path] = []

    for entry in paths:
        resolved_path = entry.resolve()

        if not resolved_path.exists():
            continue

        if resolved_path.is_dir():
            walk_directory(resolved_path, files)
            continue

        if is_target_file(resolved_path):
            files.append(resolved_path)

    return files


def walk_directory(directory_path: pathlib.Path, files: list[pathlib.Path]) -> None:
    for entry in directory_path.iterdir():
        if entry.is_dir():
            if entry.name in IGNORED_DIRECTORIES:
                continue

            walk_directory(entry, files)
            continue

        if is_target_file(entry):
            files.append(entry.resolve())


def is_target_file(file_path: pathlib.Path) -> bool:
    if file_path.name.endswith('.d.ts'):
        return False

    return file_path.suffix in TARGET_SUFFIXES


def should_skip_line(stripped_line: str, is_inside_block_comment: bool) -> bool:
    if not stripped_line:
        return False

    if is_inside_block_comment:
        return True

    return stripped_line.startswith('//') or stripped_line.startswith('/*') or stripped_line.startswith('*')


def update_block_comment_state(stripped_line: str, is_inside_block_comment: bool) -> bool:
    if not stripped_line:
        return is_inside_block_comment

    if is_inside_block_comment:
        return '*/' not in stripped_line

    return stripped_line.startswith('/*') and '*/' not in stripped_line


def relative_path(file_path: pathlib.Path) -> str:
    try:
        return str(file_path.resolve().relative_to(pathlib.Path.cwd()))
    except ValueError:
        return str(file_path)


if __name__ == '__main__':
    raise SystemExit(main())
