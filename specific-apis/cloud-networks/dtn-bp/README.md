# DTN / Bundle Protocol v7

**Delay/Disruption-Tolerant Networking** (RFC 9171). Store-and-forward
overlay for environments where end-to-end connectivity is intermittent —
spacecraft, deep-sea sensor swarms, refugee-camp mesh networks.

## Bundle layout (CBOR-encoded)

```
+----------+-------------------------+
| Primary  | Version | Flags | CRC… |
| block    | Source EID  Dest EID    |
|          | Creation ts | Lifetime  |
+----------+-------------------------+
| Payload  | Block-type | Flags     |
| block    | Data length | Data...  |
+----------+-------------------------+
| Extension blocks (security, …)   |
+----------------------------------+
```

EIDs (Endpoint IDs) look like ``ipn:1.0`` or ``dtn://moon/probe-2``.

## What ships here

Doc + ION reference. NASA's **ION-DTN** is the canonical implementation;
**HDTN** and Rust **dtn7-rs** are modern alternatives. Used by the
Interplanetary Internet experiments + lunar gateway comms planning.

| Layer | Networks / Space |
|---|---|
| Transport | LTP over UDP, TCPCL, BPv7 over UDP/QUIC |
| Wire format | CBOR-encoded bundles |
| Streaming | store-and-forward — *not* real-time |
| Best fit | comms with hours / days of round-trip delay |
