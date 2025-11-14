#!/usr/bin/env bash
set -euo pipefail

if docker compose version >/dev/null 2>&1; then
  exec docker compose "$@"
fi

if command -v docker-compose >/dev/null 2>&1; then
  cat <<'MSG' >&2
The legacy "docker-compose" Python CLI is installed but cannot run this stack.
It often crashes with KeyError: 'ContainerConfig' when recreating the MariaDB
service. Please install the Docker Compose plugin and rerun your command via
"docker compose" (or this script) instead. See:
  https://docs.docker.com/compose/install/linux/#install-using-the-repository
MSG
  exit 1
fi

cat <<'MSG' >&2
Docker Compose is not installed. Install the Docker Compose plugin:
  https://docs.docker.com/compose/install/
MSG
exit 1
