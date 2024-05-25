<script>
	import GameArrows from '$lib/game/Map/GameArrows.svelte';
	import GameHeader from '$lib/game/Map/GameHeader.svelte';
	import GameFooter from '$lib/game/Map/GameFooter.svelte';
	import { user } from '$lib/api/stores';
	import GameDialogs from '$lib/game/Map/dialogs/GameDialogs.svelte';

	export let items, game;

	let currentDialog = '';
	function setDialog(e) {
		currentDialog = e.detail;
		console.log(currentDialog);
	}
</script>

<div class="maxContent">
	<div class="mapUserContainer">
		<GameHeader />
		<GameArrows />
		<GameFooter on:openDialog={setDialog} />
	</div>
</div>

<GameDialogs {currentDialog} {items} {game} on:closeDialog={() => setDialog('')} />
