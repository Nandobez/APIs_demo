/**
 * Tiny Modbus-TCP slave that holds 16 holding registers and answers
 * Read-Holding-Registers (function 0x03). Built on plain ``net`` so we
 * don't pull in a Modbus library.
 */
import net from "node:net";

const registers = new Uint16Array(16);
for (let i = 0; i < 16; i++) registers[i] = (Math.random() * 65535) | 0;
setInterval(() => (registers[0] = (registers[0] + 1) & 0xFFFF), 1000);

const server = net.createServer((socket) => {
  socket.on("data", (buf) => {
    if (buf.length < 12 || buf.readUInt8(7) !== 0x03) return;     // only func 03
    const txId = buf.readUInt16BE(0);
    const start = buf.readUInt16BE(8);
    const qty   = buf.readUInt16BE(10);
    const data  = Buffer.alloc(qty * 2);
    for (let i = 0; i < qty; i++) data.writeUInt16BE(registers[(start + i) & 0x0F], i * 2);
    const resp = Buffer.concat([
      Buffer.alloc(8),                                  // header
      Buffer.from([data.length]),                       // byte count
      data,
    ]);
    resp.writeUInt16BE(txId, 0);                        // TxId
    resp.writeUInt16BE(0, 2);                            // Proto
    resp.writeUInt16BE(3 + data.length, 4);              // Len
    resp.writeUInt8(buf.readUInt8(6), 6);                // Unit
    resp.writeUInt8(0x03, 7);                            // Func
    socket.write(resp);
  });
});
const PORT = Number(process.env.PORT || 5020);
server.listen(PORT, () => console.log(`[modbus] tcp listening on :${PORT}`));
