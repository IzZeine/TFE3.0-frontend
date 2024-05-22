<script>
	//@ts-nocheck
	import RodeurDialog from '$lib/game/Map/dialogs/RodeurDialog.svelte';

	export let user;
	export let currentDialog;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{#if user.name === 'José' && currentDialog === 'inventory'}
	<!-- Ici j'explicite le event handler mais j'aurais pu directement le forwarder à Map https://learn.svelte.dev/tutorial/event-forwarding -->
	<RodeurDialog {user} on:closeDialog={closeDialog} />
{/if}
{#if user.name === 'Raoul' && currentDialog === 'inventory'}
	<!-- Ici j'explicite le event handler mais j'aurais pu directement le forwarder à Map https://learn.svelte.dev/tutorial/event-forwarding -->
	<RodeurDialog {user} on:closeDialog={closeDialog} />
{/if}
