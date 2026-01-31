/** Tiny AMQP publisher — sends a JSON event every 2s to the "todo.events" exchange. */
import amqp from "amqplib";

const URL = process.env.AMQP_URL || "amqp://localhost";
const conn = await amqp.connect(URL);
const ch = await conn.createChannel();
await ch.assertExchange("todo.events", "topic", { durable: false });

let seq = 0;
setInterval(() => {
  const event = { seq: ++seq, ts: Date.now(), kind: "tick" };
  ch.publish("todo.events", "todo.tick", Buffer.from(JSON.stringify(event)));
  console.log("[amqp pub]", event);
}, 2000);
