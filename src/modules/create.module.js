import { CreateFileGithubRepository } from "../model/GitHub/CreateFile.repository.js";
import {
  NewDiaryEntryForm,
  DiaryEntryTitleInput,
  DiaryEntryBodyInput,
} from "./../components/create-diary-entry.components.js";

/** @param { Event } event  */
async function handleNewDiaryEntrySubmit(event) {
  event.preventDefault();

  await new CreateFileGithubRepository(localStorage).execute({
    title: DiaryEntryTitleInput.value,
    content: DiaryEntryBodyInput.value,
  });

  alert("File created!");
}

NewDiaryEntryForm.addEventListener("submit", handleNewDiaryEntrySubmit);
