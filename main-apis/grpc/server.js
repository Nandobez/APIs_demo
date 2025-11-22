/**
 * gRPC over HTTP/2 + Protobuf.
 *
 * Schema-first, binary, supports server / client / bidi streaming.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { Store } from "../_shared/store.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const def = protoLoader.loadSync(path.join(HERE, "todo.proto"), {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const pkg = grpc.loadPackageDefinition(def).todo;

const impl = {
  List:   (_call, cb) => cb(null, { items: Store.list() }),
  Get:    (call,  cb) => {
    const t = Store.get(call.request.id);
    return t ? cb(null, t) : cb({ code: grpc.status.NOT_FOUND });
  },
  Create: (call,  cb) => cb(null, Store.create(call.request.title)),
  Update: (call,  cb) => {
    const t = Store.update(call.request.id, {
      title: call.request.title || undefined,
      done:  typeof call.request.done === "boolean" ? call.request.done : undefined,
    });
    return t ? cb(null, t) : cb({ code: grpc.status.NOT_FOUND });
  },
  Delete: (call,  cb) => { Store.remove(call.request.id); cb(null, {}); },
};

const server = new grpc.Server();
server.addService(pkg.TodoService.service, impl);
const PORT = process.env.PORT || 4003;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () =>
  console.log(`[grpc]    listening on grpc://localhost:${PORT}`));
