import { EntriesCountSpan } from "./../components/home.components.js";
import * as repository from "./../model/repository.js";

async function getEntriesCount() {
  const { files } = await repository.getAllFiles({});

  EntriesCountSpan.textContent = `${files.length} Entries`;
}

(async () => {
  await getEntriesCount();
})();
