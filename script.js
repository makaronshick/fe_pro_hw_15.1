"use strict";

const storageName = "toDoListItems";

const inputElement = document.querySelector(".form__input");
const listElement = document.querySelector("ul");
const addBtnElement = document.querySelector(".form__btn");

addBtnElement.addEventListener("click", () => {
  if (inputElement.value.trim()) {
    const task = {
      id: "id_" + Date.now(),
      text: inputElement.value.trim(),
      isChecked: false,
    };

    renderLi(task);

    if (localStorage.getItem(storageName)) {
      const storageData = JSON.parse(localStorage.getItem(storageName));

      storageData.push(task);
      localStorage.setItem(storageName, JSON.stringify(storageData));
    } else {
      localStorage.setItem(storageName, JSON.stringify([task]));
    }

    inputElement.value = "";
  } else {
    alert("Task can't be empty");
  }
});

listElement.addEventListener("click", (event) => {
  if (event.target.className !== "todo-item__delete") {
    return;
  }

  const storageData = JSON.parse(localStorage.getItem(storageName));

  const result = storageData.filter(
    (task) => task.id !== event.target.parentElement.id
  );

  if (result.length > 0) {
    localStorage.setItem(storageName, JSON.stringify(result));
  } else {
    localStorage.clear();
  }

  event.target.parentElement.childNodes[0].removeEventListener(
    "click",
    checkboxFunc
  );
  event.target.parentElement.remove();
});

const checkboxFunc = (event) => {
  const storageData = JSON.parse(localStorage.getItem(storageName));

  const result = storageData.map((task) => {
    if (task.id === event.target.parentElement.id) {
      task.isChecked = event.target.checked;
    }

    return task;
  });

  const currentLiSpanElement = event.target.parentElement.childNodes[1];

  if (event.target.checked) {
    currentLiSpanElement.classList.add("todo-item--checked");
  } else {
    currentLiSpanElement.classList.remove("todo-item--checked");
  }

  localStorage.setItem(storageName, JSON.stringify(result));
};

function renderLi(task) {
  const itemElement = document.createElement("li");
  itemElement.classList.add("todo-item");
  itemElement.id = task.id;

  const itemCheckboxElement = document.createElement("input");
  itemCheckboxElement.type = "checkbox";
  itemCheckboxElement.checked = task.isChecked;
  itemCheckboxElement.addEventListener("click", checkboxFunc);

  const itemSpanElement = document.createElement("span");
  itemSpanElement.classList.add("todo-item__description");
  itemSpanElement.textContent = task.text;

  if (task.isChecked) {
    itemSpanElement.classList.add("todo-item--checked");
  }

  const delBtnElement = document.createElement("button");
  delBtnElement.classList.add("todo-item__delete");
  delBtnElement.textContent = "Delete task";

  itemElement.append(itemCheckboxElement, itemSpanElement, delBtnElement);
  listElement.append(itemElement);
}

function init() {
  if (localStorage.getItem(storageName)) {
    const storageData = JSON.parse(localStorage.getItem(storageName));

    storageData.forEach((element) => {
      renderLi(element);
    });
  }
}

init();
