/** Sends 1000 todo events to topic `todo.events`. */
import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "demo-pub", brokers: ["localhost:9092"] });
const producer = kafka.producer();
await producer.connect();
const t0 = Date.now();
for (let i = 1; i <= 1000; i++) {
  await producer.send({
    topic: "todo.events",
    messages: [{ key: String(i), value: JSON.stringify({ seq: i, ts: Date.now() }) }],
  });
}
console.log(`[kafka pub] 1000 records in ${Date.now() - t0}ms`);
await producer.disconnect();
