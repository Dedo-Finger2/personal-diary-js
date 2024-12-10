import { BaseRepositroy } from "../Base.repository.js";

/*
 * @typedef { Object } FileWithContent
 * @property { string } name
 * @property { string } extension
 * @property { string } sha
 * @property { string } url
 * @property { string } type
 * @property { string } content
 * @property { number } size
 */

export class GetFileGithubRepository extends BaseRepositroy {
  constructor(localStorage) {
    super(localStorage);
  }

  async execute({ path }) {
    await super.initialize();

    const response = await fetch(
      `https://api.github.com/repos/${this.userSettings.userName}/${this.userSettings.repositoryName}/contents/${path}?ref=${this.userSettings.branchName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
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
}
