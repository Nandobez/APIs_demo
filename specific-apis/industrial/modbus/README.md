# Modbus TCP

Industrial fieldbus born in 1979. Master polls registers on a slave PLC.
Trivial wire format, ubiquitous in factories.

## Frame layout (Modbus-TCP, function 03 = read holding registers)

```
+-----------+-----------+----------+------+-------+-----------+-----------+
| TxId (2B) | Proto (2B)| Len (2B) | Unit | Func  | StartReg  | Quantity  |
| 0x0001    | 0x0000    | 0x0006   | 0x01 | 0x03  | 0x0000    | 0x000A    |
+-----------+-----------+----------+------+-------+-----------+-----------+
```

## Demo

```bash
node server.js              # TCP/502 — emulates a PLC with 16 registers
node client.js              # polls registers 0..9 once per second
```

| Layer | Industrial |
|---|---|
| Transport | TCP/502 or RS-485 (Modbus RTU) |
| Wire format | 12-byte header + payload |
| Streaming | no — request/response polling |
| Best fit | SCADA, building automation, energy meters |
