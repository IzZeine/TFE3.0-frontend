<script>
	import RodeurDialog from '$lib/game/Map/dialogs/RodeurDialog.svelte';
	import { createEventDispatcher } from 'svelte';

	export let user;
	export let currentDialog;

	const dispatch = createEventDispatcher();

	const useAbility = (data) => {
		console.log('ability');
	};

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{#if user.hero === 'Rodeur'}
	<RodeurDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
