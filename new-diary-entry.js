import {
  NewDiaryEntryForm,
  DiaryEntryCategoriesInput,
  DiaryEntryTitleInput,
  DiaryEntryBodyInput,
  EncryptOnSendCheckbox,
} from "./components.js";
import { storeDiaryEntry } from "./repository.js";

/** @param { Event } event  */
async function handleNewDiaryEntrySubmit(event) {
  event.preventDefault();

  await storeDiaryEntry(DiaryEntryTitleInput.value, DiaryEntryBodyInput.value);
}

NewDiaryEntryForm.addEventListener("submit", handleNewDiaryEntrySubmit);
