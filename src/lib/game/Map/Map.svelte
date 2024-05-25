<script>
	import GameArrows from '$lib/game/Map/GameArrows.svelte';
	import GameHeader from '$lib/game/Map/GameHeader.svelte';
	import GameFooter from '$lib/game/Map/GameFooter.svelte';
	import { fade, fly, blur, slide } from 'svelte/transition';
	import GameDialogs from '$lib/game/Map/dialogs/GameDialogs.svelte';
	import { user } from '$lib/api/stores';

	export let items, game;

	let currentDialog = '';
	function setDialog(e) {
		currentDialog = e.detail;
		console.log(currentDialog);
	}
</script>

{#key user}
	<div class="maxContent" in:blur={{ duration: 300 }} out:blur={{ duration: 300 }}>
		<div class="mapUserContainer">
			<GameHeader />
			<GameArrows />
			<GameFooter on:openDialog={setDialog} />
		</div>
	</div>
{/key}

<GameDialogs {currentDialog} {items} {game} on:closeDialog={() => setDialog('')} />
