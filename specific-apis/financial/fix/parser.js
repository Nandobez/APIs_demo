/**
 * Tiny FIX 4.4 encoder + parser. No external deps.
 *
 *   decode(buf)   -> {35: 'D', 11: 'ORD123', ...}
 *   encode(obj)   -> Buffer with BodyLength (9) + Checksum (10) computed
 */
const SOH = 0x01;

export function decode(buf) {
  const str = buf.toString("binary");
  const fields = {};
  for (const part of str.split(String.fromCharCode(SOH))) {
    if (!part) continue;
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    fields[part.slice(0, eq)] = part.slice(eq + 1);
  }
  return fields;
}

export function encode(fields) {
  // 8 (BeginString) and 9 (BodyLength) come first; 10 (CheckSum) last.
  const begin = `8=${fields["8"] ?? "FIX.4.4"}`;
  delete fields["8"];
  delete fields["9"];
  delete fields["10"];
  const body = Object.entries(fields).map(([t, v]) => `${t}=${v}`).join(String.fromCharCode(SOH));
  const len = body.length + 1;                                  // +1 for trailing SOH
  const prefix = `${begin}${String.fromCharCode(SOH)}9=${len}${String.fromCharCode(SOH)}${body}${String.fromCharCode(SOH)}`;
  let sum = 0;
  for (let i = 0; i < prefix.length; i++) sum = (sum + prefix.charCodeAt(i)) & 0xFF;
  const cs = String(sum).padStart(3, "0");
  return Buffer.from(`${prefix}10=${cs}${String.fromCharCode(SOH)}`, "binary");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const order = {
    35: "D", 49: "BUY-SIDE", 56: "SELL-SIDE", 34: 10,
    52: "20260523-21:30:00",
    11: "ORD123", 21: 1, 55: "DUCK", 54: 1, 38: 100, 40: 2, 44: 42.50, 59: 0,
  };
  const encoded = encode(order);
  console.log("encoded:", encoded.toString("binary").replace(/\x01/g, "|"));
  console.log("decoded:", decode(encoded));
}
