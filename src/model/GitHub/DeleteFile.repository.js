import { BaseRepositroy } from "../Base.repository.js";

export class DeleteFileGithubRepository extends BaseRepositroy {
  constructor(localStorage) {
    super(localStorage);
  }

  async execute({ path, sha }) {
    await super.initialize();

    const response = await fetch(
      `https://api.github.com/repos/${this.userSettings.userName}/${this.userSettings.repositoryName}/contents/${path}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `deletes ${path}`,
          committer: {
            name: this.userSettings.userName,
            email: this.userSettings.userEmail,
          },
          sha: sha,
          branch: this.userSettings.branchName,
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
}
