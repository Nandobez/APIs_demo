# tRPC

End-to-end TypeScript inference for HTTP RPC. No schema file, no code-gen.

```bash
node server.js   # :4006

curl http://localhost:4006/list
curl -X POST -H 'Content-Type: application/json' \
  -d '"hello via trpc"' http://localhost:4006/create
```

| Property | Value |
|---|---|
| Transport | HTTP POST / GET (batch supported) |
| Schema | TypeScript types (no runtime contract) |
| Streaming | yes via subscriptions over WebSocket adapter |
| Browser support | yes — typed client is just `fetch` |
| Best fit | TypeScript monorepos (Next.js / SvelteKit + Node) |
