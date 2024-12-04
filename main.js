import { EntriesCountSpan } from "./components.js";
import { decryptData, getKeyAndIVFromLocalStorage } from "./security.js";

async function getEntriesCount() {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const owner = "Dedo-Finger2";

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${userSettings.repositoryName}/contents/.`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  const files = await response.json();

  EntriesCountSpan.textContent = `${files.length} Entries`;
}

(async () => {
  await getEntriesCount();
})();
