#!/usr/bin/env bash
# Consolidate workflow files into .github/workflows
#
# HISTORY: this script originally read from the top-level `workflows/` tree.
# That tree was archived to `archive/workflows/` (commit 03fb4de) because
# GitHub Actions only ever executes `.github/workflows/`. The source path below
# is updated so the loop no longer silently matches zero files.
#
# SAFETY: dry-run is the DEFAULT. Nothing moves without --apply.
#
# NOTE: the archived files are inert duplicates of the live CI tree. Moving
# them back into .github/workflows/ can SHADOW real workflows that share a
# filename. Read the collision report before running with --apply.
set -euo pipefail

SRC_DIR="archive/workflows"
DEST_DIR=".github/workflows"
APPLY=0

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    -h|--help)
      echo "usage: $0 [--apply]"
      echo "  default : dry-run, prints what would move"
      echo "  --apply : actually move the files"
      exit 0 ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

mkdir -p "$DEST_DIR"

if [ ! -d "$SRC_DIR" ]; then
  echo "error: source directory '$SRC_DIR' not found." >&2
  echo "       has it already been consolidated? nothing to do." >&2
  exit 1
fi

shopt -s nullglob
files=("$SRC_DIR"/*.yml "$SRC_DIR"/*.yaml)
shopt -u nullglob

if [ ${#files[@]} -eq 0 ]; then
  echo "error: no .yml/.yaml files found in '$SRC_DIR'." >&2
  exit 1
fi

echo "source : $SRC_DIR"
echo "target : $DEST_DIR"
echo "files  : ${#files[@]}"
echo

collisions=0
for file in "${files[@]}"; do
  base=$(basename "$file")
  if [ -e "$DEST_DIR/$base" ]; then
    echo "  COLLISION  $base  (exists in $DEST_DIR -- would be shadowed)"
    collisions=$((collisions + 1))
  fi
done

if [ "$collisions" -gt 0 ]; then
  echo
  echo "warning: $collisions filename collision(s) detected." >&2
  echo "         moving these would overwrite live workflows." >&2
fi

echo
if [ "$APPLY" -ne 1 ]; then
  echo "DRY RUN -- nothing moved."
  for file in "${files[@]}"; do
    echo "  would move: $file -> $DEST_DIR/$(basename "$file")"
  done
  echo
  echo "re-run with --apply to perform the move."
  exit 0
fi

for file in "${files[@]}"; do
  git mv "$file" "$DEST_DIR/"
done

git commit -m "chore: consolidate workflows into .github/workflows"
git push origin main
