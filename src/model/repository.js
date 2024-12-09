import {
  decryptData,
  getKeyAndIVFromLocalStorage,
} from "./../utils/security.js";

export async function getAllFiles({ currentPage, itemsPerPage }) {
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

  const userApiKeyLocalStorage = localStorage.getItem("userAPIKey");
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userApiKeyLocalStorage.replaceAll('"', ""),
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

  let totalPages = 0;
  let paginatedFiles = files;

  if (itemsPerPage) {
    totalPages = Math.ceil(files.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    paginatedFiles = files.slice(startIndex, endIndex);
  }

  return {
    files: paginatedFiles,
    totalPages,
    currentPage: currentPage ?? 0,
  };
}

export async function storeDiaryEntry(title, body, categories) {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const fileName = title + ".md";

  const response = await fetch(
    `https://api.github.com/repos/${userSettings.userName}/${userSettings.repositoryName}/contents/${fileName}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `adds ${fileName}`,
        committer: {
          name: userSettings.userName,
          email: userSettings.userEmail,
        },
        content: btoa(String.fromCharCode(...new TextEncoder().encode(body))),
      }),
    },
  );

  const requestDidNotSucceded = !response.ok;

  if (requestDidNotSucceded) {
    console.error(response.status);
    console.error(await response.json());
    throw new Error("Failed to create file.");
  }

  alert("file created!");
}

export async function getFile(path) {
  /**
   * @typedef { Object } FileWithContent
   * @property { string } name
   * @property { string } extension
   * @property { string } sha
   * @property { string } url
   * @property { string } type
   * @property { string } content
   * @property { number } size
   */

  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const response = await fetch(
    `https://api.github.com/repos/${userSettings.userName}/${userSettings.repositoryName}/contents/${path}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );

  const requestDidNotSucceded = !response.ok;

  if (requestDidNotSucceded) {
    console.error(response.status);
    console.error(await response.json());
    throw new Error("Failed to create file.");
  }

  const file = await response.json();

  /** @type { FileWithContent } */
  const formatedFile = {
    name: file.name.split(".")[0],
    extension: file.name.split(".")[1] ?? "no extension",
    sha: file.sha,
    url: file.html_url,
    content: file.content,
    size: file.size,
    type: file.type,
  };

  return formatedFile;
}

export async function deleteFile(path, sha) {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const response = await fetch(
    `https://api.github.com/repos/${userSettings.userName}/${userSettings.repositoryName}/contents/${path}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `deletes ${path}`,
        committer: {
          name: userSettings.userName,
          email: userSettings.userEmail,
        },
        sha: sha,
      }),
    },
  );

  const requestDidNotSucceded = !response.ok;

  if (requestDidNotSucceded) {
    console.error(response.status);
    console.error(await response.json());
    throw new Error("Failed to delete file.");
  }
}

export async function getFileContent(path) {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const response = await fetch(
    `https://api.github.com/repos/${userSettings.userName}/${userSettings.repositoryName}/contents/${path}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );

  const requestDidNotSucceded = !response.ok;

  if (requestDidNotSucceded) {
    console.error(response.status);
    console.error(await response.json());
    throw new Error("Failed to delete file.");
  }

  const file = await response.json();

  return file.content;
}

export async function updateFileContent(newContent, path, sha) {
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const cryptoKeys = await getKeyAndIVFromLocalStorage();

  const userApiKey = await decryptData(
    cryptoKeys.aesKey,
    cryptoKeys.iv,
    userSettings.apiKey,
  );

  const fileName = path.split(".")[0];

  const response = await fetch(
    `https://api.github.com/repos/${userSettings.userName}/${userSettings.repositoryName}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha,
        message: `edits ${fileName}`,
        committer: {
          name: userSettings.userName,
          email: userSettings.userEmail,
        },
        content: btoa(
          String.fromCharCode(...new TextEncoder().encode(newContent)),
        ),
      }),
    },
  );

  const requestDidNotSucceded = !response.ok;

  if (requestDidNotSucceded) {
    console.error(response.status);
    console.error(await response.json());
    throw new Error("Failed to update file.");
  }
}
