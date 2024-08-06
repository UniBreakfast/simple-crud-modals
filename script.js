const listWrapper = document.getElementById('wrapper');
const ul = document.getElementById('list');
const newItemDialog = document.getElementById('new-dialog');
const itemDialog = document.getElementById('item-dialog');
const editDialog = document.getElementById('edit-dialog');
const deleteDialog = document.getElementById('delete-dialog');
const newItemForm = newItemDialog.querySelector('form');
const itemForm = itemDialog.querySelector('form');
const editForm = editDialog.querySelector('form');
const deleteForm = deleteDialog.querySelector('form');

listWrapper.onkeydown = preventCloseWrapper;
ul.onclick = handleListClick;
newItemForm.onsubmit = handleSubmitNew;
itemForm.onsubmit = handleSelected;
editForm.onsubmit = handleSave;
deleteForm.onsubmit = handleDelete;

function preventCloseWrapper(e) {
  if (e.target.closest('dialog') == listWrapper
    && e.key == 'Escape') {
    e.preventDefault();
  }
}

function handleListClick(e) {
  const btn = e.target.closest('button');

  if (!btn) return;
  
  if (btn.matches('.plus')) handlePlusClick(e);
  else handleItemClick(e);
}

function handlePlusClick(e) {
  const btn = e.target;
  const li = btn.closest('li');
  const i = getIndex(li);
  
  showNewItemDialog(i);
}

function handleItemClick(e) {
  const btn = e.target;
  const li = btn.closest('li');
  const i = getIndex(li);
  
  selectItem(i);
}

function handleSubmitNew(e) {
  const btn = e.submitter;
  
  if (btn.value == 'add') {
    const i = newItemForm.index.value;
    const text = newItemForm.text.value.trim();

    if (text) {
      addItem(i, text);
    } else {
      e.preventDefault();
      newItemForm.text.focus();
    }

    newItemForm.reset();
  }
}

function handleSelected(e) {
  const btn = e.submitter;
  const i = itemForm.index.value;
  
  if (btn.value == 'edit') editItem(i);
  if (btn.value == 'delete') promptDeletion(i);
}

function handleSave(e) {
  const btn = e.submitter;
  
  if (btn.value == 'save') {
    const i = editForm.index.value;
    const text = editForm.text.value.trim();
    const replacement = editForm.replacement.value.trim();
    
    if (!replacement) {
      e.preventDefault();
      editForm.replacement.focus();
    } else if (text != replacement) {
      updateItem(i, replacement);
    }
  }
}

function handleDelete(e) {
  const btn = e.submitter;
  
  if (btn.value == 'delete') {
    const i = deleteForm.index.value;
    
    deleteItem(i);
  }
}

function getIndex(el) {
  const items = Array.from(ul.children);
  
  return items.indexOf(el);
}

function showNewItemDialog(i) {
  newItemDialog.showModal();
  newItemForm.index.value = i;
}

function selectItem(i) {
  itemDialog.showModal();
  itemForm.index.value = i;
  itemForm.text.value = ul.children[i].textContent;
}

function addItem(i, text) {
  const plusLi = ul.children[i];
  const li = document.createElement('li');
  const btn = document.createElement('button');

  li.className = 'item';
  li.appendChild(btn).append(text);
  
  plusLi.after(li, plusLi.cloneNode(true));
}

function editItem(i) {
  const li = ul.children[i];
  const text = li.innerText;

  editDialog.showModal();
  editForm.index.value = i;
  editForm.text.value = text;
  editForm.replacement.value = text;
}

function updateItem(i, text) {
  const li = ul.children[i];
  const btn = li.querySelector('button');
  
  btn.textContent = text;
}

function promptDeletion(i) {
  const li = ul.children[i];
  const text = li.innerText;
  
  deleteDialog.showModal();
  deleteForm.index.value = i;
  deleteForm.text.value = text;
}

function deleteItem(i) {
  const li = ul.children[i];
  const plusLi = li.nextElementSibling;
  
  plusLi.remove();
  li.remove();
}
