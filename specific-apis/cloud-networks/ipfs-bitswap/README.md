# IPFS BitSwap

Block-exchange protocol that powers IPFS / Filecoin / Web3 content
delivery. Peers gossip *wantlists* (CIDs they need) and trade blocks
directly. Strategy = "I send blocks to peers who send me blocks back."

## Message shape (protobuf — bitswap/1.2.0)

```protobuf
message Message {
  message Wantlist {
    enum WantType { Block = 0; Have = 1; }
    repeated Entry entries = 1;
    bool   full       = 2;
  }
  message Entry {
    bytes    block        = 1;     // CID bytes
    int32    priority     = 2;
    bool     cancel       = 3;
    WantType wantType     = 4;
    bool     sendDontHave = 5;
  }
  Wantlist  wantlist = 1;
  repeated Block payload   = 2;
  repeated BlockPresence  blockPresences = 4;
  int32     pendingBytes   = 5;
}
```

## What ships here

Doc-only. For a working node use ``js-ipfs`` (deprecated but still works)
or **Helia** (modern Node IPFS). BitSwap is bundled inside Helia.

| Layer | Cloud / P2P |
|---|---|
| Transport | libp2p (TCP, QUIC, WebRTC, WebTransport) |
| Wire format | length-prefixed protobuf |
| Streaming | yes — bidirectional block exchange |
| Best fit | content-addressable storage, decentralised CDN, IPLD |
