import { CustomCrypto } from "./CustomCrypto.util.js";

export class Base64Utf8Crypto extends CustomCrypto {
  static encryptData(data) {
    const byteArray = new TextEncoder().encode(data);

    const encryptedData = btoa(String.fromCharCode(...byteArray));

    return encryptedData;
  }

  static decryptData(data) {
    const byteArray = Uint8Array.from(atob(data), (char) => char.charCodeAt(0));

    const decryptedData = new TextDecoder().decode(byteArray);

    return decryptedData;
  }
}
