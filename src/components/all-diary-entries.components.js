const EntriesTable = document.querySelector("#entries-table");
const ConfirmActionModalDialog = document.querySelector(
  "#confirm-action-modal",
);
const ConfirmActionModalConfirmButton =
  document.querySelector("#modal-confirm");
const ConfirmActionModalCancelButton = document.querySelector("#modal-close");
const ConfirmActionModalTitleSpan = document.querySelector(
  "#confirm-action-modal-title",
);
const ConfirmActionModalBodyParagraph = document.querySelector(
  "#confirm-action-modal-body",
);
const ConfirmActionModalIcon = document.querySelector(
  "#confirm-action-modal-icon",
);
const SearchInput = document.querySelector("#search");
const SearchTypeSelect = document.querySelector("#search-types");
const PaginationPageNumberSpan = document.querySelector("#page-number");
const PaginationNextPageButton = document.querySelector("#pagination-next");
const PaginationPreviousPageButton = document.querySelector(
  "#pagination-previous",
);

export {
  EntriesTable,
  ConfirmActionModalDialog,
  ConfirmActionModalCancelButton,
  ConfirmActionModalConfirmButton,
  ConfirmActionModalTitleSpan,
  ConfirmActionModalBodyParagraph,
  ConfirmActionModalIcon,
  SearchInput,
  SearchTypeSelect,
  PaginationPageNumberSpan,
  PaginationNextPageButton,
  PaginationPreviousPageButton,
};
