<div align="center">

<pre>
███╗   ███╗██╗   ██╗██╗  ████████╗██╗ █████╗ ██████╗ ██╗
████╗ ████║██║   ██║██║  ╚══██╔══╝██║██╔══██╗██╔══██╗██║
██╔████╔██║██║   ██║██║     ██║   ██║███████║██████╔╝██║
██║╚██╔╝██║██║   ██║██║     ██║   ██║██╔══██║██╔═══╝ ██║
██║ ╚═╝ ██║╚██████╔╝███████╗██║   ██║██║  ██║██║     ██║
╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
</pre>

### A guided tour of modern API patterns and protocol families

[![Node.js](https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

</div>

Dois pacotes + dashboard:

| Pacote | Conteúdo |
|---|---|
| [`main-apis/`](./main-apis) | Sete padrões cotidianos — **REST, GraphQL, gRPC, tRPC, JSON-RPC, Connect, Webhooks**. Mesmo CRUD de Todo em todos, o que varia é o *wire format*. |
| [`specific-apis/`](./specific-apis) | Field-guide do resto — industrial, tático, telecom, financeiro, hardware, P2P. Código rodando onde faz sentido (MQTT, AMQP, CoAP, RSocket, Modbus, Kafka, parser FIX), specs + payloads no resto (Link 16, RoCE, CXL, NVMe-oF, DTN BP). |
| [`dashboard/`](./dashboard) | Painel web em `:4000` que dispara chamadas reais a cada API, mede latência e renderiza o JSON cru. Inclui catálogo dos SpecificAPIs com READMEs + demos rodáveis (MQTT, CoAP, Modbus, FIX). |

## Quickstart

```bash
npm install         # 1x — instala todas as deps
bash run.sh         # sobe 11 servers + dashboard
```

Abre **<http://localhost:4000>**. Ctrl-C derruba tudo. `run.sh` mata
processos antigos nas portas antes de subir, então pode rodar repetido.

## Como o dashboard funciona

```
              ┌──────────────────┐
   browser ──▶│  dashboard :4000 │──┐
              └──────────────────┘  │  HTTP / gRPC / MQTT / CoAP / Modbus
                                    ├─▶ rest      :4001
                                    ├─▶ graphql   :4002
                                    ├─▶ grpc      :4003
                                    ├─▶ jsonrpc   :4005
                                    ├─▶ trpc      :4006
                                    ├─▶ connect   :4007
                                    ├─▶ webhooks  :4008
                                    ├─▶ mqtt      :1883  (broker)
                                    ├─▶ coap      :5683  (UDP)
                                    └─▶ modbus    :5020
```

O navegador só fala JSON com `:4000`. Tudo que é estranho (HTTP/2 +
protobuf no gRPC, binário do Modbus, broker MQTT, UDP do CoAP) acontece
*server-side* dentro do dashboard, que devolve `{ ok, transport,
latency_ms, data }` uniforme. Isso evita CORS, evita Envoy proxy pro
gRPC e deixa todo protocolo testável com um clique.

### Cards do grid principal

| Card | Operações | Transport real |
|---|---|---|
| REST | list, create | HTTP/1.1 + JSON |
| GraphQL | list | HTTP/1.1, endpoint único, query no body |
| gRPC | list, create | HTTP/2 + protobuf (`@grpc/grpc-js` no proxy) |
| tRPC | list | HTTP/1.1, envelope `{ result: { data } }` |
| JSON-RPC | list, create | JSON-RPC 2.0 sobre HTTP/1.1 |
| Connect | list | HTTP/1.1 + JSON em `POST /<pkg>.<Svc>/<Method>` |
| Webhooks | trigger | HTTP/1.1 inverso — dashboard se registra como subscriber, dispara `POST /todos`, recebe callback em `/__webhook_sink` |

Botão **"Benchmark · list ×20"** no rodapé chama `list` 20 vezes em
cada protocolo e mostra a média.

## Catálogo SpecificAPIs

Embaixo do grid, painel com os 28 protocolos agrupados em 6 camadas
(Cloud, Industrial, Tactical, Financial, Telecom, Physical-HW). Cada
chip abre o README do protocolo. Quatro têm **demo rodável**:

| Demo | O que faz |
|---|---|
| **MQTT** | Conecta no broker Aedes em `:1883`, subscribe em `todo/stats`, recebe 1 publicação e devolve o payload |
| **CoAP** | GET `/todos` em UDP `:5683`, devolve `code 2.05` + body |
| **Modbus** | Envia MBAP + PDU (FC 0x03) em `:5020`, lê 8 holding registers e devolve em decimal + hex |
| **FIX** | Encoda `NewOrderSingle` (MsgType=D) com BodyLength + Checksum, depois decoda — tudo offline |

## Tiers

| Tier | Tratamento | Exemplos |
|---|---|---|
| **A · runnable** | server + client + curl | REST, GraphQL, gRPC, tRPC, JSON-RPC, Connect, Webhooks, MQTT, CoAP, RSocket, Modbus |
| **B · parser / simulator** | sample manual + parser + tradeoffs | FIX, AMQP demo, Kafka demo, CloudEvents, AsyncAPI |
| **C · docs + payload** | visão arquitetural, quando usar, mensagem-exemplo | SOAP, ISO 20022, FAPI, OPC UA, SOME/IP, Link 16, JAUS, CXL, NVMe-oF, RoCE, CAN bus, Diameter, SMPP, 3GPP NEF, CAMARA, IPFS BitSwap, DTN/BP |

## Layout

```
MultiProtocolAPIs/
├── dashboard/
│   ├── server.js                            # proxy unificado + catalog
│   └── public/index.html                    # UI
├── run.sh                                   # sobe os 11 servers
├── main-apis/
│   ├── rest/        graphql/    grpc/      trpc/
│   ├── jsonrpc/     connect/    webhooks/
│   └── _shared/                             # Todo store compartilhado
└── specific-apis/
    ├── cloud-networks/  mqtt amqp coap kafka rsocket webrtc soap
    │                    cloudevents asyncapi ipfs-bitswap dtn-bp
    ├── industrial/      modbus opcua some-ip
    ├── tactical/        link16 jaus
    ├── financial/       fix iso20022 fapi
    ├── telecom/         camara 3gpp-nef diameter smpp
    └── physical-hw/     cxl nvme-of can-bus roce
```

## Rodando protocolos individualmente

Cada folder tem seu README com curl. Exemplos:

```bash
# REST
curl http://localhost:4001/todos

# JSON-RPC
curl -X POST http://localhost:4005 -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"list","id":1}'

# CoAP (precisa coap-cli)
coap get coap://localhost:5683/todos
```

## License

MIT — ver [`LICENSE`](./LICENSE).
