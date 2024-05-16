//@ts-nocheck

import { sleep } from './sleep';

let createAudio = async (src, loop, id, volume) => {
	let audio = document.createElement('audio');
	audio.setAttribute('id', id);
	audio.volume = volume;
	if (loop) audio.setAttribute('loop', '');
	let source = document.createElement('source');
	source.setAttribute('src', src);

	document.addEventListener(
		'click',
		async function () {
			document.body.appendChild(audio);
			audio.appendChild(source);
			console.log(audio);
			console.log('audio has created');
			audio.play();
			if (!loop) {
				await sleep(5);
				console.log('delete');
				audio.remove();
			}
		},
		{ once: true }
	);

	// Stocker la position de lecture actuelle dans le localStorage
	audio.addEventListener('timeupdate', function () {
		sessionStorage.setItem('audioPosition', audio.currentTime);
	});

	// Récupérer la position de lecture depuis le localStorage lors du chargement de la page
	let savedPosition = sessionStorage.getItem('audioPosition');
	if (savedPosition) {
		audio.currentTime = parseFloat(savedPosition);
	}
};

export { createAudio };
