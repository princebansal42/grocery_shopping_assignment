import "./styles.css";
let groceryList = getItemsFromLocalStorage();
loadContent();
const itemNameNode = document.querySelector("#add-item-name");
const itemQtyNode = document.querySelector("#add-item-qty");
const formHeading = document.querySelector(".form-heading");
const itemNameLabel = document.querySelector(".input-name");
const formNode = document.querySelector(".form");
const list = document.querySelector(".list");

function getTitle(name, qty) {
  return `${name} x ${qty}`;
}
function changeFormStateToEdit(parentListNode, id) {
  formHeading.children[0].innerText = "Edit Grocery Item";
  itemNameLabel.children[0].innerText = "Edit Item";

  if (formNode.children[2]) formNode.children[2].remove();

  const editBtn = document.createElement("button");
  editBtn.classList.add("item-edit-btn");
  editBtn.innerText = "Edit Item";
  editBtn.addEventListener("click", function () {
    let index = groceryList.findIndex((item) => item.id === id);
    if (index === -1) {
      changeFormStateToAdd();
      return;
    }

    const newName = itemNameNode.value;
    const newQty = parseInt(itemQtyNode.value, 10);
    if (!validateInput(newName, newQty)) return;

    groceryList[index] = {
      id,
      name: newName,
      qty: newQty
    };

    parentListNode.children[0].innerText = getTitle(
      itemNameNode.value,
      itemQtyNode.value
    );
    updateItemsInLocalStorage(groceryList);

    changeFormStateToAdd();
  });
  formNode.appendChild(editBtn);
}
function changeFormStateToAdd() {
  formHeading.children[0].innerText = "Add Grocery Item";
  itemNameNode.value = "";
  itemQtyNode.value = "";
  itemNameLabel.children[0].innerText = "Add Item";
  // console.log(formNode);
  // console.log(formNode.children[0]);
  // console.log(formNode.children[1]);
  // console.log(formNode.children[2]);

  if (formNode.children[2]) formNode.children[2].remove();
  const form = document.querySelector(".form");
  const addBtn = document.createElement("button");
  addBtn.classList.add("add-item-btn");
  addBtn.innerText = "Add Item";
  addBtn.addEventListener("click", () => {
    addItem();
  });
  form.appendChild(addBtn);
}

function createListItem(id, name, qty) {
  const listItemNode = document.createElement("div");
  listItemNode.classList.add("list-item");
  listItemNode.setAttribute("id", `item-${id}`);

  const listItemName = document.createElement("div");
  listItemName.classList.add("list-item-name");
  listItemName.innerText = getTitle(name, qty);

  const editBtn = document.createElement("button");
  editBtn.classList.add("item-edit-btn");
  editBtn.innerText = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("item-delete-btn");
  deleteBtn.innerText = "Delete";

  editBtn.addEventListener("click", function (event) {
    const parentListNode = event.target.parentNode;
    let itemId = parseInt(parentListNode.getAttribute("id").split("-")[1], 10);
    let index = groceryList.findIndex((item) => item.id === itemId);

    const { id, name: currentName, qty: currentQty } = groceryList[index];

    itemNameNode.value = currentName;
    itemQtyNode.value = parseInt(currentQty, 10);
    changeFormStateToEdit(parentListNode, id);
  });
  deleteBtn.addEventListener("click", function (event) {
    const parentListNode = event.target.parentNode;
    let itemId = parseInt(parentListNode.getAttribute("id").split("-")[1], 10);

    groceryList = groceryList.filter((item) => item.id !== itemId);
    parentListNode.remove();

    console.log(groceryList);
    parentListNode.remove();

    if (groceryList.length === 0) list.appendChild(getEmptyListMessage());
    changeFormStateToAdd();
    updateItemsInLocalStorage(groceryList);
  });

  listItemNode.appendChild(listItemName);
  listItemNode.appendChild(editBtn);
  listItemNode.appendChild(deleteBtn);

  return listItemNode;
}

function addItem() {
  const itemName = itemNameNode.value;
  const itemQty = parseInt(itemQtyNode.value, 10);
  console.log({
    itemName,
    itemQty
  });
  if (!validateInput(itemName, itemQty)) return;
  if (groceryList.length === 0) {
    list.children[0].remove();
  }
  console.log(groceryList);

  let index = groceryList.findIndex((item) => item.name === itemName);

  if (index !== -1) {
    let listElement = document.querySelector(`#item-${groceryList[index].id}`);
    let currentQty = groceryList[index].qty + itemQty;

    console.log(groceryList);
    listElement.children[0].innerText = getTitle(itemName, currentQty);
    groceryList[index].qty = currentQty;
  } else {
    const itemId = Date.now();
    console.log("code was her");
    console.log({ id: itemId, name: itemName, qty: itemQty });
    const newListElement = createListItem(itemId, itemName, itemQty);
    list.appendChild(newListElement);
    groceryList.push({
      id: itemId,
      name: itemName,
      qty: itemQty
    });
  }
  updateItemsInLocalStorage(groceryList);
  itemNameNode.value = "";
  itemQtyNode.value = "";
}

document.querySelector(".add-item-btn").addEventListener("click", () => {
  addItem();
});

// function sortListItems
function clearList() {
  while (list.firstChild) list.removeChild(list.firstChild);
}
function loadContent() {
  // groceryList = getItemsFromLocalStorage();
  groceryList.forEach((item) => {
    const { id, name, qty } = item;
    let newListItem = createListItem(id, name, qty);
    console.log(newListItem);
    list.appendChild(newListItem);
  });

  if (groceryList.length === 0) {
    console.log("Were her ");
    list.appendChild(getEmptyListMessage());
  }
}
// window.addEventListener("load", function (event) {
//   groceryList = getItemsFromLocalStorage();
//   console.log("something");
//   const list = document.querySelector(".list");
//   groceryList.forEach((item, index) => {
//     list.appendChild(createListItem(item.name, item.qty, index));
//   });
// });
function getItemsFromLocalStorage() {
  let groceryList = localStorage.getItem("groceryList");
  if (groceryList) {
    groceryList = JSON.parse(groceryList);
  } else {
    groceryList = {};
    localStorage.setItem("groceryList", "[]");
  }
  return groceryList;
}

function updateItemsInLocalStorage(groceryList) {
  localStorage.setItem("groceryList", JSON.stringify(groceryList));
}

function getEmptyListMessage() {
  const emptyListNode = document.createElement("p");
  emptyListNode.innerText = "Grocery List is Empty";
  emptyListNode.classList.add("content");

  return emptyListNode;
}

function validateInput(name, qty) {
  if (name.length === 0) {
    alert("Invalid Item Name");
    return false;
  }
  if (isNaN(qty) || qty <= 0) {
    alert("Invalid Quantity");
    return false;
  }
  return true;
}
