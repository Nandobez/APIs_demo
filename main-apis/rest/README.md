# REST

Plain `application/json` over HTTP/1.1.

```bash
node server.js   # :4001

curl http://localhost:4001/todos
curl -X POST  -H 'Content-Type: application/json' -d '{"title":"hi"}' http://localhost:4001/todos
curl -X PATCH -H 'Content-Type: application/json' -d '{"done":true}'   http://localhost:4001/todos/1
curl -X DELETE http://localhost:4001/todos/1
```

| Property | Value |
|---|---|
| Transport | HTTP/1.1 (or HTTP/2 transparently) |
| Schema | none — by convention |
| Streaming | no (chunked is request-scoped) |
| Browser support | universal |
| Best fit | resource-oriented CRUD, edge caches, public APIs |
