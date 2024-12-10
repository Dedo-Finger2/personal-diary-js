import { GetFileGithubRepository } from "../model/GitHub/GetFile.repository.js";
import { Base64Utf8Crypto } from "../utils/Base64Utf8Crypto.util.js";
import { Request } from "../utils/Request.util.js";
import {
  DiaryEntryTitleH1,
  DiaryEntryBodyTextarea,
  RevealContentCheckbox,
} from "./../components/show.components.js";

async function handleGetFileInfo() {
  RevealContentCheckbox.checked = false;
  RevealContentCheckbox.setAttribute("revealed", "false");

  const { path } = Request.queryParams();

  const file = await new GetFileGithubRepository(localStorage).execute({
    path,
  });

  DiaryEntryTitleH1.textContent = file.name;
  DiaryEntryBodyTextarea.value = file.content;
}

function handleCheckboxChange() {
  const isContentRevealed =
    DiaryEntryBodyTextarea.getAttribute("revealed") === "true";

  if (isContentRevealed) {
    const currentContent = DiaryEntryBodyTextarea.value;

    const encryptedContent = Base64Utf8Crypto.encryptData(currentContent);
    DiaryEntryBodyTextarea.value = encryptedContent;

    DiaryEntryBodyTextarea.setAttribute("revealed", "false");
  } else {
    const currentContent = DiaryEntryBodyTextarea.value;

    const decryptedContent = Base64Utf8Crypto.decryptData(currentContent);
    DiaryEntryBodyTextarea.value = decryptedContent;

    DiaryEntryBodyTextarea.setAttribute("revealed", "true");
  }
}

window.addEventListener("load", handleGetFileInfo);
RevealContentCheckbox.addEventListener("change", handleCheckboxChange);
