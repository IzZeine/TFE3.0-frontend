<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import QRCode from '$lib/board/QRCode.svelte';
	import { _ } from 'svelte-i18n';

	export let form;

	let gameID;
	let gameName = '';

	const onConnect = () => {
		console.log('connected');
	};
	const updateUserCount = (count) => {
		console.log('onlineUsers', count);
	};

	onMount(async () => {
		console.log('board');
		gameID = sessionStorage.getItem('gameID');

		if (gameID) {
			console.log('has board game');
			goto(`/boardGame/${gameID}`);
		} else {
			socket.on('connect', onConnect);
			socket.on('updateUsersCount', updateUserCount);
			sessionStorage.clear();
		}

		return () => {
			socket.off('connect', onConnect);
			socket.off('updateUsersCount', updateUserCount);
		};
	});

	// disabled btn if the input is empty
	function isDirty(username) {
		return username === '';
	}
</script>

<QRCode />

<div class="boardgame--home">
	<div class="boardgame--home_content">
		<img src="/assets/img/logo.png" class="fluidimg boardgame--home_logoImg" alt="Logo" />
		<form method="post" class="gameNameForm">
			<div class="gameNameForm_content">
				<label for="gameName" class="gameNameLabel">{$_('desktop.create.formName')}:</label>
				<input
					type="text"
					name="gameName"
					id="gameName"
					class="inputForm"
					placeholder={$_('desktop.create.inputExample')}
					maxlength="15"
					size="20"
					autocomplete="off"
					data-lpignore="true"
					data-form-type="other"
					required
					bind:value={gameName}
				/>
				{#if form?.error}
					{#if form.message == 'gameNameAlreadyExist'}
						<p class="errorCreateGame">{$_('error.gameNameAlreadyExist')}</p>
					{/if}
				{/if}
			</div>
			<button class="btnPrimary btnForm" disabled={isDirty(gameName)}>{$_('common.play')}</button>
		</form>
	</div>
</div>
