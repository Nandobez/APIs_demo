# AsyncAPI

OpenAPI's sibling for **message-driven** systems. Describes channels,
operations, message schemas + binding to a transport (Kafka, MQTT,
AMQP, WebSocket, NATS, …).

## Sample spec

```yaml
asyncapi: 3.0.0
info:
  title: TodoEvents
  version: 1.0.0
servers:
  broker:
    host: broker.local:1883
    protocol: mqtt
channels:
  todo/created:
    address: todo/created
    messages:
      created: { $ref: '#/components/messages/Created' }
operations:
  onTodoCreated:
    action: receive
    channel: { $ref: '#/channels/todo~1created' }
    messages: [{ $ref: '#/channels/todo~1created/messages/created' }]
components:
  messages:
    Created:
      payload:
        type: object
        properties:
          id:    { type: integer }
          title: { type: string }
```

## Tooling

- ``asyncapi-cli`` validates specs and generates docs / clients.
- ``asyncapi/parser-js`` is the canonical JS parser.

| Layer | Cloud |
|---|---|
| Format | YAML / JSON |
| Use | document message-broker APIs, generate clients/docs |
