// stores.js
import { writable } from 'svelte/store';

export const user = writable({});

const defaultTimer = {
	running: false,
	startedAt: null,
	elapsedTime: null,
	_interval: null
};

export function stopTimer() {
	clearInterval(moveCd._interval);
	moveCd.set(defaultTimer);
}

export function startTimer() {
	moveCd.set({
		running: true,
		startedAt: Date.now(),
		elapsedTime: 0,
		_interval: setInterval(() => {
			moveCd.update((t) => {
				return {
					...t,
					elapsedTime: Date.now() - t.startedAt
				};
			});
		}, 100) // accurate to 1/10th of a second
	});
}

export const moveCd = writable(defaultTimer);
