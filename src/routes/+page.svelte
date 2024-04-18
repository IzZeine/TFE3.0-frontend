<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getUser } from '$lib';
	import { goto } from '$app/navigation';

	export let data;

	//const socket = io(import.meta.env.VITE_BACKEND_URL);
	const socket = data.socket;

	let sessionID = '';
	let gameID = '';
	let username = '';
	let user = '';
	let OnlineUsers = 0;

	const onFormSubmit = async () => {
		try {
			// Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
			socket.emit('createUser', username, async (userId) => {
				console.log('created user', userId);
				sessionStorage.setItem('sessionID', userId);
				user = await getUser(socket);
				if (user){
					goto("/game")
				}
			});
		} catch (error) {
			console.error('Error creating user:', error);
		}
		//reload la page quand le form à été envoyé pour avoir le btn "jouer"
	};

	// disabled btn if the input is empty
	function isDirty(username) {
		return username == '';
	}

	let innerWidth;
	const onResize = () => {
		console.log('onResize', innerWidth);
		if (innerWidth > 500) {
			//window.location.href = '/boardGame';
			throw goto('/boardGame');
		}
	};

	onMount(async () => {
		onResize();
		sessionID = sessionStorage.getItem('sessionID');
		if (sessionID) {
			window.location.href = '/game';
		}
		gameID = sessionStorage.getItem('gameID');
		if (gameID) {
			window.location.href = '/game/' + gameID;
		}
		socket.on('connect', async () => {
			console.log('Connected to server');
		});
		// Écouter l'événement de réponse du serveur après la création d'utilisateur
		/*
		socket.on('userCreated', (id) => {
			console.log(id);

			//window.location.reload();
		});
		 */

		socket.on('updateUsersCount', (count) => {
			OnlineUsers = count;
		});

		user = await getUser(socket);
		if (user) {
			//window.location.href = '/game';
			goto('/game');
		}
		return () => {
			socket.offAny();
		};
	});
</script>


<svelte:window
	on:resize={onResize}
	bind:innerWidth
/>

<div class="container">
	<img src="/assets/img/logo.png" class="fluidimg logoImg" alt="Logo" />
	<form on:submit|preventDefault={onFormSubmit} class="form">
		<div>
			<label for="username" class="labelForm">Enter your username:</label>
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
