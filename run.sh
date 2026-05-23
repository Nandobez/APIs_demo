#!/usr/bin/env bash
# Sobe os 7 MainAPI servers + o dashboard. Ctrl-C derruba tudo.
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "[run] instalando deps…"
  npm install --no-audit --no-fund --silent
fi

PIDS=()
trap 'echo; echo "[run] derrubando…"; for p in "${PIDS[@]}"; do kill "$p" 2>/dev/null || true; done; exit 0' INT TERM

start() {
  local label="$1"; shift
  "$@" 2>&1 | sed -u "s/^/[$label] /" &
  PIDS+=($!)
}

echo "[run] derrubando processos em portas usadas…"
for port in 4000 4001 4002 4003 4005 4006 4007 4008 1883 5683 5020; do
  fuser -k ${port}/tcp ${port}/udp 2>/dev/null || true
done
sleep 0.5

# MainAPIs (7)
start rest     node main-apis/rest/server.js
start graphql  node main-apis/graphql/server.js
start grpc     node main-apis/grpc/server.js
start jsonrpc  node main-apis/jsonrpc/server.js
start trpc     node main-apis/trpc/server.js
start connect  node main-apis/connect/server.js
start webhooks node main-apis/webhooks/server.js

# SpecificAPIs runnable (MQTT, CoAP, Modbus)
start mqtt     node specific-apis/cloud-networks/mqtt/server.js
start coap     node specific-apis/cloud-networks/coap/server.js
start modbus   node specific-apis/industrial/modbus/server.js

sleep 0.8
start dash     node dashboard/server.js

cat <<EOF

[run] ===================================================
[run]  Dashboard:  http://localhost:4000
[run] ---------------------------------------------------
[run]  MainAPIs:   :4001 REST   :4002 GraphQL  :4003 gRPC
[run]              :4005 JSON-RPC :4006 tRPC   :4007 Connect
[run]              :4008 Webhooks
[run]  Specific:   :1883 MQTT   :5683 CoAP/UDP :5020 Modbus
[run]  FIX:        offline (botão no dashboard)
[run] ===================================================
[run]  Ctrl-C para parar tudo.

EOF
wait
