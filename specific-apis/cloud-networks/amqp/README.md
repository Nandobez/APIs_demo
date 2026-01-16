# AMQP 0-9-1 / 1.0

Broker-mediated message queue. RabbitMQ is the canonical AMQP 0-9-1
broker; ActiveMQ Artemis speaks AMQP 1.0. Use cases: work queues,
RPC, fan-out, dead-letter, delayed delivery.

## Run with RabbitMQ

```bash
docker run -d --rm -p 5672:5672 -p 15672:15672 rabbitmq:3-management
node publisher.js               # sends messages to "todo.events"
node consumer.js                # subscribes and prints them
```

Both scripts use ``amqplib`` and connect to ``amqp://localhost``.

## Tradeoffs

- Heavy compared to MQTT — exchanges, bindings, routing keys, vhosts.
- Persistent queues survive broker restart.
- Native dead-letter / TTL / priority — first-class operational
  primitives most pub/sub frameworks don't have.
