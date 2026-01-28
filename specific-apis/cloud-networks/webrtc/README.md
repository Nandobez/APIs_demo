# WebRTC DataChannel

Peer-to-peer over **SCTP-on-DTLS-on-UDP** (or via a TURN relay). Browser
native — no flags, no certs. Built for live audio/video but the
``RTCDataChannel`` API gives you ordered or unordered bytes between
arbitrary peers.

## Demo

A minimal *manual signalling* example: open ``index.html`` in two browser
tabs, click "create offer" in one and paste the SDP into the other.

(Production WebRTC needs a signalling server — see Pion, mediasoup or
Janus for full implementations.)

| Layer | Cloud / Networks |
|---|---|
| Transport | SCTP over DTLS over UDP, or TURN relay |
| Wire format | binary frames + optional protocol negotiated by `protocol:` |
| Streaming | yes — ordered or unordered, reliable or unreliable |
| Best fit | P2P chat, low-latency game state, file transfer w/o server |
