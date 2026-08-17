import { createHash, createPublicKey } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const EXPECTED_FIELDS = Object.freeze([
  'algorithm',
  'createdAt',
  'keyId',
  'publicKeyFingerprint',
  'publicKeyPem',
  'schemaVersion',
])
const EXPECTED_KEY_ID = 'pivot-marketplace-2026-01'
const EXPECTED_FINGERPRINT = 'ea8676fe3125f41e659992541ceaecfca381b76d2b8b8536a4ad7a37e7cd75b6'
const PRIVATE_KEY_MARKER = /-----BEGIN [^-\r\n]*PRIVATE KEY-----/

export const OFFICIAL_PUBLIC_KEY_MANIFEST_PATH = fileURLToPath(
  new URL('../keys/pivot-marketplace-2026-01.json', import.meta.url),
)

export function validatePublicKeyManifest(input) {
  if (!isRecord(input)) throw new Error('Public-key manifest must be a JSON object')
  const fields = Object.keys(input).sort()
  if (fields.length !== EXPECTED_FIELDS.length || fields.some((field, index) => field !== EXPECTED_FIELDS[index])) {
    throw new Error('Public-key manifest contains an unknown or missing field')
  }
  if (input.schemaVersion !== 1) throw new Error('Public-key manifest schemaVersion must be 1')
  if (input.algorithm !== 'ed25519') throw new Error('Public-key manifest algorithm must be ed25519')
  if (input.keyId !== EXPECTED_KEY_ID) throw new Error('Public-key manifest Key ID is not official')
  if (
    typeof input.createdAt !== 'string'
    || Number.isNaN(Date.parse(input.createdAt))
    || new Date(input.createdAt).toISOString() !== input.createdAt
  ) {
    throw new Error('Public-key manifest createdAt must be a canonical ISO timestamp')
  }
  if (typeof input.publicKeyPem !== 'string' || input.publicKeyPem.length > 16_384) {
    throw new Error('Public-key manifest contains an invalid public key')
  }
  if (PRIVATE_KEY_MARKER.test(input.publicKeyPem)) {
    throw new Error('Private-key material is forbidden')
  }

  let key
  try {
    key = createPublicKey(input.publicKeyPem)
  } catch (error) {
    throw new Error('Public-key manifest PEM is invalid', { cause: error })
  }
  if (key.type !== 'public' || key.asymmetricKeyType !== 'ed25519') {
    throw new Error('Public-key manifest must contain an Ed25519 public key')
  }
  const fingerprint = createHash('sha256')
    .update(key.export({ format: 'der', type: 'spki' }))
    .digest('hex')
  if (input.publicKeyFingerprint !== fingerprint || fingerprint !== EXPECTED_FINGERPRINT) {
    throw new Error('Public-key manifest fingerprint mismatch')
  }
  return Object.freeze({ ...input })
}

async function main() {
  const raw = await readFile(OFFICIAL_PUBLIC_KEY_MANIFEST_PATH, 'utf8')
  let input
  try {
    input = JSON.parse(raw)
  } catch (error) {
    throw new Error('Public-key manifest must contain valid JSON', { cause: error })
  }
  const manifest = validatePublicKeyManifest(input)
  console.log(`Verified public Marketplace key: ${manifest.keyId}`)
  console.log(`SHA-256: ${manifest.publicKeyFingerprint}`)
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Public-key manifest verification failed')
    process.exitCode = 1
  })
}
