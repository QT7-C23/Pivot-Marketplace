# Contributing to Pivot Marketplace

Thank you for helping improve Pivot Marketplace.

## Initialization phase

The marketplace is not accepting public extension-package submissions yet. The production download, verification, safe extraction, installation, permission approval, activation, uninstall, and rollback chain must be complete before third-party packages can be admitted.

During this phase, contributions should be limited to:

- documentation corrections;
- catalog validation and compatibility rules;
- deterministic publishing and verification tooling;
- security tests and failure-path coverage;
- repository automation that does not receive broader permissions than it needs.

## Security and secrets

Never include private keys, API tokens, passwords, `.env` contents, unpublished artifacts, personal data, or production credentials in a contribution. If a change concerns a vulnerability, follow [SECURITY.md](SECURITY.md) instead of opening a public issue or pull request.

## Engineering expectations

- Depend on explicit contracts, not concrete infrastructure implementations.
- Treat all catalog, manifest, package, and publisher input as untrusted.
- Validate behavior at runtime in addition to static typing.
- Add a failing test before changing a security or compatibility rule.
- Cover malformed input, stale revisions, expired content, signature failure, digest mismatch, and authorization failure.
- Do not weaken tests or validation to make a contribution pass.
- Do not describe contracts, mock screens, or unwired services as delivered user functionality.

## Future package submissions

Before package submissions open, every extension will be required to provide at least:

- a stable publisher and resource identity;
- a valid semantic version;
- a declared Pivot compatibility range;
- a recognized license and a bundled license file;
- reproducible package bytes;
- SHA-256 integrity metadata;
- a valid publisher signature;
- a permission and capability declaration;
- passing automated validation and human review.

Detailed submission and review instructions will be published only when the production installation lifecycle is ready.

## License

Unless explicitly stated otherwise, contributions to repository-authored documentation and tooling are accepted under Apache-2.0. Extension packages retain their separately declared licenses.
