# 3GPP NEF (Network Exposure Function)

Component of the 5G Service-Based Architecture (TS 23.501) that lets
external apps consume **network-level functions** — paging, monitoring,
QoS, traffic influence, group management — without seeing the rest of
the core.

Implements the **SBA design pattern**: every 5G function is a
RESTful microservice over HTTP/2 + JSON. NEF translates between
trusted internal APIs and external developer-facing endpoints (often
exposed through CAMARA).

## Sample notification subscription

```http
POST /3gpp-monitoring-event/v1/{scsAsId}/subscriptions HTTP/2
Content-Type: application/json
{
  "monitoringType": "LOSS_OF_CONNECTIVITY",
  "monitoringExpireTime": "2026-12-31T23:59:59Z",
  "notificationDestination": "https://app.example.com/cb"
}
```

| Layer | Telecom |
|---|---|
| Transport | HTTP/2 (mandatory) |
| Wire format | JSON + OpenAPI 3.0 |
| Streaming | webhook-style notifications |
| Best fit | enterprise integrations with mobile operator core |
