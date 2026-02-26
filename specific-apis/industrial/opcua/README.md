# OPC UA

Successor to OPC. Information-modeling layer on top of binary or HTTP +
JSON. Each device exposes a typed namespace browsable like a filesystem.

## What ships here

Reference docs + a launcher snippet using ``node-opcua`` — install with
``npm i node-opcua`` and run ``node server.js``. The server publishes a
single floating-point variable ``ns=1;s=Temperature`` updated each second.

## Why use it

- Standardised information model (companion specs for autos, robotics, packaging).
- Mandatory security (X.509 certs, signing, encryption) — unlike Modbus.
- Pub-Sub over UDP / MQTT (OPC UA Part 14) for low-latency manufacturing.

| Layer | Industrial |
|---|---|
| Transport | Binary TCP (port 4840) or HTTPS |
| Wire format | UA-binary or JSON |
| Streaming | yes — Subscriptions + monitored items |
| Best fit | Industry 4.0 / IIoT, factory automation |
