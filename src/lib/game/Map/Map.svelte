<script>
	import GameArrows from '$lib/game/Map/GameArrows.svelte';
	import GameHeader from '$lib/game/Map/GameHeader.svelte';
	import GameFooter from '$lib/game/Map/GameFooter.svelte';
	import { fade, fly, blur, slide } from 'svelte/transition';
	import GameDialogs from '$lib/game/Map/dialogs/GameDialogs.svelte';
	import Battle from '$lib/game/Map/dialogs/Battle.svelte';
	import { user } from '$lib/api/stores';
	import { onMount } from 'svelte';

	export let items, game;

	let activeUsers;
	$: activeUsers = game.users;

	let currentDialog = '';

	function setDialog(e) {
		currentDialog = e.detail;
	}

	const onUpdateUsers = (players) => {
		// console.log('[boardGame] onUpdateusers', players);
		activeUsers = players.map((player) => {
			return {
				...player
			};
		});
	};

	onMount(() => {
		socket.on('updateUsers', onUpdateUsers);
		return () => {
			socket.off('updateUsers', onUpdateUsers);
		};
	});
</script>

{#key user}
	<div class="maxContent" in:blur={{ duration: 300 }} out:blur={{ duration: 300 }}>
		<div class="mapUserContainer">
			<GameHeader />
			<GameArrows />
			<GameFooter on:openDialog={setDialog} />
		</div>
		<Battle {activeUsers} />
	</div>
{/key}

<GameDialogs {currentDialog} {items} {game} on:closeDialog={() => setDialog('')} />
