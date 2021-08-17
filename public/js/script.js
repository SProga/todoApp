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
}

function toggleItemStatus(item) {
	item.nextElementSibling.classList.toggle("strike-through");
	// item.classList.toggle("show-completed");
	// item.classList.toggle("completed");
	displayList();
}

function onDragStartMobile(e) {
	e.preventDefault();
	dragItem = this;
	const todos = document.querySelectorAll(".todo__listItem");
	for (const item of todos) {
		if (item.dataset.id === dragItem.dataset.id) {
			item.classList.add("drop-items");
		}
	}
}

// function onDragMoveMobile(e) {
// 	let x = e.touches[0].clientX;
// 	let y = e.touches[0].clientY;

// 	if (e.target.matches(".todo__listItem")) {
// 		e.target.style.position = "absolute";
// 		e.target.style.transform = `translate(${x}px,${y}px)`;
// 	}
// }

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
	const remaining = countRemaining();
	if (remaining === 1) {
		itemsLeft.innerHTML = `${remaining} item left`;
	} else {
		itemsLeft.innerHTML = `${remaining} items left`;
	}
}

const listItemsFilter = document.querySelectorAll(".controls__btn");
listItemsFilter.forEach((item) => {
	item.addEventListener("click", filterList.bind(null, item));
});

function countRemaining() {
	const notCompleted = listArr.filter((todo) => !todo.completed);
	const remaining = notCompleted.length;
	return remaining;
}

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

const changeTheme = document.querySelector(".btn__theme");
changeTheme.addEventListener("click", () => {
	let timer;
	clearTimeout(timer);
	document.body.classList.toggle("dark-theme");
	document.body.classList.add("fadeIn");
	changeTheme.disabled = true; //disable the button to change the theme
	timer = setTimeout(() => {
		document.body.classList.remove("fadeIn");
		changeTheme.disabled = false; //re-enable the button to change the theme
	}, 550);

	if (document.body.classList.contains("dark-theme")) {
		document.querySelector(".theme__img").src = "./public/images/icon-sun.svg";
	} else {
		document.querySelector(".theme__img").src = "./public/images/icon-moon.svg";
	}
});
