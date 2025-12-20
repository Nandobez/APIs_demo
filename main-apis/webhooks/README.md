# Webhooks

Server pushes state changes to URLs the client registered earlier.

```bash
node server.js   # :4008

# subscribe (self for demo)
curl -X POST -H 'Content-Type: application/json' \
  -d '{"url":"http://localhost:4008/receive"}' http://localhost:4008/subscribe

# trigger
curl -X POST -H 'Content-Type: application/json' \
  -d '{"title":"will fire a webhook"}' http://localhost:4008/todos
# → server logs the delivery
```

| Property | Value |
|---|---|
| Transport | HTTP POST callback |
| Schema | by convention (JSON body) |
| Streaming | no — async fire-and-forget |
| Best fit | inter-system events (Stripe, GitHub, CI/CD) |
