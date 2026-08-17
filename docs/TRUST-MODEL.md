# Pivot Marketplace Trust Model

## Scope

This document defines the public security boundary for the official Pivot Marketplace distribution surface. It describes required behavior, not a claim that the entire installation lifecycle is already available in Pivot.

## Trust root

Pivot Marketplace uses an Ed25519 key pair:

- the private key authorizes official catalog and release publication;
- the public key allows Pivot clients to verify that authorization;
- possession of the public key does not grant publishing authority.

The private key is generated and stored outside Git repositories. It is never shipped with Pivot or uploaded as a marketplace artifact.

The current official public identity is:

- Key ID: `pivot-marketplace-2026-01`
- Algorithm: Ed25519
- Public-key SHA-256: `ea8676fe3125f41e659992541ceaecfca381b76d2b8b8536a4ad7a37e7cd75b6`
- Manifest: [`keys/pivot-marketplace-2026-01.json`](../keys/pivot-marketplace-2026-01.json)

The manifest is public verification material, not a secret. Repository CI
strictly validates its fields, key type and fingerprint and rejects private-key
markers.

## Catalog verification

Before Pivot accepts a catalog snapshot, Main must:

1. fetch it from the configured HTTPS source without accepting redirects;
2. enforce response size, content type, and timeout limits;
3. strictly validate the runtime schema;
4. require the expected source and key identifiers;
5. verify the Ed25519 signature over the canonical payload bytes;
6. reject expired or excessively long-lived snapshots;
7. reject duplicate or internally inconsistent entries.

Catalog expiry is intentionally short. Production publishing therefore requires scheduled, reviewed renewal even when the catalog contents do not change.

## Package verification

A catalog signature authenticates catalog metadata; it does not by itself make downloaded package bytes safe. Before installation, Pivot must independently:

1. download into an isolated staging location;
2. enforce package size and transport restrictions;
3. calculate and compare the SHA-256 digest;
4. verify the package signature and publisher identity;
5. validate the package manifest and compatibility range;
6. inspect archive paths and reject traversal, links, collisions, and unsafe file types;
7. obtain explicit approval for declared capabilities;
8. install atomically with rollback evidence;
9. record ownership, version, source, and verification results.

Until that chain is production-wired and tested, packages must not be presented as safely installable.

## Process boundaries

- Main owns network retrieval, cryptographic verification, persistence, and filesystem mutation.
- Renderer receives validated view models and narrow user-action ports only.
- Worker receives only the capabilities explicitly granted to its task.
- Renderer and Worker never receive private signing keys, administrative ports, raw database handles, or unrestricted filesystem access.

## Key rotation and compromise

Routine rotation must overlap old and new trust roots through a reviewed client update. Emergency rotation begins by stopping publication and treating the affected signing interval as untrusted. Removing a key from Git history does not restore trust after exposure.

## Publication state

The official public key and Key ID are published so clients and reviewers can
confirm the pinned trust identity. No signed `catalog.json` or installable
package feed is published during initialization. Those artifacts remain blocked
until the independent verifier, package lifecycle, and recovery tests are
ready.
