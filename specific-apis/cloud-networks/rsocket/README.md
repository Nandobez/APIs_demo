# RSocket

Reactive-streams RPC: 4 interaction models — request-response,
fire-and-forget, request-stream, request-channel — all over a single
multiplexed connection. Runs on TCP, WebSocket or QUIC.

## Demo

```bash
node server.js               # tcp/4040
node client.js               # opens a channel, prints 10 ticks
```

| Layer | Cloud / Reactive |
|---|---|
| Transport | TCP, WS, QUIC |
| Wire format | binary framed protocol |
| Streaming | yes — first-class, backpressured |
| Best fit | reactive systems (Project Reactor, Akka, Spring) |
