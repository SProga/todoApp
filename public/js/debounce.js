export default function debounceEvent(callback, time) {
	let interval;
	return (...args) => {
		console.log(...args);
		clearTimeout(interval);
		interval = setTimeout(() => {
			interval = null;
			callback(...args);
		}, time);
	};
}
