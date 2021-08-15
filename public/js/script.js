const inputBtn = document.querySelector(".todo__btn");
const input = document.querySelector(".todo__input");
const list = document.querySelector(".todo__list");
const itemsLeft = document.querySelector(".items__left");
const clearBtn = document.querySelector(".clear");

let listArr = [];
itemsLeft.innerHTML = `0 items left`;

inputBtn.addEventListener("click", (e) => {
	const text = input.value;
	if (text.trim().length === 0) {
		return;
	}
	const id = Math.floor(Math.random() * 123333);
	listArr.push({
		id,
		text,
		completed: false,
	});
	input.value = "";
	displayList();
});

list.addEventListener("click", function (e) {
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
		removeTodoItem(id);
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
	const find = listArr.splice(
		listArr.findIndex((item) => item.id === id),
		1
	);
	displayList();
}

function toggleItemStatus(item) {
	item.nextElementSibling.classList.toggle("strike-through");
	item.classList.toggle("show-completed");
	console.log("toggleItemStatus", listArr);
}

function displayList(arr = listArr) {
	list.innerHTML = "";
	console.log("displayList()", arr);
	if (arr.length > 0) {
		arr.forEach((item) => {
			const todoItem = document.createElement("LI");
			todoItem.classList.add("todo__listItem");
			todoItem.innerHTML = `<span class="toggle ${
				item.completed ? "show-completed" : ""
			}" data-id='${item.id}'></span><span class="text ${
				item.completed ? "strike-through" : ""
			}">${item.text}</span><span class="remove-item" data-id='${
				item.id
			}'></span>`;
			list.append(todoItem);
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
	document.body.classList.toggle("dark-theme");
	document.querySelector(".header").classList.toggle("dark-theme");
	document.querySelector(".todo__input").classList.toggle("dark-theme");
	document.querySelector(".todo__container").classList.toggle("dark-theme");
	document.querySelector(".controls").classList.toggle("dark-theme");
	if (document.body.classList.contains("dark-theme")) {
		document.querySelector(".theme__img").src = "./public/images/icon-sun.svg";
	} else {
		document.querySelector(".theme__img").src = "./public/images/icon-moon.svg";
	}
});
