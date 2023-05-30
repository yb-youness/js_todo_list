const itemFrom = document.getElementById("item-form"); // This for the form selection
const itemInput = document.getElementById("item-input"); // This for the input selection
const itemList = document.getElementById("item-list"); // This to select the list items (ul)
const ClearBtn = document.getElementById("clear"); // This for the item clear button
const itemFilter = document.getElementById("filter");
const fromBtn    = itemFrom.querySelector("button");
let isEditMode =false;

// functions
function displayItems() {
  const itemsFromStorge = getItemFromStorge();
  itemsFromStorge.forEach((item) => addItemToDom(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  // Validate Input
  const item = itemInput.value;
  if (item === "") {
    alert("Please Add an Item ");
    return;
  }
   if(isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorge(itemToEdit.textContent);
    itemToEdit.remove();
    isEditMode = false;
   }else{
     if(checkIfItemExists(item)){
      alert("Element already existe");
      return;
     }

   }
  addItemToDom(item);
  addItemToStorge(item);
  checkUI();
  itemInput.value = ""; // clear the filed
}

function addItemToDom(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item)); // Add the value in li
  const button = createButton("remove-item btn-link text-red"); // This to create a button
  li.appendChild(button); // This to bind the button to the parent
  itemList.appendChild(li); // Add the li to the ul
}

function addItemToStorge(item) {
  let itemFromStorge = getItemFromStorge();

  itemFromStorge.push(item);
  localStorage.setItem("items", JSON.stringify(itemFromStorge));
}
function getItemFromStorge() {
  let itemFromStorge;
  if (localStorage.getItem("items") === null) {
    itemFromStorge = [];
  } else {
    itemFromStorge = JSON.parse(localStorage.getItem("items"));
  }
  return itemFromStorge;
}
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function setItemToEdit(item){
   isEditMode =true;
   itemList.querySelectorAll("li").forEach(i => i.classList.remove('edit-mode'));
   item.classList.add("edit-mode");
   fromBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update";
   fromBtn.style.backgroundColor = "#99A98F";
   itemInput.value = item.textContent;
}
 
function checkIfItemExists(item){
    const itemsFromStorge = getItemFromStorge();
    return itemsFromStorge.includes(item);
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  }else{
      setItemToEdit(e.target);
  }
}

function removeItem(item) {
  if (confirm("Are you sure ?")) {
    item.remove(); // Remove item from DOM
     removeItemFromStorge(item.textContent);
    checkUI();
  }
}

function removeItemFromStorge(item){
  let itemsFromStorge = getItemFromStorge();
        itemsFromStorge  = itemsFromStorge.filter( it => item != it);
  
  localStorage.setItem("items",JSON.stringify(itemsFromStorge));      

}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem("items");
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const ietmName = item.firstChild.textContent.toLowerCase();
    if (ietmName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
// This function is to check where the ul is full or not to display the filter button
function checkUI() {
  itemInput.value ="";
  const items = itemList.querySelectorAll("li");
  if (items.length == 0) {
    ClearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    ClearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
   // This to reset the button 
  fromBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  fromBtn.style.backgroundColor = "#333"; 
  isEditMode =false;

}

function init() {
  // Event Listeners
  itemFrom.addEventListener("submit", onAddItemSubmit); // This EventBinding for the button
  itemList.addEventListener("click", onClickItem); // This EventBinding for the li
  ClearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
}

init();
