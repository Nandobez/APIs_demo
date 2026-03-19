# Diameter

AAA protocol (Authentication, Authorization, Accounting) — successor to
RADIUS. Used inside LTE/5G cores: HSS, PCRF, OCS, S6a/S13/Gx/Gy/Rx
interfaces.

## Frame layout

```
+--------+--------+--------+--------+
| Version (1B) = 1                  |
| Length (3B)                       |
+--------+--------+--------+--------+
| Cmd Flags (1B) | Cmd Code (3B)    |
+--------+--------+--------+--------+
| Application-ID (4B)               |
+-----------------------------------+
| Hop-by-Hop Identifier (4B)        |
+-----------------------------------+
| End-to-End Identifier (4B)        |
+-----------------------------------+
| AVPs (TLV)                        |
+-----------------------------------+
```

Each AVP is `Code(4) Flags(1) Length(3) [VendorID(4)] Data`.

## What ships here

Doc-only. Working Node implementation: ``node-diameter``. Production
HSS/PCRF use C/C++ stacks (FreeDiameter, openIMS).

| Layer | Telecom |
|---|---|
| Transport | TCP or SCTP |
| Wire format | TLV with vendor extensions |
| Streaming | no — request/answer with peer state machines |
| Best fit | 4G/5G authentication, subscriber profile, charging |
