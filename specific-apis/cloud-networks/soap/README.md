# SOAP

XML envelope + WSDL schema. Born 1999, still alive inside banks, ERPs
and government systems. Heavy, but every IDE has tooling for it.

## Sample request

```xml
POST /todo HTTP/1.1
Content-Type: text/xml; charset=utf-8
SOAPAction: "urn:CreateTodo"

<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CreateTodo xmlns="urn:duck">
      <title>via SOAP</title>
    </CreateTodo>
  </soap:Body>
</soap:Envelope>
```

## What ships here

Doc + sample. Working Node SOAP server / client lives in ``strong-soap``
(IBM) or ``soap`` (npm). Tooling: SoapUI, wsimport, svcutil.

| Layer | Cloud / Enterprise |
|---|---|
| Transport | HTTP, SMTP, JMS |
| Wire format | XML + WSDL |
| Streaming | no (one envelope per request) |
| Best fit | regulated systems with strict contracts (banking, gov, ERP) |
