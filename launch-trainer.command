#!/bin/zsh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${PROJECT_DIR}"

PID_FILE=".trainer_server_pid"
PORT_FILE=".trainer_server_port"
LOG_FILE="/tmp/fretboard_trainer_server.log"
DEFAULT_PORT=8080
IDLE_TIMEOUT=90
PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH}"

find_python() {
  if command -v python3 >/dev/null 2>&1; then
    echo "python3"
    return
  fi
  if command -v python >/dev/null 2>&1; then
    echo "python"
    return
  fi
  echo ""
}

is_port_free() {
  local port="$1"
  ! lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1
}

pick_port() {
  local port="${DEFAULT_PORT}"
  local tries=0
  while [[ "${tries}" -lt 30 ]]; do
    if is_port_free "${port}"; then
      echo "${port}"
      return
    fi
    port=$((port + 1))
    tries=$((tries + 1))
  done
  return 1
}

open_trainer() {
  local port="$1"
  local url="http://127.0.0.1:${port}/trainer.html"
  open "${url}"
  echo "Opened ${url}"
}

is_project_http_server() {
  local pid="$1"
  local cmd cwd
  cmd="$(ps -p "${pid}" -o command= 2>/dev/null || true)"
  [[ "${cmd}" == *"temp_server.py"* ]] || return 1
  cwd="$(lsof -a -p "${pid}" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n1)"
  [[ "${cwd}" == "${PROJECT_DIR}" ]]
}

listening_port_for_pid() {
  local pid="$1"
  lsof -Pan -p "${pid}" -iTCP -sTCP:LISTEN -Fn 2>/dev/null | sed -n 's/^n.*:\([0-9][0-9]*\)$/\1/p' | head -n1
}

find_project_server_pid() {
  local pid
  for pid in $(pgrep -f "python.*temp_server.py" 2>/dev/null || true); do
    if is_project_http_server "${pid}"; then
      echo "${pid}"
      return
    fi
  done
}

# Reuse existing server if it is still alive.
if [[ -f "${PID_FILE}" && -f "${PORT_FILE}" ]]; then
  existing_pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
  existing_port="$(cat "${PORT_FILE}" 2>/dev/null || true)"
  if [[ -n "${existing_pid}" ]] && kill -0 "${existing_pid}" >/dev/null 2>&1; then
    open_trainer "${existing_port}"
    exit 0
  fi
fi

existing_pid="$(find_project_server_pid || true)"
if [[ -n "${existing_pid}" ]]; then
  existing_port="$(listening_port_for_pid "${existing_pid}")"
  if [[ -n "${existing_port}" ]]; then
    echo "${existing_pid}" > "${PID_FILE}"
    echo "${existing_port}" > "${PORT_FILE}"
    open_trainer "${existing_port}"
    exit 0
  fi
fi

PYTHON_BIN="$(find_python)"
if [[ -z "${PYTHON_BIN}" ]]; then
  echo "Python was not found. Install Python 3 to use the launcher."
  exit 1
fi

PORT="$(pick_port)"

nohup "${PYTHON_BIN}" ./temp_server.py \
  --port "${PORT}" \
  --bind 0.0.0.0 \
  --root "${PROJECT_DIR}" \
  --idle-timeout "${IDLE_TIMEOUT}" >"${LOG_FILE}" 2>&1 &
SERVER_PID="$!"

sleep 0.4
if ! kill -0 "${SERVER_PID}" >/dev/null 2>&1; then
  echo "Failed to start local server. See ${LOG_FILE}"
  exit 1
fi

echo "${SERVER_PID}" > "${PID_FILE}"
echo "${PORT}" > "${PORT_FILE}"

open_trainer "${PORT}"
echo "Server PID: ${SERVER_PID}"
echo "LAN URL (same Wi-Fi): http://<your-computer-ip>:${PORT}/trainer.html"
echo "Temporary server auto-stops after ${IDLE_TIMEOUT}s of inactivity."
