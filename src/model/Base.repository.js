import { AESCustomCryto } from "../utils/AESCrypto.util.js";

export class BaseRepositroy {
  apiKey;
  userSettings;
  localStorage;

  constructor(localStorage) {
    this.apiKey = null;
    this.userSettings = null;
    this.localStorage = localStorage;
  }

  #getUserApiKeyFromLocalStorage() {
    const userApiKeyLocalStorage = this.localStorage.getItem("userAPIKey");
    if (userApiKeyLocalStorage === null) {
      throw new Error("Could not find an API key in the localStorage.");
    }
    return userApiKeyLocalStorage;
  }

  #getUserSettingsFromLocalStorage() {
    const userSettingsFromLocalStorage = JSON.parse(
      this.localStorage.getItem("userSettings"),
    );
    if (userSettingsFromLocalStorage === null) {
      throw new Error("Could not find userSettings in the localStorage.");
    }
    return userSettingsFromLocalStorage;
  }

  async #getKeyAndIVFromLocalStorage() {
    const { iv, aesKey } =
      await new AESCustomCryto().getAESKeyAndIVFromLocalStorage();
    if (iv === undefined || aesKey === undefined) {
      throw new Error(
        "Error on trying to get IV and AESKey from localStorage.",
      );
    }
    return { iv, aesKey };
  }

  async decryptUserApiKey(iv, aesKey, encryptedApiKey) {
    const apiKey = await new AESCustomCryto().decryptData({
      key: aesKey,
      iv,
      data: encryptedApiKey.replaceAll('"', ""),
    });
    if (apiKey === undefined || apiKey === "") {
      throw new Error("Error trying to decrypt userAPiKey.");
    }
    return apiKey;
  }

  async initialize() {
    try {
      this.userSettings = this.#getUserSettingsFromLocalStorage();
      const userApiKeyFromLocalStorage = this.#getUserApiKeyFromLocalStorage();
      const { iv, aesKey } = await this.#getKeyAndIVFromLocalStorage();
      this.apiKey = await this.decryptUserApiKey(
        iv,
        aesKey,
        userApiKeyFromLocalStorage,
      );
    } catch (error) {
      console.error("Error trying to access the remote database: " + error);
    }
  }
}
