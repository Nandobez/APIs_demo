# CXL — Compute Express Link

PCIe-based cache-coherent fabric for connecting CPUs, accelerators and
memory pools. Three sub-protocols share the same PCIe lanes:

- ``CXL.io``   — config + DMA, semantically PCIe TLPs.
- ``CXL.cache``— device-to-host cache coherence.
- ``CXL.mem``  — host loads/stores into device-attached memory.

## Where you meet it

- AMD EPYC Genoa / Intel Sapphire Rapids servers, multi-host memory
  pooling appliances (MemVerge, Astera Labs).
- Disaggregated memory tiers ("memory expansion") for in-memory
  databases.

## Not an *application* API

CXL lives below the OS. Software talks to it through ordinary memory
loads / stores; the OS uses CXL.io for enumeration. There's no "API" in
the developer sense, just a memory map exposed by firmware.

| Layer | Physical / Hardware |
|---|---|
| Transport | PCIe 5.0 / 6.0 lanes |
| Wire format | TLPs + cache-coherence opcodes |
| Streaming | n/a |
| Best fit | memory pooling, GPU-CPU coherence, near-memory accelerators |
