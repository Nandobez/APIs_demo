# Link 16

**MIL-STD-6016 / STANAG 5516.** NATO tactical data-link for fighters,
AEW&C, surface ships and ground radars. Time-Division Multiple Access
(TDMA) over Joint Tactical Information Distribution System (JTIDS) or
MIDS radios. ~30 km line-of-sight, encrypted, jam-resistant.

## What ships here (docs-only)

Real Link 16 stacks are classified and require certified MIDS radios
(Crypto Modernization Programme). No open-source implementation exists.
This folder ships a brief reference plus a JSON sample of a J3.2 (PPLI —
Precise Participant Location Identifier) message in the unclassified
LCT format used by tactical simulators:

```jsonc
// J3.2 Precise Participant Location & Identification
{
  "type": "J3.2",
  "stn": "00123",        // Source Track Number
  "lat": 35.6895,
  "lon": 139.6917,
  "alt_ft": 28000,
  "course_deg": 90,
  "speed_kts": 420,
  "platform": "fighter",
  "callsign": "EAGLE01"
}
```

| Layer | Tactical |
|---|---|
| Transport | TDMA radio (UHF) |
| Wire format | 70-bit binary slots × 256-message classes |
| Streaming | yes — continuous TDMA frames |
| Best fit | air-to-air / air-to-ground tactical situational awareness |
