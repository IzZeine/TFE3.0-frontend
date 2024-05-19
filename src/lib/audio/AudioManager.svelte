<script>
	import { socket } from '$lib/api/socketConnection.js';
	import { sleep } from '$lib';
	import { onMount } from 'svelte';
	import AudioPlayer from '$lib/audio/AudioPlayer.svelte';

	const players = [];

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

	const playThisSound = async (data) => {
		console.log('playThisSound', data);
		const path = '/assets/sounds/' + data + '.mp3';
		let volume = 1;
		if (data === 'sword') volume = 0.7;
		await createSound(path, false, data, volume);
	};

	onMount(() => {
		socket.on('playThisSound', playThisSound);
		return () => {
			return socket.off('playThisSound', playThisSound);
		};
	});
</script>

{#each players as player}
	<AudioPlayer src={player.src} loop={player.loop} autoplay={true} />
{/each}
