# NVMe over Fabrics (NVMe-oF)

Carries NVMe submission/completion queues across a network instead of
PCIe. Transports: RDMA (RoCEv2 / InfiniBand), Fibre Channel, TCP.

## Sample namespace command

```
[Host]                                  [Target]
 +--------------------------+              |
 | NVMe Submission Queue    | -- fabric -> | execute on SSD
 | (read LBA 0x1234, len 8) |              |
 +--------------------------+              |
                <- Completion (status, LBA payload) ---+
```

## Not a programmable API

Userspace sees an ordinary block device. The fabric layer is configured
by the host kernel (``nvme connect-all -t tcp -a 10.0.0.5 -s 4420``).

## Where you meet it

- Hyperscale storage (Pure FlashArray, NetApp ASA r2, AWS Nitro SSDs)
- Composable infrastructure (Liqid, GigaIO)

| Layer | Physical / Networks |
|---|---|
| Transport | RDMA, Fibre Channel, TCP |
| Wire format | NVMe SQ/CQ entries + capsules |
| Streaming | yes — async I/O queues |
| Best fit | shared NVMe pools at low latency (~µs) |
