#!/usr/bin/env python3
"""Clone an Inventor .iam or .ipt file along with directory contents.

This script copies the directory containing the specified file,
renaming files that contain the original numerical identifier.
It prompts for a new number, defaulting to the current number + 1.
"""

import os
import re
import shutil
import sys


def extract_number(name: str) -> tuple[str, str, str]:
    """Return prefix, number string, and suffix for the first numeric group."""
    match = re.search(r"(\d+)", name)
    if not match:
        return name, "", ""
    start, end = match.span(1)
    prefix = name[:start]
    number = match.group(1)
    suffix = name[end:]
    return prefix, number, suffix


def replace_number(name: str, old: str, new: str) -> str:
    """Replace first occurrence of old number in name with new number."""
    return name.replace(old, new, 1)


def main(path: str) -> None:
    if not os.path.isfile(path):
        print(f"Error: {path} is not a file", file=sys.stderr)
        sys.exit(1)

    dir_path = os.path.dirname(os.path.abspath(path))
    base_name = os.path.basename(path)

    prefix, number, suffix = extract_number(base_name)

    if number:
        next_number = str(int(number) + 1).zfill(len(number))
        user_input = input(f"Enter new number [{next_number}]: ").strip()
        new_number = user_input or next_number
        new_base = prefix + new_number + suffix
    else:
        user_input = input("Enter new file name: ").strip()
        if not user_input:
            print("No new name provided.", file=sys.stderr)
            sys.exit(1)
        new_base = user_input
        new_number = number

    new_dir = dir_path + "_" + (new_number or "copy")
    if os.path.exists(new_dir):
        print(f"Error: destination {new_dir} already exists", file=sys.stderr)
        sys.exit(1)

    print(f"Copying directory {dir_path} to {new_dir} ...")
    shutil.copytree(dir_path, new_dir)

    if number:
        print("Renaming files to use new number ...")
        for root, _dirs, files in os.walk(new_dir):
            for fname in files:
                if number in fname:
                    old_path = os.path.join(root, fname)
                    new_name = replace_number(fname, number, new_number)
                    new_path = os.path.join(root, new_name)
                    os.rename(old_path, new_path)

    old_main = os.path.join(new_dir, base_name)
    new_main = os.path.join(new_dir, new_base)
    if os.path.exists(old_main):
        os.rename(old_main, new_main)

    print(f"Cloned assembly saved as {new_main}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <path_to_iam_or_ipt>", file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])
