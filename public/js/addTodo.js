const input = document.querySelector(".todo__input");

export default function addTodo(e) {
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
