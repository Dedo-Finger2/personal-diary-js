import {
  EntriesTable,
  ConfirmActionModalBodyParagraph,
  ConfirmActionModalDialog,
  ConfirmActionModalConfirmButton,
  ConfirmActionModalCancelButton,
  ConfirmActionModalTitleSpan,
} from "./../components/all-diary-entries.components.js";
import { getAllFiles } from "./../model/repository.js";

async function populateTable() {
  const files = await getAllFiles();

  for (const file of files) {
    const tr = document.createElement("tr");

    const titleTd = document.createElement("td");
    titleTd.textContent = file.name;

    const createdAtTd = document.createElement("td");
    createdAtTd.textContent = "2 days ago";

    const categoriesTd = document.createElement("td");
    categoriesTd.textContent = "None";

    const actionsTd = document.createElement("td");

    const viewBtn = document.createElement("a");
    viewBtn.classList.add("entry-action-btn");
    viewBtn.id = "view-diary-entry";
    viewBtn.href = `show.html?path=${file.path}`;
    viewBtn.textContent = "View";
    viewBtn.setAttribute("file-path", file.path);
    viewBtn.setAttribute("sha", file.sha);

    const editBtn = document.createElement("a");
    editBtn.classList.add("entry-action-btn");
    editBtn.id = "edit-diary-entry";
    editBtn.href = `edit.html?path=${file.path}`;
    editBtn.textContent = "Edit";
    editBtn.setAttribute("file-path", file.path);
    editBtn.setAttribute("sha", file.sha);

    const deleteBtn = document.createElement("a");
    deleteBtn.classList.add("entry-action-btn");
    deleteBtn.id = "delete-diary-entry";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("file-path", file.path);
    deleteBtn.setAttribute("sha", file.sha);

    actionsTd.appendChild(viewBtn);
    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);

    tr.appendChild(titleTd);
    tr.appendChild(createdAtTd);
    tr.appendChild(categoriesTd);
    tr.appendChild(actionsTd);

    EntriesTable.appendChild(tr);
  }
}

function handleDeleteDiaryentry() {
  ConfirmActionModalTitleSpan.textContent =
    "Are you sure you want to delete this diary entry?";
  ConfirmActionModalBodyParagraph.textContent =
    "This action is not reversable!";

  ConfirmActionModalDialog.showModal();

  ConfirmActionModalDialog.setAttribute("purpose", "DELETE-DIARY-ENTRY");
}

(async () => {
  await populateTable();

  // Needs to be here cause the buttons are created by JS
  const DeleteDiaryEntryButton = document.querySelector("#delete-diary-entry");
  const ViewDiaryEntryButton = document.querySelector("#view-diary-entry");
  const EditDiaryEntryButton = document.querySelector("#edit-diary-entry");

  DeleteDiaryEntryButton.addEventListener("click", handleDeleteDiaryentry);

  ConfirmActionModalConfirmButton.addEventListener("click", () => {
    const dialogPurpose = ConfirmActionModalDialog.getAttribute("purpose");
    switch (dialogPurpose) {
      case "DELETE-DIARY-ENTRY":
        console.log("Eba");
        break;
      default:
        alert("Something went wrong!");
    }
  });
})();

ConfirmActionModalCancelButton.addEventListener("click", () =>
  ConfirmActionModalDialog.close(),
);
