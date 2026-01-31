# Apache Kafka

Distributed commit-log on TCP. Partitioned topics, ordered delivery within
a partition, consumer groups for scale-out. The de-facto stream backbone
for analytics + event-sourcing.

## Run a one-broker dev cluster

```bash
docker run -d --name kafka -p 9092:9092 apache/kafka:3.7.0
node publisher.js              # batch-produces 1k todo events
node consumer.js               # reads them and prints
```

| Layer | Cloud |
|---|---|
| Transport | TCP, binary framing |
| Wire format | Length-prefixed records with optional schema (Avro / Protobuf) |
| Streaming | yes — partitioned, replayable |
| Best fit | event-sourced systems, real-time analytics, log shipping |
