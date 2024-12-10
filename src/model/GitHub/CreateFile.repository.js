import { BaseRepositroy } from "../Base.repository.js";

export class CreateFileGithubRepository extends BaseRepositroy {
  constructor(localStorage) {
    super(localStorage);
  }

  async execute({ content, title }) {
    await super.initialize();

    const path = title + ".md";

    const response = await fetch(
      `https://api.github.com/repos/${this.userSettings.userName}/${this.userSettings.repositoryName}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `creates ${path}`,
          content: btoa(
            String.fromCharCode(...new TextEncoder().encode(content)),
          ),
          committer: {
            name: this.userSettings.userName,
            email: this.userSettings.userEmail,
          },
          branch: this.userSettings.branchName,
        }),
      },
    );

    const requestDidNotSucceded = !response.ok;

    if (requestDidNotSucceded) {
      console.error(response.status);
      console.error(await response.json());
      throw new Error("Failed to create file.");
    }
  }
}
