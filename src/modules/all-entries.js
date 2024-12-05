import { EntriesTable } from "./../components/all-diary-entries.components.js";
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
    viewBtn.href = `show.html?path=${file.path}`;
    viewBtn.textContent = "View";
    viewBtn.setAttribute("file-path", file.path);

    const editBtn = document.createElement("a");
    editBtn.classList.add("entry-action-btn");
    editBtn.href = `edit.html?path=${file.path}`;
    editBtn.textContent = "Edit";
    editBtn.setAttribute("file-path", file.path);

    const deleteBtn = document.createElement("a");
    deleteBtn.classList.add("entry-action-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("file-path", file.path);

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

(async () => {
  await populateTable();
})();
