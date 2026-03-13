# CAMARA

Linux-Foundation project that standardises telecom network APIs.
REST + OpenAPI specs for QoS-on-demand, device location, SIM swap,
device status, number verification, etc.

Operators publish CAMARA-compliant endpoints (Telefónica Open Gateway,
Vivo, TIM, Verizon Edge, Vodafone). Apps consume them via a developer
portal + OAuth 2.0.

## Sample request — QoD (Quality on Demand)

```bash
POST /qod/sessions
Content-Type: application/json
Authorization: Bearer eyJhbG…

{
  "duration": 300,
  "qosProfile": "QOS_E",
  "device": { "phoneNumber": "+5511999999999" },
  "applicationServer": { "ipv4Address": "203.0.113.10" }
}
```

| Layer | Telecom |
|---|---|
| Transport | HTTPS + OAuth 2.0 |
| Wire format | JSON (OpenAPI 3.1) |
| Streaming | no — REST request/response + webhook notifications |
| Best fit | applications that want telco-grade QoS, identity, location |
