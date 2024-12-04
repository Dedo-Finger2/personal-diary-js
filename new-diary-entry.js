import {
  NewDiaryEntryForm,
  DiaryEntryCategoriesInput,
  DiaryEntryTitleInput,
  DiaryEntryBodyInput,
  EncryptOnSendCheckbox,
} from "./components.js";

/** @param { Event } event  */
function handleNewDiaryEntrySubmit(event) {
  event.preventDefault();

  console.log(DiaryEntryTitleInput.value);
}

NewDiaryEntryForm.addEventListener("submit", handleNewDiaryEntrySubmit);
