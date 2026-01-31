/**
 * MQTT 3.1.1 — pub/sub over TCP for IoT.
 *
 * Spins up an embedded broker (aedes) and a tiny publisher that announces
 * "todo.*" events. Any MQTT client (mosquitto_sub, MQTT.fx, etc) can
 * subscribe to ``todo/#`` and watch the stream.
 */
import { createServer } from "node:net";
import Aedes from "aedes";
import { Store } from "../../../main-apis/_shared/store.js";

const broker = new Aedes();
const PORT = process.env.PORT || 1883;
createServer(broker.handle).listen(PORT, () =>
  console.log(`[mqtt]    broker listening on tcp://localhost:${PORT}`),
);

setInterval(() => {
  const tick = {
    todos: Store.list().length,
    ts: Date.now(),
  };
  broker.publish({ topic: "todo/stats", payload: JSON.stringify(tick), qos: 0 });
}, 1500);

broker.on("client", (c) => console.log("[mqtt] connect ", c.id));
broker.on("subscribe", (s, c) => console.log("[mqtt] sub    ", c.id, s.map(t => t.topic).join(",")));
broker.on("publish", (p, c) => c && console.log("[mqtt] msg    ", p.topic, p.payload?.toString()));
