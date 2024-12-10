import { GetAllFilesGithubRepository } from "../model/GitHub/GetAllFiles.repository.js";
import { EntriesCountSpan } from "./../components/home.components.js";

async function getEntriesCount() {
  const { files } = await new GetAllFilesGithubRepository(localStorage).execute(
    {},
  );

  EntriesCountSpan.textContent = `${files.length} Entries`;
}

(async () => {
  await getEntriesCount();
})();
