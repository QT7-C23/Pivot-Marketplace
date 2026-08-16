# Security Policy

## Current status

Pivot Marketplace is being initialized. No production catalog or installable package feed is published from this repository yet.

## Reporting a vulnerability

Do not open a public issue for any report involving:

- signing-key exposure or suspected key compromise;
- catalog-signature or package-signature bypass;
- hash-verification bypass;
- path traversal, unsafe archive extraction, or arbitrary file overwrite;
- privilege-boundary escape between Renderer, Worker, and Main;
- malicious package execution or sandbox escape;
- credentials, personal data, or unpublished release artifacts.

Use GitHub Private Vulnerability Reporting if it is enabled for this repository. Otherwise, contact the repository owner through an established private channel before sharing reproduction details. Include the affected version, impact, minimum reproduction steps, and relevant logs with secrets removed.

Public issues are appropriate only for non-sensitive documentation defects and behavior that cannot expose users, credentials, signing material, or release integrity.

## Signing-key handling

- Private signing keys must be generated and stored outside all Git repositories.
- Private keys must not be embedded in Pivot, extension archives, screenshots, logs, issues, pull requests, or build artifacts.
- Public verification keys may be distributed with Pivot and documented publicly.
- Signing operations must use reviewed tooling and exact canonical serialization.
- Every release must be verified independently before publication.

## Suspected key compromise

If a private signing key may have been exposed:

1. Stop catalog and package publication immediately.
2. Preserve relevant audit evidence without copying the exposed key into reports.
3. Treat every artifact signed after the earliest possible exposure as untrusted.
4. Generate a new key offline and follow a reviewed trust-root rotation procedure.
5. Publish a security notice only after containment details cannot worsen the exposure.

Deleting a leaked key from the latest commit is not sufficient because Git history and external clones may retain it.
