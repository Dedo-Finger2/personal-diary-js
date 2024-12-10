import { GetFileGithubRepository } from "../model/GitHub/GetFile.repository.js";
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
    const byteArray = new TextEncoder().encode(currentContent);
    const encryptedContent = btoa(String.fromCharCode(...byteArray));
    DiaryEntryBodyTextarea.value = encryptedContent;
    DiaryEntryBodyTextarea.setAttribute("revealed", "false");
  } else {
    const currentContent = DiaryEntryBodyTextarea.value;
    const byteArray = Uint8Array.from(atob(currentContent), (char) =>
      char.charCodeAt(0),
    );
    const decryptedContent = new TextDecoder().decode(byteArray);
    DiaryEntryBodyTextarea.value = decryptedContent;
    DiaryEntryBodyTextarea.setAttribute("revealed", "true");
  }
}

window.addEventListener("load", handleGetFileInfo);
RevealContentCheckbox.addEventListener("change", handleCheckboxChange);
