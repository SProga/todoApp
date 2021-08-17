export function setLocalStorageItem(key, item) {
	if (item === "") {
		return;
	}
	const string = JSON.stringify(item);
	localStorage.setItem(key, string);
}

export function getLocalStorageItem(key) {
	const item = localStorage.getItem(key);
	if (!item) {
		return null;
	} else {
		const data = JSON.parse(item);

		return data;
	}
}
