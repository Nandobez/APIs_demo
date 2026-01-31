/** Consumer for topic `todo.events` (consumer-group: "demo"). */
import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "demo-sub", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "demo" });
await consumer.connect();
await consumer.subscribe({ topic: "todo.events", fromBeginning: true });
await consumer.run({
  eachMessage: async ({ message }) =>
    console.log("[kafka sub]", message.key?.toString(), message.value?.toString()),
});
