import {
  SettingsForm,
  BranchNameInput,
  RepositoryPlataformSelect,
  RepositoryNameInput,
  ApiKeyInput,
  UserNameInput,
} from "./components.js";
import {
  convertKeyAndIVToBase64,
  encryptData,
  getCryptoKey,
} from "./security.js";

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
      userName: UserNameInput.value,
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

    const { keyBase64, ivBase64 } = await convertKeyAndIVToBase64(aesKey, iv);

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
    localStorage.setItem(
      "encryptionKeys",
      JSON.stringify({ keyBase64, ivBase64 }),
    );
  } catch (error) {
    alert(error.message);
  }
}

window.addEventListener("load", (_event) => {
  checkUserSettings();
});

SettingsForm.addEventListener("submit", handleSettingsFormSubmition);
