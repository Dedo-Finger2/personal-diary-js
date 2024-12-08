import {
  EntriesTable,
  ConfirmActionModalBodyParagraph,
  ConfirmActionModalDialog,
  ConfirmActionModalConfirmButton,
  ConfirmActionModalCancelButton,
  ConfirmActionModalTitleSpan,
  SearchInput,
  PaginationNextPageButton,
  PaginationPreviousPageButton,
  PaginationPageNumberSpan,
} from "./../components/all-diary-entries.components.js";
import { deleteFile, getAllFiles } from "./../model/repository.js";

async function populateTable() {
  const files = await getAllFiles();

  for (const file of files) {
    const tr = document.createElement("tr");

    const titleTd = document.createElement("td");
    titleTd.textContent = file.name;

    const actionsTd = document.createElement("td");

    const viewBtn = document.createElement("a");
    viewBtn.classList.add("entry-action-btn");
    viewBtn.classList.add("view-diary-entry");
    viewBtn.href = `show.html?path=${file.path}`;
    viewBtn.textContent = "View";
    viewBtn.setAttribute("file-path", file.path);
    viewBtn.setAttribute("sha", file.sha);

    const editBtn = document.createElement("a");
    editBtn.classList.add("entry-action-btn");
    editBtn.classList.add("edit-diary-entry");
    editBtn.href = `edit.html?path=${file.path}&sha=${file.sha}`;
    editBtn.textContent = "Edit";
    editBtn.setAttribute("file-path", file.path);
    editBtn.setAttribute("sha", file.sha);

    const deleteBtn = document.createElement("a");
    deleteBtn.classList.add("entry-action-btn");
    deleteBtn.classList.add("delete-diary-entry");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("file-path", file.path);
    deleteBtn.setAttribute("sha", file.sha);

    actionsTd.appendChild(viewBtn);
    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);

    tr.appendChild(titleTd);
    tr.appendChild(actionsTd);

    EntriesTable.appendChild(tr);
  }
}

(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get("page") ?? 1;

  PaginationNextPageButton.href = `listing.html?page=${Number(currentPage) + 1}`;
  PaginationPreviousPageButton.href = `listing.html?page=${Number(currentPage) - 1}`;
  PaginationPageNumberSpan.textContent = currentPage ?? 1;

  if (!currentPage || Number(currentPage) <= 1) {
    PaginationPreviousPageButton.href = "";
  }

  await populateTable();

  // Needs to be here cause the buttons are created by JS
  const DeleteDiaryEntryButtons = document.querySelectorAll(
    ".delete-diary-entry",
  );

  DeleteDiaryEntryButtons.forEach((DeleteDiaryEntryButton) => {
    DeleteDiaryEntryButton.addEventListener("click", () => {
      ConfirmActionModalTitleSpan.textContent =
        "Are you sure you want to delete this diary entry?";
      ConfirmActionModalBodyParagraph.textContent =
        "This action is not reversable!";

      ConfirmActionModalDialog.showModal();

      ConfirmActionModalDialog.setAttribute("purpose", "DELETE-DIARY-ENTRY");

      const filePath = DeleteDiaryEntryButton.getAttribute("file-path");
      const fileSHA = DeleteDiaryEntryButton.getAttribute("sha");

      ConfirmActionModalDialog.setAttribute("selected-file-path", filePath);
      ConfirmActionModalDialog.setAttribute("selected-file-sha", fileSHA);
    });
  });

  ConfirmActionModalConfirmButton.addEventListener("click", async () => {
    const dialogPurpose = ConfirmActionModalDialog.getAttribute("purpose");
    const filePath =
      ConfirmActionModalDialog.getAttribute("selected-file-path");
    const fileSHA = ConfirmActionModalDialog.getAttribute("selected-file-sha");

    switch (dialogPurpose) {
      case "DELETE-DIARY-ENTRY":
        await deleteFile(filePath, fileSHA);
        ConfirmActionModalDialog.close();
        alert("file deleted.");
        break;
      default:
        alert("Something went wrong!");
    }
  });
})();

PaginationNextPageButton.addEventListener("click", () => {});

ConfirmActionModalCancelButton.addEventListener("click", () =>
  ConfirmActionModalDialog.close(),
);
