import { BaseRepositroy } from "../Base.repository.js";

export class GetFileContentGithubRepository extends BaseRepositroy {
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
      throw new Error("Failed to get file content.");
    }

    const file = await response.json();

    return file.content;
  }
}
