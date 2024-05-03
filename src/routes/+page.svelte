<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getUser } from '$lib';
	import { goto } from '$app/navigation';
	import { socket } from '$lib/js/socketConnection';

	// export let data;
	// const socket = data.socket;

	let sessionID = '';
	let gameID = '';
	let username = '';
	let user = '';

	const onFormSubmit = async () => {
		try {
			// Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
			socket.emit('createUser', username, async (userId) => {
				console.log('created user', userId);
				sessionStorage.setItem('sessionID', userId);
				user = await getUser(socket);
				if (user) {
					goto('/game');
				}
			});
		} catch (error) {
			console.error('Error creating user:', error);
		}
	};

	// disabled btn if the input is empty
	function isDirty(username) {
		return username == '';
	}

	let innerWidth;
	const onResize = () => {
		if (innerWidth > 500) {
			goto('/boardGame');
		}
	};

	onMount(async () => {
		onResize();

		console.log('onMount')

		sessionID = sessionStorage.getItem('sessionID');
		if (sessionID) {
			goto('/game');
		}

		gameID = sessionStorage.getItem('gameID');
		if (gameID) {
			goto(`/game/${gameID}`);
		}

		socket.on('connect', () => {
			console.log('Connected to server');
		});

		user = await getUser(socket);
		if (user) {
			goto('/game');
		}
	});
</script>

<svelte:window on:resize={onResize} bind:innerWidth />

<div class="container">
	<img src="/assets/img/logo.png" class="fluidimg logoImg" alt="Logo" />
	<form on:submit|preventDefault={onFormSubmit} class="form">
		<div>
			<label for="username" class="labelForm">Entrez votre pseudo :</label>
			<input
				type="text"
				name="username"
				id="username"
				class="inputForm"
				placeholder="ex : IzZeine"
				maxlength="12"
				autocomplete="off"
				data-lpignore="true"
				data-form-type="other"
				required
				bind:value={username}
			/>
		</div>
		<button class="btnPrimary btnForm" disabled={isDirty(username)}>Jouer</button>
	</form>
</div>
