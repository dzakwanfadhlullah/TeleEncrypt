// src/utils/crypto.ts

const ALGO_NAME = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

export async function getOrCreateKey(): Promise<CryptoKey> {
  const storedKey = localStorage.getItem('tele_encryption_key');
  if (storedKey) {
    const jwk = JSON.parse(storedKey);
    return window.crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: ALGO_NAME, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    );
  }
  const key = await window.crypto.subtle.generateKey(
    { name: ALGO_NAME, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
  const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
  localStorage.setItem('tele_encryption_key', JSON.stringify(exportedKey));
  return key;
}

export async function encryptFile(file: File, key: CryptoKey): Promise<Blob> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const fileData = await file.arrayBuffer();
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: ALGO_NAME, iv: iv },
    key,
    fileData
  );
  const combinedBuffer = new Uint8Array(iv.byteLength + encryptedBuffer.byteLength);
  combinedBuffer.set(iv);
  combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.byteLength);
  return new Blob([combinedBuffer], { type: file.type });
}

// INI FUNGSI YANG HILANG DI ERROR ANDA:
export async function decryptFile(encryptedBlob: Blob, key: CryptoKey): Promise<Blob> {
  const buffer = await encryptedBlob.arrayBuffer();
  const arr = new Uint8Array(buffer);
  const iv = arr.slice(0, IV_LENGTH);
  const data = arr.slice(IV_LENGTH);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: ALGO_NAME, iv: iv },
      key,
      data
    );
    return new Blob([decryptedBuffer]);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt.");
  }
}