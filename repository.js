import { decryptData, getKeyAndIVFromLocalStorage } from "./security.js";

export async function getAllFiles() {
  /**
   * @typedef { Object } File
   * @property { string } name
   * @property { string } extension
   * @property { string } path
   * @property { number } size
   * @property { string } url
   * @property { string } type
   * @property { string } sha
   */

  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const response = await fetch(
    `https://api.github.com/repos/${userSettings.userName}/${userSettings.repositoryName}/contents/.`,
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

  const data = await response.json();

  /** @type { Array<File> } */
  const files = [];

  for (const file of data) {
    files.push({
      name: file.name.split(".")[0],
      extension: file.name.split(".")[1],
      path: file.path,
      size: file.size,
      url: file.html_url,
      type: file.type,
      sha: file.sha,
    });
  }

  return files;
}
