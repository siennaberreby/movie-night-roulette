#!/bin/zsh
cd "$(dirname "$0")"
python3 server.py &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null' EXIT INT TERM
sleep 1
open http://127.0.0.1:8765
wait "$server_pid"
