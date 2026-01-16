/** Receives messages on todo.# */
import amqp from "amqplib";

const URL = process.env.AMQP_URL || "amqp://localhost";
const conn = await amqp.connect(URL);
const ch = await conn.createChannel();
await ch.assertExchange("todo.events", "topic", { durable: false });

const q = await ch.assertQueue("", { exclusive: true });
await ch.bindQueue(q.queue, "todo.events", "todo.#");

ch.consume(q.queue, (msg) => {
  if (!msg) return;
  console.log("[amqp sub]", msg.fields.routingKey, msg.content.toString());
});
console.log("[amqp] waiting on todo.# …");
