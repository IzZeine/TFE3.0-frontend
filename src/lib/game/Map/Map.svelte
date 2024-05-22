<script>
	import GameArrows from '$lib/game/Map/GameArrows.svelte';
	import GameHeader from '$lib/game/Map/GameHeader.svelte';
	import GameFooter from '$lib/game/Map/GameFooter.svelte';
	import GameDialogs from '$lib/game/Map/dialogs/GameDialogs.svelte';

	export let user;

	let currentDialog = '';
	function setDialog(e) {
		//set dialogId to "" to close;
		//voir https://svelte.dev/repl/053c93e397ab4ccd8921d2beca238ffe?version=3.29.4
		currentDialog = e.detail;
		console.log(currentDialog);
	}
</script>

<div class="maxContent">
	<div class="mapUserContainer">
		<GameHeader {user} />
		<GameArrows {user} />
		<GameFooter {user} {currentDialog} on:openDialog={setDialog} />
	</div>
</div>

<GameDialogs {user} {currentDialog} on:closeDialog={() => setDialog('')} />
