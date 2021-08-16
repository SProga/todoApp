const inputBtn = document.querySelector(".todo__btn");
const input = document.querySelector(".todo__input");
const list = document.querySelector(".todo__list");
const itemsLeft = document.querySelector(".items__left");
const clearBtn = document.querySelector(".clear");

let listArr = [];
itemsLeft.innerHTML = `0 items left`;

inputBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", function (e) {
	if (e.which === 13) {
		addTodo(e);
	}
});
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
		await removeTodoItem(id);
	} else {
		return;
	}
});

clearBtn.addEventListener("click", function (e) {
	listArr = listArr.filter((item) => item.completed === false);
	itemsLeft.innerHTML = `${listArr.length} items left`;
	displayList();
});

function removeTodoItem(id) {
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

// DRAGGING
//IUSE querySelectorAll on the list Items
let dragItem;
list.addEventListener("dragstart", function (e) {
	dragItem = e.target;
	const todos = this.childNodes;
	for (const item of todos) {
		if (item.childNodes[0].dataset.id !== dragItem.dataset.id) {
			item.classList.add("drop-items");
		}
	}
});

list.addEventListener("dragend", function (e) {
	const todos = this.childNodes;
	for (const item of todos) {
		item.classList.remove("drop-items");
	}
});

function onDragEnter(e) {
	const current = e.target;

	if (current.dataset.id !== dragItem.dataset.id) {
		current.classList.add("dragging");
	}
}

function onDragLeave(e) {
	const current = e.target;
	if (current.dataset.id !== dragItem.dataset.id) {
		current.classList.remove("dragging");
	}
}

list.addEventListener("dragover", function (e) {
	const todos = this.childNodes;
	for (const item of todos) {
		if (item.childNodes[0].dataset.id === dragItem.dataset.id) {
			e.preventDefault();
		}
	}
});

function onDropItem(e) {
	e.preventDefault();
	let draggedpos,
		droppedpos = 0;
	let dropItem = e.currentTarget;
	const todos = document.querySelectorAll(".todo__listItem");
	todos.forEach((item, index) => {
		console.log("itemid", item.dataset.id);
		console.log("datasetid", dragItem.dataset.id);
		if (item.dataset.id === dropItem.dataset.id) {
			droppedpos = index; //drop position index
		}
		if (item.dataset.id === dragItem.dataset.id) {
			draggedpos = index;
		}
	});

	if (draggedpos < droppedpos) {
		list.insertBefore(dropItem, dragItem);
	} else {
		list.insertBefore(dragItem, dropItem);
	}
}

function toggleItemStatus(item) {
	item.nextElementSibling.classList.toggle("strike-through");
	item.classList.toggle("show-completed");
	console.log("toggleItemStatus", listArr);
}

function displayList(arr = listArr) {
	list.innerHTML = "";

	if (arr.length > 0) {
		arr.forEach((item) => {
			const todoItem = document.createElement("LI");
			todoItem.classList.add("todo__listItem");
			todoItem.addEventListener("drop", onDropItem);
			todoItem.addEventListener("dragenter", onDragEnter);
			todoItem.addEventListener("dragleave", onDragLeave);
			todoItem.draggable = true;
			todoItem.dataset.id = item.id;
			todoItem.innerHTML = `<span class="toggle ${
				item.completed ? "show-completed" : ""
			}" data-id='${item.id}'></span><span class="text ${
				item.completed ? "strike-through" : ""
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
	}
	if (listArr.length === 1) {
		itemsLeft.innerHTML = `${listArr.length} item left`;
	} else {
		itemsLeft.innerHTML = `${listArr.length} items left`;
	}
}

const listItemsFilter = document.querySelectorAll(".controls__btn");
listItemsFilter.forEach((item) => {
	item.addEventListener("click", filterList.bind(null, item));
});

function filterList(item) {
	const { filter } = item.dataset;
	let filterArr;
	listItemsFilter.forEach((item) => item.classList.remove("active"));
	item.classList.add("active");

	if (filter === "active") {
		filterArr = listArr.filter((item) => item.completed === false);
		return displayList(filterArr);
	}
	if (filter === "completed") {
		filterArr = listArr.filter((item) => item.completed === true);
		return displayList(filterArr);
	} else {
		return displayList();
	}
}

const changeTheme = document.querySelector(".btn__theme");
changeTheme.addEventListener("click", () => {
	let timer;
	clearTimeout(timer);
	document.body.classList.toggle("dark-theme");
	document.body.classList.add("fadeIn");
	changeTheme.disabled = true;
	timer = setTimeout(() => {
		document.body.classList.remove("fadeIn");
		changeTheme.disabled = false;
	}, 550);

	if (document.body.classList.contains("dark-theme")) {
		document.querySelector(".theme__img").src = "./public/images/icon-sun.svg";
	} else {
		document.querySelector(".theme__img").src = "./public/images/icon-moon.svg";
	}
});
