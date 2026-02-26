#!/bin/zsh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${PROJECT_DIR}"

PID_FILE=".trainer_server_pid"
PORT_FILE=".trainer_server_port"
PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH}"

is_project_http_server() {
  local pid="$1"
  local cmd cwd
  cmd="$(ps -p "${pid}" -o command= 2>/dev/null || true)"
  [[ "${cmd}" == *"temp_server.py"* ]] || return 1
  cwd="$(lsof -a -p "${pid}" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n1)"
  [[ "${cwd}" == "${PROJECT_DIR}" ]]
}

kill_pid_if_running() {
  local pid="$1"
  if [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1; then
    kill "${pid}" || true
    return 0
  fi
  return 1
}

killed_any=0

if [[ -f "${PID_FILE}" ]]; then
  PID="$(cat "${PID_FILE}" 2>/dev/null || true)"
  if kill_pid_if_running "${PID}"; then
    echo "Stopped server PID ${PID}."
    killed_any=1
  fi
fi

for pid in $(pgrep -f "python.*temp_server.py" 2>/dev/null || true); do
  if is_project_http_server "${pid}"; then
    kill "${pid}" || true
    echo "Stopped project temp server PID ${pid}."
    killed_any=1
  fi
done

rm -f "${PID_FILE}" "${PORT_FILE}"

if [[ "${killed_any}" -eq 0 ]]; then
  echo "No running trainer server found for this project."
else
  echo "Server stopped. Refresh open trainer tabs to confirm shutdown."
fi
