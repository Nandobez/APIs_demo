# JSON-RPC 2.0

```bash
node server.js   # :4005

curl -X POST -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"list","id":1}' http://localhost:4005/

curl -X POST -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"create","params":{"title":"hi"},"id":2}' \
  http://localhost:4005/
```

| Property | Value |
|---|---|
| Transport | any — HTTP, WebSocket, stdio, TCP |
| Schema | none (envelope only) |
| Streaming | only over duplex transports (WS, TCP) |
| Best fit | wallets (Ethereum, Bitcoin), LSP, embedded RPC |
