let listArr = [
	{
		id: Math.floor(Math.random() * 123333),
		text: "Get started",
		completed: true,
		enterAnimation: false,
		exitAnimation: false,
	},
];
const inputBtn = document.querySelector(".todo__btn");
const input = document.querySelector(".todo__input");
const list = document.querySelector(".todo__list");
const itemsLeft = document.querySelector(".items__left");
const clearBtn = document.querySelector(".clear");
import { getLocalStorageItem } from "./localStorage.js";
import { setLocalStorageItem } from "./localStorage.js";

itemsLeft.innerHTML = `0 items left`;
inputBtn.addEventListener("click", addTodo);

function getLocalStorageTodoItems() {
	let storageTodoItems = getLocalStorageItem("todos");
	let theme = getLocalStorageItem("theme");
	if (storageTodoItems && storageTodoItems.length > 0) {
		listArr = storageTodoItems;
		displayList(listArr);
	} else {
		displayList();
	}
	if (!theme) {
		document.body.classList.add("light-theme");
		document.querySelector(".btn__theme").dataset.theme = "light";
	} else {
		setTheme(theme);
	}
}
getLocalStorageTodoItems();

//FUNCTIONS DEFINITIONS

//* ADD A TODO
function addTodo(e) {
	const text = input.value;
	if (text.trim().length === 0) {
		return;
	}
	const id = Math.floor(Math.random() * 123333);
	listArr.push({
		id,
		text,
		completed: false,
		enterAnimation: false,
		exitAnimation: false,
	});
	input.value = "";
	displayList();
}
//*REMOVE A TODO
function removeTodoItem(id, delay) {
	const allTodos = document.querySelectorAll(".todo__listItem");
	const itemId = parseInt(id);

	allTodos.forEach((todo) => {
		const num = todo.dataset.id;
		const toNum = +num;
		if (toNum === itemId) {
			todo.classList.add("fadeOut");
		}
	});
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			listArr.splice(
				listArr.findIndex((item) => item.id === itemId),
				1
			);
			displayList();
		}, 500);
		resolve();
	});
}
//* END REMOVE TODO

//**************TOGGLE ITEM **********************************/
function toggleItemStatus(item) {
	item.nextElementSibling.classList.toggle("strike-through");
	displayList();
}
//*************END TOGGLE ITEM **********************************/

//*************ALL DRAG EVENTS*****************************/
let dragItem;
function onDragStart(e) {
	dragItem = this;
	const todos = document.querySelectorAll(".todo__listItem");
	for (const item of todos) {
		if (item.dataset.id !== dragItem.dataset.id) {
			item.classList.add("drop-items");
		}
	}
}

function onDragEnd(e) {
	const todos = document.querySelectorAll(".todo__listItem");
	for (const item of todos) {
		item.classList.remove("drop-items");
	}
}

function onDragOver(e) {
	e.preventDefault();
}

function onDragEnter(e) {
	if (this.dataset.id !== dragItem.dataset.id) {
		this.classList.add("dragging");
		this.classList.remove("drop-items");
	}
}

function onDragLeave(e) {
	if (this.dataset.id !== dragItem.dataset.id) {
		this.classList.remove("dragging");
		this.classList.add("drop-items");
	}
}

function onDropItem(e) {
	e.preventDefault();
	let draggedpos,
		droppedpos = 0;
	let dropItem = e.currentTarget;
	const todos = document.querySelectorAll(".todo__listItem");
	todos.forEach((item, index) => {
		if (item.dataset.id === dropItem.dataset.id) {
			droppedpos = index; //drop position index
		}
		if (item.dataset.id === dragItem.dataset.id) {
			draggedpos = index;
		}
		item.classList.remove("dragging");
		item.classList.remove("drop-items");
	});

	if (draggedpos < droppedpos) {
		list.insertBefore(dropItem, dragItem);
	} else {
		list.insertBefore(dragItem, dropItem);
	}

	const newTodos = document.querySelectorAll(".todo__listItem");
	console.log("before search New todosDom");
	newTodos.forEach((todo, index) => {
		console.log(index + " " + todo.dataset.id + " " + todo.innerHTML);
	});

	const makeArr = Array.from(newTodos);
	const newArr = [];
	console.log("before sort ", listArr);
	listArr.forEach((item) => {
		const index = makeArr.findIndex((t) => {
			let num = parseInt(t.dataset.id);
			return num === item.id;
		});
		newArr[index] = item;
	});
	listArr = [...newArr];
	displayList(listArr);
}

// function onDragStartMobile(e) {
// 	e.preventDefault();
// 	dragItem = this;
// 	const todos = document.querySelectorAll(".todo__listItem");
// 	for (const item of todos) {
// 		if (item.dataset.id === dragItem.dataset.id) {
// 			item.classList.add("drop-items");
// 		}
// 	}
// }
// function onDragMoveMobile(e) {
// 	let x = e.touches[0].clientX;
// 	let y = e.touches[0].clientY;

// 	if (e.target.matches(".todo__listItem")) {
// 		e.target.style.position = "absolute";
// 		e.target.style.transform = `translate(${x}px,${y}px)`;
// 	}
// }
//**************END DRAG EVENTS ************************************/

//******************* DISPLAY TODO ITEMS ************************/
function displayList(arr = listArr) {
	list.innerHTML = "";

	if (arr.length > 0) {
		arr.forEach((item) => {
			const todoItem = document.createElement("LI");
			todoItem.classList.add("todo__listItem");
			todoItem.addEventListener("dragstart", onDragStart);
			todoItem.addEventListener("dragenter", onDragEnter);
			todoItem.addEventListener("dragleave", onDragLeave);
			todoItem.addEventListener("dragend", onDragEnd);
			todoItem.addEventListener("dragover", onDragOver);
			todoItem.addEventListener("drop", onDropItem);
			// todoItem.addEventListener("touchstart", onDragStartMobile);
			// todoItem.addEventListener("touchmove", onDragMoveMobile);
			todoItem.draggable = true;
			todoItem.dataset.id = item.id;
			todoItem.innerHTML = `<span class="toggle ${
				item.completed ? "show-completed completed" : ""
			}" data-id='${item.id}'></span><span class="text ${
				item.completed ? "strike-through completed" : ""
			}">${item.text}</span><span class="remove-item" data-id='${
				item.id
			}'></span>`;

			if (!item.enterAnimation) {
				todoItem.classList.add("fadeIn");
				item.enterAnimation = true;
			}
			list.append(todoItem);
			setTimeout(() => {
				todoItem.classList.remove("fadeIn");
			}, 3000);
		});
		setLocalStorageItem("todos", listArr);
	}
	if (arr.length === 0) {
		localStorage.removeItem("todos");
	}

	const remaining = countRemaining();
	if (remaining === 1) {
		itemsLeft.innerHTML = `${remaining} item left`;
	} else {
		itemsLeft.innerHTML = `${remaining} items left`;
	}
}
//******************* DISPLAY TODO ITEMS ************************/

//******************* COUNT REMAINING TODO ITEMS ************************/
function countRemaining() {
	const notCompleted = listArr.filter((todo) => !todo.completed);
	const remaining = notCompleted.length;
	return remaining;
}
//******************* COUNT REMAINING TODO ITEMS ************************/

//******************* FILTER TODO ITEMS ************************/
function filterList(item) {
	const { filter } = item.dataset;
	let filterArr;
	listItemsFilter.forEach((item) => item.classList.remove("active"));
	item.classList.add("active");

	if (filter === "all") {
		filterArr = listArr.filter((item) => item);
		return displayList(filterArr);
	}

	if (filter === "active") {
		filterArr = listArr.filter((item) => item.completed === false);
		return displayList(filterArr);
	}
	if (filter === "completed") {
		filterArr = listArr.filter((item) => item.completed === true);
		return displayList(filterArr);
	} else {
		return;
	}
}
//******************* END FILTER TODO ITEMS ************************/

//EVENT LISTENERS
input.addEventListener("keydown", function (e) {
	if (e.which === 13) {
		addTodo(e);
	}
});
const listItemsFilter = document.querySelectorAll(".controls__btn");
listItemsFilter.forEach((item) => {
	item.addEventListener("click", filterList.bind(null, item));
});

list.addEventListener("click", async function (e) {
	let toggleComplete = ".toggle";
	let removeTodo = ".remove-item";
	if (e.target.matches(toggleComplete)) {
		const { id } = e.target.dataset;
		const itemId = +id;
		const item = listArr.find((item) => item.id === itemId);
		item.completed = !item.completed;
		toggleItemStatus(e.target);
		return;
	}
	if (e.target.matches(removeTodo)) {
		const { id } = e.target.dataset;
		await removeTodoItem(id, 500);
	} else {
		return;
	}
});

clearBtn.addEventListener("click", function (e) {
	listArr = listArr.filter((item) => item.completed === false);
	itemsLeft.innerHTML = `${listArr.length} items left`;
	displayList();
});

const changeTheme = document.querySelector(".btn__theme");
changeTheme.addEventListener("click", toggleTheme);

function toggleTheme() {
	let timer;
	clearTimeout(timer);
	changeTheme.disabled = true; //disable the button to change the theme
	if (document.body.classList.contains("dark-theme")) {
		document.querySelector(".theme__img").src = "./public/images/icon-moon.svg";
		document.body.classList.remove("dark-theme");
		document.body.classList.add("light-theme");
		document.body.classList.add("fadeIn");
		setLocalStorageItem("theme", "light");
	} else {
		document.body.classList.remove("light-theme");
		document.body.classList.add("dark-theme");
		document.body.classList.add("fadeIn");
		document.querySelector(".theme__img").src = "./public/images/icon-sun.svg";
		setLocalStorageItem("theme", "dark");
	}
	timer = setTimeout(() => {
		document.body.classList.remove("fadeIn");
		changeTheme.disabled = false; //re-enable the button to change the theme
	}, 550);
}

function setTheme(theme = "light") {
	if (theme === "dark") {
		document.body.classList.add("dark-theme");
		document.body.classList.remove("light-theme");
	} else {
		document.body.classList.add("light-theme");
		document.body.classList.remove("dark-theme");
	}
	if (document.body.classList.contains("dark-theme")) {
		document.querySelector(".theme__img").src = "./public/images/icon-sun.svg";
	} else {
		document.querySelector(".theme__img").src = "./public/images/icon-moon.svg";
	}
}
