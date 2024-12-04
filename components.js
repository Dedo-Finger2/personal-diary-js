const SettingsForm = document.querySelector("#entry-settings-form");
const ApiKeyInput = document.querySelector("#api-key");
const RepositoryPlataformSelect = document.querySelector(
  "#repository-plataform",
);
const RepositoryNameInput = document.querySelector("#repository-name");
const BranchNameInput = document.querySelector("#branch-name");
const UserNameInput = document.querySelector("#user-name");

const EntriesCountSpan = document.querySelector("#entries-count");

const NewDiaryEntryForm = document.querySelector("#new-diary-entry-form");
const DiaryEntryTitleInput = document.querySelector("#entry-title");
const DiaryEntryBodyInput = document.querySelector("#entry-body");
const DiaryEntryCategoriesInput = document.querySelector("#entry-categories");
const EncryptOnSendCheckbox = document.querySelector("#encrypt-on-send");

export {
  SettingsForm,
  ApiKeyInput,
  RepositoryNameInput,
  RepositoryPlataformSelect,
  BranchNameInput,
  EntriesCountSpan,
  UserNameInput,
  NewDiaryEntryForm,
  DiaryEntryBodyInput,
  DiaryEntryTitleInput,
  DiaryEntryCategoriesInput,
  EncryptOnSendCheckbox,
};
