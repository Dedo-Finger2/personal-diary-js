import {
  NewDiaryEntryForm,
  DiaryEntryTitleInput,
  DiaryEntryBodyInput,
} from "./../components/create-diary-entry.components.js";
import { storeDiaryEntry } from "./repository.js";

/** @param { Event } event  */
async function handleNewDiaryEntrySubmit(event) {
  event.preventDefault();

  await storeDiaryEntry(DiaryEntryTitleInput.value, DiaryEntryBodyInput.value);
}

NewDiaryEntryForm.addEventListener("submit", handleNewDiaryEntrySubmit);
