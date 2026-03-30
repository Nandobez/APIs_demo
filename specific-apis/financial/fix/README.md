# FIX 4.4 / 5.0 SP2

Tag-value protocol over TCP, the lingua franca of trading desks since
1992. Every field is ``tag=value\x01`` (SOH 0x01 separator).

## Sample New-Order-Single (35=D)

```
8=FIX.4.4\x019=178\x0135=D\x0149=BUY-SIDE\x0156=SELL-SIDE\x0134=10\x01
52=20260523-21:30:00\x0111=ORD123\x0121=1\x0155=DUCK\x0154=1\x0138=100\x01
40=2\x0144=42.50\x0159=0\x0110=187\x01
```

## What ships here

A self-contained parser/encoder in ``parser.js`` — no external lib.

```bash
node parser.js
# prints the decoded fields + re-encodes
```

For full session-level FIX (logon, heartbeats, sequence resend, recovery)
use **jspurefix** (Node) or **QuickFIX/J** (Java).

| Layer | Cloud / Finance |
|---|---|
| Transport | TCP, framed by SOH bytes |
| Wire format | tag=value text, with checksum at 10= |
| Streaming | yes — long-lived TCP session with heartbeats |
| Best fit | order routing between trading desks, dark-pools |
