const SettingsForm = document.querySelector("#entry-settings-form");
const ApiKeyInput = document.querySelector("#api-key");
const RepositoryPlataformSelect = document.querySelector(
  "#repository-plataform",
);
const RepositoryNameInput = document.querySelector("#repository-name");
const BranchNameInput = document.querySelector("#branch-name");

const EntriesCountSpan = document.querySelector("#entries-count");

export {
  SettingsForm,
  ApiKeyInput,
  RepositoryNameInput,
  RepositoryPlataformSelect,
  BranchNameInput,
  EntriesCountSpan,
};
