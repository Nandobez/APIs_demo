# gRPC

```bash
node server.js   # :4003

# Use grpcurl for ad-hoc calls
grpcurl -plaintext -import-path . -proto todo.proto localhost:4003 todo.TodoService/List
grpcurl -plaintext -import-path . -proto todo.proto \
        -d '{"title":"via grpc"}' localhost:4003 todo.TodoService/Create
```

| Property | Value |
|---|---|
| Transport | HTTP/2 + Protobuf binary |
| Schema | `.proto`, mandatory |
| Streaming | yes (server / client / bidi) |
| Browser support | not native — needs Envoy / Connect bridge |
| Best fit | internal microservices, low-overhead RPC |
