# RoCE — RDMA over Converged Ethernet

Brings InfiniBand Verbs semantics to Ethernet. NIC-offloaded zero-copy
reads + writes between host memories.

- **RoCEv1**: link-layer (Ethertype 0x8915), single L2 domain only.
- **RoCEv2**: UDP/IPv4 (dst port 4791), routable across L3.

## Why it matters

- AI training: NCCL, all-reduce, gradient sync (NVIDIA Spectrum-X).
- Storage: NVMe-oF over RoCE for ~10 µs target latency.
- HFT: kernel-bypass receive paths.

## Software view

Userspace uses ``libibverbs`` / ``rdma-core``: ``ibv_post_send``, ``ibv_post_recv``,
queue pairs, completion queues. Nothing in JS lands; the relevant
languages are C, C++, Rust, and CUDA.

| Layer | Physical / Hardware |
|---|---|
| Transport | UDP (RoCEv2) over Ethernet 25/100/400G |
| Wire format | InfiniBand Verbs over UDP |
| Streaming | yes — RDMA reads / writes |
| Best fit | GPU clusters, NVMe-oF, low-latency trading |
