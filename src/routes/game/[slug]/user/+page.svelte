<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { socket } from '$lib/api/socketConnection.js';
	import { getUser } from '$lib/api/getUsers.js';

	export let data;
	let { gameId } = data;

	let username = '';
	let user = '';

	const onFormSubmit = async () => {
		console.log('createUser', username);
		try {
			// Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
			socket.emit('createUser', { username, gameId: data.gameId }, async (user) => {
				console.log('createUser response', user);
				console.log('created user', user);
				if (user) {
					sessionStorage.setItem(`sessionID-${data.gameId}`, user.id);
					return goto(`/game/${user.gameId}`);
				}
				return goto(`/game`);
			});
		} catch (error) {
			console.error('Error creating user:', error);
		}
	};

	// disabled btn if the input is empty
	function isDirty(username) {
		return username === '';
	}

	async function isUser(data) {
		user = await getUser(gameId);
		if (user) {
			goto(`/game/${data.gameID}`);
			return;
		}
		if (data) {
			let gameTarget = data.find((game) => (game.gameId = gameId));
			if ((gameTarget.statut = 'closed')) {
				goto(`/game`);
			}
		}
	}

	onMount(async () => {
		await isUser();
		socket.on('updateGames', isUser);
		return () => {
			socket.off('updateGames', isUser);
		};
	});
</script>

<div class="homepage_container" style="margin: auto 0;">
	<div class="homepage_content">
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
					maxlength="9"
					autocomplete="off"
					data-lpignore="true"
					data-form-type="other"
					required
					bind:value={username}
				/>
			</div>
			<button class="btnPrimary btnForm" disabled={isDirty(username)}>Jouer</button>
		</form>
		<a href="/board" class="btnVersionPC">Aller sur la version PC</a>
	</div>
</div>

<style>
	.btnVersionPC {
		/* position: absolute;
		bottom: 30px; */
		padding: 6px;
		border-bottom: solid 1px var(--txtGrey);
		background-color: var(--BGTranspary);
	}
</style>
