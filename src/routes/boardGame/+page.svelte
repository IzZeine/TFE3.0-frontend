<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { getMyUrlForDev } from '$lib';
	import { onMount } from 'svelte';

	export let data;
	const socket = data.socket

	let gameID;
	let OnlineUsers = 0;
	let errorMessage = '';
	let gameName = '';

	onMount(async () => {
		onResize();

		gameID = sessionStorage.getItem('gameID');

		if (gameID) {
			throw goto(`/boardGame/${gameID}`)
		}

		socket.on('connect', async () => {
			console.log('Connected to server');
			console.log(socket)
		});

		socket.on('updateUsersCount', (count) => {
			OnlineUsers = count;
		});
	});

	// disabled btn if the input is empty
	function isDirty(username) {
		return username == '';
	}

	let url = getMyUrlForDev()
	console.log(`${url}/creategame`)
	let createGame = async () => {
		const response = await fetch(`${url}/creategame`, {
		// const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/creategame`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: gameName })
		});

		if (response.ok) {
			// Gérer la réponse si nécessaire
			console.log('Game created successfully');
			const gameJson = await response.json();
			console.log(gameJson);
			gameID = gameJson.gameId;
			sessionStorage.setItem('gameID', gameID);
			throw goto(`/boardGame/${gameID}`)
		} else {
			console.error('Failed to create game');
			errorMessage = 'Ce nom existe dejà !';
		}
	};

	let innerWidth;
	const onResize = () => {
		if (innerWidth < 500) {
			throw goto('/');
		}
	};
</script>

<svelte:window on:resize={onResize} bind:innerWidth />

<img class="fluidimg QRCode" src="/assets/img/QR.svg" alt="QRCode" />

<div class="createGame">
	<div class="content">
		<img src="/assets/img/logo.png" class="fluidimg logoImg" alt="Logo" />
		<form on:submit|preventDefault={createGame} class="gameNameForm">
			<div class="gameNameForm_content">
				<label for="gameName" class="gameNameLabel">Enter your game's name:</label>
				<input
					type="text"
					name="gameName"
					id="gameName"
					class="inputForm"
					placeholder="ex : IzZeine's game"
					maxlength="15"
					size="20"
					autocomplete="off"
					data-lpignore="true"
					data-form-type="other"
					required
					bind:value={gameName}
				/>
				{#if errorMessage}
					<p class="errorCreateGame">{errorMessage}</p>
				{/if}
			</div>
			<button class="btnPrimary btnForm" disabled={isDirty(gameName)}>Jouer</button>
		</form>
	</div>
</div>
<!-- @TODO : faire l'icon du boss (1 à 3) -->

<!-- @TODO++ : ajouter des animations quelconques : lancement de combat, récupération d'un item, utilisation de sort -->
