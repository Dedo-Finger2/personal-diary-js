import { BaseRepositroy } from "../Base.repository.js";

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

export class GetAllFilesGithubRepository extends BaseRepositroy {
  constructor(localStorage) {
    super(localStorage);
  }

  async execute({ itemsPerPage, currentPage }) {
    // Initializing the variables
    await super.initialize();

    // Making the request to the GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${this.userSettings.userName}/${this.userSettings.repositoryName}/contents/.?ref=${this.userSettings.branchName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    // Throw an error if something go wrong with the request
    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    // Converting the data to JSON
    const data = await response.json();

    // Initializing the files array
    /** @type { Array<File> } */
    const files = [];

    // Filter the files data to match the structure above
    for (const file of data) {
      files.push({
        name: file.name.split(".")[0], // Removes the extension from the name
        extension: file.name.split(".")[1], // Leaves only the extension
        path: file.path,
        size: file.size,
        url: file.html_url, // The url to access the file (public)
        type: file.type,
        sha: file.sha, // Kind of an ID
      });
    }

    // Pagination \\
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
}
