# CloudEvents

CNCF spec: a **vendor-neutral event envelope** so the same event can flow
through Kafka, MQTT, NATS, HTTP webhooks, AWS EventBridge etc without
rewriting headers.

## Required attributes

```jsonc
{
  "specversion": "1.0",
  "type":        "com.duckgpt.todo.created",
  "source":      "/multi-protocol-apis/main-apis/rest",
  "id":          "0f0b3c8a-1c20-4b62-9bf2-eaf12c2b3c3a",
  "time":        "2026-05-23T21:30:00Z",
  "datacontenttype": "application/json",
  "data":        { "id": 1, "title": "buy duck food" }
}
```

The same payload over HTTP looks like:

```http
POST /events HTTP/1.1
ce-specversion: 1.0
ce-type: com.duckgpt.todo.created
ce-source: /multi-protocol-apis
ce-id: 0f0b3c8a-1c20-4b62-9bf2-eaf12c2b3c3a
Content-Type: application/json

{ "id": 1, "title": "buy duck food" }
```

## What ships here

Doc + samples. Implementations: ``cloudevents`` npm package for Node,
``cloudevents-sdk`` for Python.

| Layer | Cloud |
|---|---|
| Transport | any — HTTP, Kafka, NATS, MQTT, AMQP |
| Wire format | structured JSON or binary headers |
| Streaming | depends on transport |
| Best fit | vendor-neutral event-driven architecture |
