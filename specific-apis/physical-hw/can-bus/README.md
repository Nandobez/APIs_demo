# CAN bus

**C**ontroller **A**rea **N**etwork. Differential 2-wire bus used in
cars, industrial PLCs, agricultural machinery and medical devices since
1986. Multi-master, broadcast, 1 Mbps (Classic) / 8 Mbps (CAN-FD).

## Frame layout (Classic, 11-bit ID)

```
SOF | Arb-ID (11b) | RTR | IDE | r0 | DLC | Data (0-8B) | CRC | ACK | EOF
```

## Talking to it from software

- Linux SocketCAN: ``ip link set up can0 type can bitrate 500000``, then
  open with ``socket(PF_CAN, SOCK_RAW, CAN_RAW)``.
- Node: ``socketcan`` npm package.
- Userspace tools: ``cansniffer``, ``candump``, ``cangen``.

## Sample SocketCAN snippet

```js
import { RawChannel } from "socketcan";
const ch = RawChannel("can0");
ch.addListener("onMessage", (m) => console.log(m.id.toString(16), m.data));
ch.start();
```

| Layer | Physical / Hardware |
|---|---|
| Transport | differential pair, 1 Mbps (Classic) / 8 Mbps (FD) |
| Wire format | 1-byte fields with bit-stuffing |
| Streaming | yes — broadcast bus |
| Best fit | in-vehicle networks, robotics, industrial PLCs |
