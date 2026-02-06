/** Polls registers 0..9 every second and prints them. */
import net from "node:net";

const socket = net.connect(Number(process.env.PORT || 5020), "localhost", () => {
  setInterval(() => {
    // TxId=1, Proto=0, Len=6, Unit=1, Func=0x03, Start=0, Qty=10
    const req = Buffer.from([0,1, 0,0, 0,6, 1, 0x03, 0,0, 0,10]);
    socket.write(req);
  }, 1000);
});

socket.on("data", (buf) => {
  const count = buf.readUInt8(8);
  const regs = [];
  for (let i = 0; i < count; i += 2) regs.push(buf.readUInt16BE(9 + i));
  console.log("[modbus]", regs);
});
