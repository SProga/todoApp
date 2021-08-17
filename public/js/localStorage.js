export function setLocalStorageItem(key, item) {
	if (item === "") {
		return;
	}
	const string = JSON.stringify(item);
	localStorage.setItem(key, string);
}

export function getLocalStorageItem(key) {
	return new Promise((resolve, reject) => {
		const item = localStorage.getItem(key);
		if (!item) {
			reject("item wasn't found in localStorage");
			return;
		} else {
			const data = JSON.parse(item);
			resolve(data);
		}
	});
}
