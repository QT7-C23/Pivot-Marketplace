import assert from 'node:assert/strict'
import { generateKeyPairSync } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  OFFICIAL_PUBLIC_KEY_MANIFEST_PATH,
  validatePublicKeyManifest,
} from '../scripts/verify-public-key-manifest.mjs'

test('accepts the strict official Ed25519 public-key manifest', async () => {
  const input = JSON.parse(await readFile(OFFICIAL_PUBLIC_KEY_MANIFEST_PATH, 'utf8'))
  const manifest = validatePublicKeyManifest(input)

  assert.equal(manifest.algorithm, 'ed25519')
  assert.equal(manifest.keyId, 'pivot-marketplace-2026-01')
  assert.equal(
    manifest.publicKeyFingerprint,
    'ea8676fe3125f41e659992541ceaecfca381b76d2b8b8536a4ad7a37e7cd75b6',
  )
  assert.match(manifest.publicKeyPem, /BEGIN PUBLIC KEY/)
  assert.doesNotMatch(JSON.stringify(manifest), /PRIVATE KEY/)
})

test('rejects unknown fields instead of expanding the public trust contract', () => {
  assert.throws(
    () => validatePublicKeyManifest({ ...validManifest(), downloadUrl: 'https://attacker.invalid' }),
    /unknown|field/i,
  )
})

test('rejects private-key markers before parsing key material', () => {
  assert.throws(
    () => validatePublicKeyManifest({
      ...validManifest(),
      publicKeyPem: '-----BEGIN PRIVATE KEY-----\nnot-public\n-----END PRIVATE KEY-----\n',
    }),
    /private/i,
  )
})

test('rejects non-Ed25519 keys and fingerprint substitution', () => {
  const { publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  assert.throws(
    () => validatePublicKeyManifest({
      ...validManifest(),
      publicKeyPem: publicKey.export({ format: 'pem', type: 'spki' }).toString(),
    }),
    /ed25519|fingerprint/i,
  )
  assert.throws(
    () => validatePublicKeyManifest({
      ...validManifest(),
      publicKeyFingerprint: '0'.repeat(64),
    }),
    /fingerprint/i,
  )
})

function validManifest() {
  return {
    algorithm: 'ed25519',
    createdAt: '2026-08-16T21:19:33.572Z',
    keyId: 'pivot-marketplace-2026-01',
    publicKeyFingerprint: 'ea8676fe3125f41e659992541ceaecfca381b76d2b8b8536a4ad7a37e7cd75b6',
    publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEA1+PTlOomL8YLqPSvWFhpgW7bLobYxzWUO8P8TWydFKg=\n-----END PUBLIC KEY-----\n',
    schemaVersion: 1,
  }
}
