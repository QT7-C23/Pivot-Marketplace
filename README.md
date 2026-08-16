# Pivot Marketplace

Official signed catalog and distribution metadata for Pivot Marketplace, including plugins, skills, prompts, themes, compatibility data, and release manifests.

> [!IMPORTANT]
> This repository is under initialization. No production catalog or installable package feed is published yet. A catalog contract or user interface alone does not mean that package installation is available in Pivot.

## Purpose

This repository is the public distribution surface for the official Pivot Marketplace. It is intentionally separate from the Pivot desktop application so catalog publishing can use a narrow, auditable trust boundary.

When production publishing is enabled, this repository will provide:

- a strictly validated marketplace catalog;
- signed metadata for official releases;
- compatibility and integrity information;
- public documentation for publishers and reviewers.

Extension archives should be distributed as release artifacts instead of being committed as opaque binaries to the default branch.

## Trust model

- Pivot treats downloaded catalogs and packages as untrusted input.
- Catalog payloads are signed with Ed25519 and verified inside Pivot's Main process.
- Package bytes must match their declared SHA-256 digest and signature before installation.
- The private signing key must never be stored in this repository, in the Pivot client, or in a release archive.
- Renderer and Worker processes do not receive signing secrets, filesystem authority, database handles, or administrative capabilities.
- Expired, malformed, mismatched, or unverifiable content is rejected rather than silently accepted.

See [Trust Model](docs/TRUST-MODEL.md) for the publication and key-management boundary.

## Planned repository layout

```text
catalog.json          Signed production catalog (not published yet)
docs/                 Public trust and publishing documentation
.github/              Repository ownership and automation policy
README.md              Repository status and entry point
SECURITY.md            Private security-reporting guidance
CONTRIBUTING.md        Contribution and package-submission policy
```

The absence of `catalog.json` is deliberate until the signing and package-verification pipeline is production-ready. An unsigned placeholder would fail closed in Pivot and could create a misleading release signal.

## Contributing

The marketplace is not accepting public package submissions during initialization. Documentation, validation, security, and publishing-tool improvements may be proposed under the rules in [CONTRIBUTING.md](CONTRIBUTING.md).

Never submit private keys, API tokens, passwords, `.env` files, or unpublished package credentials.

## Security

Do not report signing-key exposure or exploitable package-verification defects in a public issue. Follow [SECURITY.md](SECURITY.md) for private reporting and immediate containment guidance.

## License

Repository-authored documentation and tooling are licensed under the [Apache License 2.0](LICENSE), unless a file states otherwise. Third-party extensions retain the license declared and bundled by their respective publishers; marketplace inclusion does not relicense third-party work.
