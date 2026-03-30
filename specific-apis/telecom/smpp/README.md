# SMPP 3.4 / 5.0

**S**hort **M**essage **P**eer-to-**P**eer. The protocol SMS centres (SMSC)
speak with bulk-SMS aggregators (Twilio, Sinch, Infobip). Connection-
oriented over TCP, binary PDUs.

## PDU header

```
+-----+------+--------+-----------+
| Len | CmdID | Status | Sequence |
| 4B  | 4B    | 4B     | 4B       |
+-----+------+--------+-----------+
| Body…                          |
+--------------------------------+
```

Common CmdIDs: ``bind_transceiver (0x09)``, ``submit_sm (0x04)``,
``deliver_sm (0x05)``, ``enquire_link (0x15)``.

## What ships here

Doc-only sample. Working Node lib: ``smpp`` (npm). Most carriers
provide a test SMSC with throttled throughput (1 msg/s) for sandboxing.

| Layer | Telecom |
|---|---|
| Transport | TCP (TLS optional) |
| Wire format | binary PDU + optional TLVs |
| Streaming | yes — long-lived session, async deliveries |
| Best fit | A2P / P2A SMS gateway integration |
