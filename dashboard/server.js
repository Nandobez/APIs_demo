/**
 * Dashboard backend — exposes /api/<protocol>/<op> endpoints that
 * proxy to each MainAPI server. Returns { ok, latency_ms, transport, data }.
 * Browser fetches these, no CORS, no protocol headaches.
 */
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import grpcLib from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import jayson from "jayson/promise/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4000;

const ENDPOINTS = {
  rest:     "http://localhost:4001",
  graphql:  "http://localhost:4002/graphql",
  grpc:     "localhost:4003",
  jsonrpc:  "http://localhost:4005",
  trpc:     "http://localhost:4006",
  connect:  "http://localhost:4007",
  webhooks: "http://localhost:4008",
};

// ---------- gRPC client (lazy) ----------
let grpcClient = null;
function getGrpc() {
  if (grpcClient) return grpcClient;
  const def = protoLoader.loadSync(
    path.resolve(__dirname, "../main-apis/grpc/todo.proto"),
    { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
  );
  const pkg = grpcLib.loadPackageDefinition(def).todo;
  grpcClient = new pkg.TodoService(ENDPOINTS.grpc, grpcLib.credentials.createInsecure());
  return grpcClient;
}
const grpcCall = (method, payload = {}) =>
  new Promise((resolve, reject) => {
    getGrpc()[method](payload, (err, res) => (err ? reject(err) : resolve(res)));
  });

// ---------- timing helper ----------
async function timed(transport, fn) {
  const t0 = performance.now();
  try {
    const data = await fn();
    return { ok: true, transport, latency_ms: +(performance.now() - t0).toFixed(2), data };
  } catch (e) {
    return { ok: false, transport, latency_ms: +(performance.now() - t0).toFixed(2), error: String(e.message || e) };
  }
}

// ---------- app ----------
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// REST
app.get("/api/rest/list", async (_req, res) =>
  res.json(await timed("HTTP/1.1 + JSON",
    () => fetch(`${ENDPOINTS.rest}/todos`).then(r => r.json()))));
app.post("/api/rest/create", async (req, res) =>
  res.json(await timed("HTTP/1.1 + JSON", () =>
    fetch(`${ENDPOINTS.rest}/todos`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: req.body.title }),
    }).then(r => r.json()))));

// GraphQL
app.get("/api/graphql/list", async (_req, res) =>
  res.json(await timed("HTTP/1.1 + JSON (single endpoint)", () =>
    fetch(ENDPOINTS.graphql, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ todos { id title done } }" }),
    }).then(r => r.json()))));

// gRPC
app.get("/api/grpc/list", async (_req, res) =>
  res.json(await timed("HTTP/2 + protobuf", () => grpcCall("List", {}))));
app.post("/api/grpc/create", async (req, res) =>
  res.json(await timed("HTTP/2 + protobuf", () => grpcCall("Create", { title: req.body.title }))));

// JSON-RPC
const jsonrpcClient = jayson.Client.http({ host: "localhost", port: 4005 });
console.log("[dash] jsonrpc client ready");
app.get("/api/jsonrpc/list", async (_req, res) =>
  res.json(await timed("HTTP/1.1 + JSON-RPC 2.0", () => jsonrpcClient.request("list", {}).then(r => r.result))));
app.post("/api/jsonrpc/create", async (req, res) =>
  res.json(await timed("HTTP/1.1 + JSON-RPC 2.0", () =>
    jsonrpcClient.request("create", { title: req.body.title }).then(r => r.result))));

// tRPC (raw HTTP form)
app.get("/api/trpc/list", async (_req, res) =>
  res.json(await timed("HTTP/1.1 + JSON (tRPC envelope)", () =>
    fetch(`${ENDPOINTS.trpc}/list`).then(r => r.json()).then(j => j.result?.data))));

// Connect stub
app.get("/api/connect/list", async (_req, res) =>
  res.json(await timed("HTTP/1.1 + JSON (Connect codec stub)", () =>
    fetch(`${ENDPOINTS.connect}/todo.TodoService/List`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
    }).then(r => r.json()))));

// Webhooks — register dashboard as subscriber, then trigger a create
let webhookEvents = [];
app.post("/__webhook_sink", (req, res) => {
  webhookEvents.push({ event: req.header("X-Event"), payload: req.body, at: Date.now() });
  if (webhookEvents.length > 20) webhookEvents.shift();
  res.status(204).end();
});
app.post("/api/webhooks/trigger", async (req, res) => {
  res.json(await timed("HTTP/1.1 callback (server-initiated)", async () => {
    await fetch(`${ENDPOINTS.webhooks}/subscribe`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `http://localhost:${PORT}/__webhook_sink` }),
    });
    const created = await fetch(`${ENDPOINTS.webhooks}/todos`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: req.body.title || "from dashboard" }),
    }).then(r => r.json());
    await new Promise(r => setTimeout(r, 150));
    return { created, recent_events: webhookEvents.slice(-5) };
  }));
});

// ---------- SpecificAPIs catalog ----------
import fs from "node:fs/promises";

const CATALOG = {
  "cloud-networks": ["mqtt", "amqp", "coap", "kafka", "rsocket", "webrtc", "soap", "cloudevents", "asyncapi", "ipfs-bitswap", "dtn-bp"],
  "industrial":     ["modbus", "opcua", "some-ip"],
  "tactical":       ["link16", "jaus"],
  "financial":      ["fix", "iso20022", "fapi"],
  "telecom":        ["camara", "3gpp-nef", "diameter", "smpp"],
  "physical-hw":    ["cxl", "nvme-of", "can-bus", "roce"],
};
const RUNNABLE = new Set(["mqtt", "coap", "modbus", "fix"]);

app.get("/api/catalog", (_req, res) => {
  const out = {};
  for (const [cat, names] of Object.entries(CATALOG)) {
    out[cat] = names.map(n => ({ name: n, runnable: RUNNABLE.has(n) }));
  }
  res.json(out);
});

app.get("/api/docs/:category/:name", async (req, res) => {
  const { category, name } = req.params;
  if (!CATALOG[category]?.includes(name)) return res.status(404).json({ error: "not found" });
  try {
    const md = await fs.readFile(
      path.resolve(__dirname, `../specific-apis/${category}/${name}/README.md`), "utf8");
    res.type("text/plain").send(md);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

// ---------- runnable specific demos ----------
// MQTT: subscribe to local broker (must be started separately), publish + receive
import mqtt from "mqtt";
app.post("/api/specific/mqtt/demo", async (_req, res) =>
  res.json(await timed("MQTT over TCP 1883 (QoS 0)", () => new Promise((resolve, reject) => {
    const c = mqtt.connect("mqtt://localhost:1883", { connectTimeout: 1500 });
    const received = [];
    const t = setTimeout(() => { c.end(true); reject(new Error("MQTT broker offline em :1883 — rode `node specific-apis/cloud-networks/mqtt/server.js`")); }, 2000);
    c.on("connect", () => {
      c.subscribe("todo/stats", () => c.publish("dashboard/probe", JSON.stringify({ ping: Date.now() })));
    });
    c.on("message", (topic, payload) => {
      received.push({ topic, payload: payload.toString().slice(0, 200) });
      if (received.length >= 1) { clearTimeout(t); c.end(true); resolve({ received, note: "Aedes broker publica todo/stats a cada 1.5s" }); }
    });
    c.on("error", (e) => { clearTimeout(t); c.end(true); reject(e); });
  }))));

// CoAP: GET /todos on local CoAP server (UDP 5683)
import coapLib from "coap";
app.post("/api/specific/coap/demo", async (_req, res) =>
  res.json(await timed("CoAP over UDP 5683", () => new Promise((resolve, reject) => {
    const req = coapLib.request({ host: "localhost", port: 5683, method: "GET", pathname: "/todos" });
    const t = setTimeout(() => reject(new Error("CoAP server offline em :5683 — rode `node specific-apis/cloud-networks/coap/server.js`")), 1500);
    req.on("response", (r) => {
      let body = "";
      r.on("data", (c) => body += c.toString());
      r.on("end", () => { clearTimeout(t); resolve({ code: r.code, body: body.slice(0, 500) }); });
    });
    req.on("error", (e) => { clearTimeout(t); reject(e); });
    req.end();
  }))));

// Modbus: connect to TCP :502, read holding registers
import net from "node:net";
app.post("/api/specific/modbus/demo", async (_req, res) =>
  res.json(await timed("Modbus TCP :502 (FC 0x03)", () => new Promise((resolve, reject) => {
    const sock = net.createConnection(5020, "localhost");
    const t = setTimeout(() => { sock.destroy(); reject(new Error("Modbus server offline em :5020 — incluído no run.sh")); }, 1500);
    sock.on("connect", () => {
      // MBAP: TID=0001, ProtoID=0000, Length=0006, UnitID=01 | PDU: FC=03, Addr=0000, Qty=0008
      sock.write(Buffer.from([0x00,0x01, 0x00,0x00, 0x00,0x06, 0x01, 0x03, 0x00,0x00, 0x00,0x08]));
    });
    sock.once("data", (d) => {
      clearTimeout(t); sock.destroy();
      // Skip MBAP (7) + FC (1) + byte-count (1) = 9, read 16 bytes = 8 regs
      const regs = [];
      for (let i = 9; i < d.length; i += 2) regs.push(d.readUInt16BE(i));
      resolve({ unit_id: d[6], function_code: d[7], registers: regs, raw_hex: d.toString("hex") });
    });
    sock.on("error", (e) => { clearTimeout(t); reject(e); });
  }))));

// FIX: encode + decode a NewOrderSingle, no network
import { encode as fixEncode, decode as fixDecode } from "../specific-apis/financial/fix/parser.js";
app.post("/api/specific/fix/demo", async (_req, res) =>
  res.json(await timed("FIX 4.4 tag=value (offline encode+decode)", async () => {
    const order = {
      35: "D", 49: "BUY-SIDE", 56: "SELL-SIDE", 34: 10,
      52: "20260523-21:30:00",
      11: "ORD123", 55: "DUCK", 54: 1, 38: 100, 40: 2, 44: 42.50,
    };
    const buf = fixEncode({ ...order });
    return {
      wire: buf.toString("binary").replace(/\x01/g, "|"),
      length_bytes: buf.length,
      decoded: fixDecode(buf),
      tag_names: { "35": "MsgType (D=NewOrderSingle)", "49": "SenderCompID", "56": "TargetCompID", "11": "ClOrdID", "55": "Symbol", "54": "Side (1=Buy)", "38": "OrderQty", "44": "Price", "9": "BodyLength", "10": "CheckSum" },
    };
  })));

// Health check: which servers are up?
app.get("/api/health", async (_req, res) => {
  const probes = await Promise.all([
    fetch(`${ENDPOINTS.rest}/todos`).then(() => "rest").catch(() => null),
    fetch(`${ENDPOINTS.graphql}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"query":"{__typename}"}' }).then(() => "graphql").catch(() => null),
    grpcCall("List", {}).then(() => "grpc").catch(() => null),
    fetch(`${ENDPOINTS.jsonrpc}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"jsonrpc":"2.0","method":"list","id":1}' }).then(() => "jsonrpc").catch(() => null),
    fetch(`${ENDPOINTS.trpc}/list`).then(() => "trpc").catch(() => null),
    fetch(`${ENDPOINTS.connect}/todo.TodoService/List`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).then(() => "connect").catch(() => null),
    fetch(`${ENDPOINTS.webhooks}/subscribers`).then(() => "webhooks").catch(() => null),
  ]);
  res.json({ up: probes.filter(Boolean) });
});

app.listen(PORT, () =>
  console.log(`[dashboard] http://localhost:${PORT}`));

