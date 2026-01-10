# MQTT 3.1.1

Pub/sub over TCP, designed for IoT — tiny headers, QoS levels, retained
messages.

```bash
node server.js                                  # :1883
mosquitto_sub -h localhost -p 1883 -t 'todo/#'
mosquitto_pub -h localhost -p 1883 -t 'todo/cmd' -m '{"action":"ping"}'
```

| Layer | Cloud / IoT |
|---|---|
| Transport | TCP (or WSS for browsers) |
| Wire format | binary control packets + arbitrary payload |
| Streaming | yes (pub/sub) |
| Best fit | constrained devices, telemetry, last-will messages |
