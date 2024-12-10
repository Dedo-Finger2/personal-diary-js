export class CustomCrypto {
  localStorage = null;
  webCrypto = null;

  constructor(localStorage, webCrypto) {
    this.localStorage = localStorage;
    this.webCrypto = webCrypto;
  }
  encryptData(args) {}
  decryptData(args) {}
}
