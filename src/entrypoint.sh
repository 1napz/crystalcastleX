#!/usr/bin/env bash
set -e
# run migrations if you use alembic (uncomment)
# alembic upgrade head
exec "$@"
