# CoAP

Same verbs as HTTP, **5–10× smaller frame** (UDP). Mandatory in Thread / OCF.

```bash
node server.js   # udp/5683

# requires `coap-cli` (`npm i -g coap-cli`)
coap get  coap://localhost/todos
coap post coap://localhost/todos -p '{"title":"via coap"}'
```

| Layer | Cloud / IoT |
|---|---|
| Transport | UDP (optionally DTLS) |
| Wire format | 4-byte binary header + payload |
| Streaming | yes via Observe (RFC 7641) |
| Best fit | battery-powered sensors, low-bandwidth links |
