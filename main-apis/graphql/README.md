# GraphQL

```bash
node server.js   # :4002

curl -X POST -H 'Content-Type: application/json' \
  -d '{"query":"{ todos { id title done } }"}' \
  http://localhost:4002/

# variables
curl -X POST -H 'Content-Type: application/json' \
  -d '{"query":"mutation($t:String!){create(title:$t){id title}}","variables":{"t":"new"}}' \
  http://localhost:4002/
```

| Property | Value |
|---|---|
| Transport | HTTP POST (or WS for subscriptions) |
| Schema | SDL, mandatory |
| Streaming | yes via Subscriptions (WS / SSE) |
| Best fit | mobile / view-driven clients, federated services |
