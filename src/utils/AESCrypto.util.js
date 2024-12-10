import { ArrayBufferConverter } from "./ArrayBufferConverter.util.js";
import { CustomCrypto } from "./CustomCrypto.util.js";

export class AESCustomCryto extends CustomCrypto {
  constructor() {
    super();
  }

  async newKey() {
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    return { aesKey, iv };
  }

  async getAESKeyAndIVFromLocalStorage() {
    const cryptoKeys = JSON.parse(localStorage.getItem("encryptionKeys"));

    if (!cryptoKeys || !cryptoKeys.keyBase64 || !cryptoKeys.ivBase64) {
      throw new Error("AES Key or IV not found.");
    }

    const rawKey = Uint8Array.from(atob(cryptoKeys.keyBase64), (c) =>
      c.charCodeAt(0),
    );
    const iv = Uint8Array.from(atob(cryptoKeys.ivBase64), (c) =>
      c.charCodeAt(0),
    );

    if (iv.length !== 12) {
      throw new Error("Invalid IV length. Expected 12 bytes.");
    }

    const aesKey = await crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );

    return { aesKey, iv };
  }

  async convertAESKeyAndIVToBase64({ aesKey, iv }) {
    const rawKey = await crypto.subtle.exportKey("raw", aesKey);

    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return { keyBase64, ivBase64 };
  }

  async encryptData(args) {
    const { data, iv, key } = args;

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedData,
    );

    const base64ArrayBuffer = ArrayBufferConverter.toBase64(encryptedData);

    return base64ArrayBuffer;
  }

  async decryptData(args) {
    const { data, iv, key } = args;

    const binaryString = atob(data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let index = 0; index < len; index++) {
      bytes[index] = binaryString.charCodeAt(index);
    }

    const arrayBuffer = bytes.buffer;

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      arrayBuffer,
    );

    const decryptedData = new TextDecoder().decode(decryptedBuffer);

    return decryptedData;
  }
}
