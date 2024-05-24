<script>
	import GameArrows from '$lib/game/Map/GameArrows.svelte';
	import GameHeader from '$lib/game/Map/GameHeader.svelte';
	import GameFooter from '$lib/game/Map/GameFooter.svelte';
	import GameDialogs from '$lib/game/Map/dialogs/GameDialogs.svelte';

	export let user, items, game;

	let currentDialog = '';
	function setDialog(e) {
		currentDialog = e.detail;
		console.log(currentDialog);
	}
</script>

<div class="maxContent">
	<div class="mapUserContainer">
		<GameHeader {user} />
		<GameArrows {user} />
		<GameFooter {user} on:openDialog={setDialog} />
	</div>
</div>

<GameDialogs {user} {currentDialog} {items} {game} on:closeDialog={() => setDialog('')} />
