# Connect (Buf)

gRPC-compatible **and** browser-friendly. Same `.proto` schema as gRPC; the
wire format is Protobuf-binary, Protobuf-JSON, or Connect's own JSON
mapping — chosen by the `Content-Type` header.

This folder ships a **JSON-only stub** to keep the demo dependency-free.
For full Connect-ES with codegen see https://github.com/connectrpc/connect-es.

```bash
node server.js   # :4007

curl -X POST -H 'Content-Type: application/json' -d '{}' \
  http://localhost:4007/todo.TodoService/List

curl -X POST -H 'Content-Type: application/json' \
  -d '{"title":"connect demo"}' \
  http://localhost:4007/todo.TodoService/Create
```

| Property | Value |
|---|---|
| Transport | HTTP/1.1 + Protobuf or JSON |
| Schema | `.proto` (same as gRPC) |
| Streaming | server / client / bidi (via HTTP/2 fallback) |
| Browser support | yes — `fetch` works |
