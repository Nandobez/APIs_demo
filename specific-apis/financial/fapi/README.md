# FAPI (Financial-grade API)

OpenID Foundation profile that hardens OAuth 2.0 + OIDC for open banking.
Mandates:

- PKCE, mTLS / Private-Key-JWT client auth
- PAR (Pushed Authorization Requests)
- JARM (signed authorization responses)
- Bound access tokens to the TLS cert (DPoP or `cnf` claim)
- Strict signing algorithms (PS256, ES256)

## Used by

UK Open Banking, Open Banking Brasil, Berlin Group (PSD2), CDR
(Australian Consumer Data Right).

## What ships here

Doc-only. A working FAPI conformance test suite is at
https://gitlab.openid.net/fapi/conformance-suite. For Node demos
the ``oidc-provider`` library supports the FAPI 2.0 profile via config.

| Layer | Cloud / Finance |
|---|---|
| Transport | HTTPS + mTLS |
| Wire format | JSON + signed JWTs |
| Streaming | no — request/response |
| Best fit | bank-grade APIs requiring regulatory compliance |
