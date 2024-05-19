//@ts-nocheck

import { sleep } from './sleep';

let createSound = async (src, loop, id, volume) => {
	let audio = document.createElement('audio');
	audio.setAttribute('id', id);
	audio.volume = volume;
	if (loop) audio.setAttribute('loop', '');
	let source = document.createElement('source');
	source.setAttribute('src', src);
	console.log('enter?');

	document.body.appendChild(audio);
	audio.appendChild(source);
	console.log(audio);
	console.log('audio has created');
	await sleep(0.1);
	audio.play();
	if (!loop) {
		await sleep(5);
		console.log('delete');
		audio.remove();
	}
};

export { createSound };
