import { AESCustomCryto } from "../utils/AESCrypto.util.js";
import {
  SettingsForm,
  BranchNameInput,
  RepositoryPlataformSelect,
  RepositoryNameInput,
  ApiKeyInput,
  UserNameInput,
  UserEmailInput,
  SaveAPIKeyButton,
} from "./../components/settings.components.js";

async function checkUserSettings() {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const apiKey = localStorage.getItem("userAPIKey");

  if (userSettings) {
    ApiKeyInput.value = apiKey.replaceAll('"', "");
    RepositoryPlataformSelect.value = userSettings.repositoryPlataform;
    RepositoryNameInput.value = userSettings.repositoryName;
    BranchNameInput.value = userSettings.branchName;
    UserNameInput.value = userSettings.userName;
    UserEmailInput.value = userSettings.userEmail;
  }
}

/**
 * @param { Event } event
 */
async function handleSettingsFormSubmition(event) {
  event.preventDefault();

  try {
    const userSettings = {
      repositoryPlataform: RepositoryPlataformSelect.value,
      repositoryName: RepositoryNameInput.value,
      branchName: BranchNameInput.value,
      userName: UserNameInput.value,
      userEmail: UserEmailInput.value,
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

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  } catch (error) {
    alert(error.message);
  }
}

window.addEventListener("load", (_event) => {
  checkUserSettings();
});

SaveAPIKeyButton.addEventListener("click", async () => {
  const newAPIKey = ApiKeyInput.value;

  const { aesKey, iv } = await new AESCustomCryto().newKey();
  const encryptedData = await new AESCustomCryto().encryptData({
    key: aesKey,
    iv,
    data: newAPIKey,
  });

  const { keyBase64, ivBase64 } =
    await new AESCustomCryto().convertAESKeyAndIVToBase64({ aesKey, iv });

  localStorage.setItem("userAPIKey", JSON.stringify(encryptedData));
  localStorage.setItem(
    "encryptionKeys",
    JSON.stringify({ keyBase64, ivBase64 }),
  );

  alert("API Key updated!");
});

SettingsForm.addEventListener("submit", handleSettingsFormSubmition);
