import {
  SettingsForm,
  BranchNameInput,
  RepositoryPlataformSelect,
  RepositoryNameInput,
  ApiKeyInput,
} from "./components.js";

async function encryptData(key, iv, data) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData,
  );
  return encryptedData;
}

export async function decryptData(key, iv, encryptedData) {
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData,
  );

  const decryptedData = new TextDecoder().decode(decryptedBuffer);
  return decryptedData;
}

async function getCryptoKey() {
  const aesKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return { aesKey, iv };
}

async function checkUserSettings() {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));

  if (userSettings) {
    ApiKeyInput.value = userSettings.apiKey;
    RepositoryPlataformSelect.value = userSettings.repositoryPlataform;
    RepositoryNameInput.value = userSettings.repositoryName;
    BranchNameInput.value = userSettings.branchName;
  }
}

/**
 * @param { Event } event
 */
async function handleSettingsFormSubmition(event) {
  event.preventDefault();

  try {
    const userSettings = {
      apiKey: ApiKeyInput.value,
      repositoryPlataform: RepositoryPlataformSelect.value,
      repositoryName: RepositoryNameInput.value,
      branchName: BranchNameInput.value,
    };

    const missingSettings = [];

    for (const property in userSettings) {
      if (userSettings[property] === undefined || userSettings[property] === "")
        missingSettings.push(property.toString());
    }

    if (missingSettings.length > 0) {
      throw new Error(
        `Missing following settings: ${missingSettings.join(", ")}`,
      );
    }

    const { aesKey, iv } = await getCryptoKey();
    const encryptedData = await encryptData(aesKey, iv, userSettings.apiKey);

    userSettings.apiKey = encryptedData;

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  } catch (error) {
    alert(error.message);
  }
}

window.addEventListener("load", (_event) => {
  checkUserSettings();
});

SettingsForm.addEventListener("submit", handleSettingsFormSubmition);
