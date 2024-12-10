export class ArrayBufferConverter {
  static toBase64(buffer) {
    let binary = "";

    const bytes = new Uint8Array(buffer);
    const len = bytes.length;

    for (let index = 0; index < len; index++) {
      binary += String.fromCharCode(bytes[index]);
    }

    return btoa(binary);
  }
}
