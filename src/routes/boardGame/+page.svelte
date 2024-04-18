<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	export let data;
	const socket = data.socket;

	let gameID;
	let OnlineUsers = 0;
	let errorMessage = '';
	let gameName = '';

	onMount(async () => {
		gameID = sessionStorage.getItem('gameID');

		if (gameID) {
			window.location.href = '/boardGame/' + gameID;
		}

		socket.on('connect', async () => {
			console.log('Connected to server');
		});

		socket.on('updateUsersCount', (count) => {
			OnlineUsers = count;
		});

		if (screen.width < 500) {
			window.location.href = '/';
		}
	});

	// disabled btn if the input is empty
	function isDirty(username) {
		return username == '';
	}

	let createGame = async () => {
		if (screen.width < 500) {
			window.location.href = '/';
			return;
		}
		const response = await fetch('http://localhost:3000/creategame', {
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
			window.location.href = '/boardGame/' + gameID;
		} else {
			console.error('Failed to create game');
			errorMessage = 'Ce nom existe dejà !';
		}
	};
</script>

<!-- @TODO : add QR Code -->

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
