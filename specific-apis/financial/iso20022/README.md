# ISO 20022

The XML / JSON message family that replaces SWIFT MT for cross-border
payments, securities, FX and cards. Coordinated by ISO + SWIFT; SEPA,
Pix, FedNow, CBDC pilots all use it.

## Sample pacs.008 (customer credit transfer) — XML

```xml
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>DUCK20260523001</MsgId>
      <CreDtTm>2026-05-23T21:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf><SttlmMtd>INDA</SttlmMtd></SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId>
      <IntrBkSttlmAmt Ccy="EUR">1234.56</IntrBkSttlmAmt>
      <Dbtr><Nm>Fernando Bezerra</Nm></Dbtr>
      <DbtrAcct><Id><IBAN>DE89370400440532013000</IBAN></Id></DbtrAcct>
      <DbtrAgt><FinInstnId><BICFI>COBADEFFXXX</BICFI></FinInstnId></DbtrAgt>
      <Cdtr><Nm>Recipient</Nm></Cdtr>
      <CdtrAcct><Id><IBAN>NL91ABNA0417164300</IBAN></Id></CdtrAcct>
      <CdtrAgt><FinInstnId><BICFI>ABNANL2AXXX</BICFI></FinInstnId></CdtrAgt>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
```

## What ships here

Doc-only — ISO 20022 has hundreds of message types and the schemas are
giant. Real implementations live behind banks and PSPs (Bottomline,
Volante, FIS).

| Layer | Cloud / Finance |
|---|---|
| Transport | over HTTPS, MQ, file, SWIFTNet |
| Wire format | XML (primary) or JSON (RC-2024) |
| Streaming | no — discrete messages |
| Best fit | interbank settlement, real-time payments |
