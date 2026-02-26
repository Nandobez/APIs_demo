# JAUS

**Joint Architecture for Unmanned Systems.** SAE AS4 standard for
unmanned-vehicle interoperability — ground, air, surface, undersea.
Hierarchical addressing (Subsystem / Node / Component / Service) +
binary message set.

## Sample SetVelocity message (JTS / R-A8-0001)

```
+------------+------------+-----------+-----------+
| Header     | MsgID 0x06 | LinVelX   | LinVelY   |
| 12 bytes   | (uint16)   | f32 m/s   | f32 m/s   |
+------------+------------+-----------+-----------+
| LinVelZ    | AngVelZ    | TimeStamp           |
| f32 m/s    | f32 rad/s  | uint32 ms epoch     |
+------------+------------+----------------------+
```

## What ships here

Doc + payload sample. Reference Java toolkit: JAUS Toolset (JTS).
For Node experimentation see ``jaus-bridge`` on GitHub (community).

| Layer | Tactical / Robotics |
|---|---|
| Transport | UDP, TCP or shared memory |
| Wire format | binary, little-endian |
| Streaming | yes — service-driven events |
| Best fit | unmanned-ground / aerial vehicle command + telemetry |
