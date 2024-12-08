import { getFileContent, updateFileContent } from "../model/repository.js";
import {
  EditDiaryEntryForm,
  DiaryEntryTitleInput,
  DiaryEntryBodyTextarea,
  RevealDiaryEntryContentCheckbox,
} from "./../components/edit.components.js";

const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get("path");
const fileSha = urlParams.get("sha");

async function fillInputs() {
  const fileContent = await getFileContent(filePath);
  const fileTitle = filePath.split(".")[0];

  DiaryEntryTitleInput.value = fileTitle;
  DiaryEntryBodyTextarea.value = fileContent;
  RevealDiaryEntryContentCheckbox.checked =
    DiaryEntryBodyTextarea.revealed === "true" ? true : false;
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
    DiaryEntryBodyTextarea.disabled = true;
  } else {
    const currentContent = DiaryEntryBodyTextarea.value;
    const byteArray = Uint8Array.from(atob(currentContent), (char) =>
      char.charCodeAt(0),
    );
    const decryptedContent = new TextDecoder().decode(byteArray);
    DiaryEntryBodyTextarea.value = decryptedContent;
    DiaryEntryBodyTextarea.setAttribute("revealed", "true");
    DiaryEntryBodyTextarea.disabled = false;
  }
}

/** @param { Event } event  */
async function handleEditFormSubmit(event) {
  event.preventDefault();

  const newContent = event.target.body.value;

  await updateFileContent(newContent, filePath, fileSha);

  alert("File updated!");
}

RevealDiaryEntryContentCheckbox.addEventListener(
  "change",
  handleCheckboxChange,
);

EditDiaryEntryForm.addEventListener("submit", handleEditFormSubmit);

window.addEventListener("load", fillInputs);
