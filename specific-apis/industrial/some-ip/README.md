# SOME/IP

**S**calable service-**O**riented **M**iddlewar**E** **/IP**. AUTOSAR's
in-vehicle service bus. Runs over UDP/TCP, frames carry a 16-byte header
+ Service-Discovery messages so ECUs can find each other without
hard-coded IPs.

## Sample header

```
+---------------+---------------+
| Service ID    | Method ID     |
+---------------+---------------+
| Length        | Client ID     |
+---------------+---------------+
| Session ID    | Proto | Iface |
+---------------+---------------+
| MsgType (0x80=Notification)   |
+-------------------------------+
| Return code                   |
+-------------------------------+
| Payload                       |
+-------------------------------+
```

## What ships here

Doc-only. A working implementation lives in https://github.com/sieren/vsomeip
(C++, AUTOSAR-compliant). For purely educational purposes there is also
``some-ip-mock`` (Node) which can publish notifications over UDP.

| Layer | Tactical / Industrial (automotive) |
|---|---|
| Transport | UDP or TCP |
| Wire format | 16-byte binary header + payload |
| Streaming | yes — notifications, events |
| Best fit | in-vehicle ECU communication (AUTOSAR Adaptive) |
