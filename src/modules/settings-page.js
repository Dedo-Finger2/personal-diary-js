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
import {
  convertKeyAndIVToBase64,
  encryptData,
  getCryptoKey,
} from "./../utils/security.js";

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

  const { aesKey, iv } = await getCryptoKey();
  const encryptedData = await encryptData(aesKey, iv, newAPIKey);

  const { keyBase64, ivBase64 } = await convertKeyAndIVToBase64(aesKey, iv);

  localStorage.setItem("userAPIKey", JSON.stringify(encryptedData));
  localStorage.setItem(
    "encryptionKeys",
    JSON.stringify({ keyBase64, ivBase64 }),
  );
});

SettingsForm.addEventListener("submit", handleSettingsFormSubmition);
