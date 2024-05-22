<script>
	import { createEventDispatcher } from 'svelte';
	import PowerDialogs from './PowerDialogs.svelte';
	import Inventory from './Inventory.svelte';
	import Item from './Item.svelte';

	export let user;
	export let currentDialog;

	console.log('le dialog', currentDialog);

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{user.hero}

{#if currentDialog === 'power'}
	<!-- Ici j'explicite le event handler mais j'aurais pu directement le forwarder à Map https://learn.svelte.dev/tutorial/event-forwarding -->
	<PowerDialogs {user} {currentDialog} on:closeDialog={closeDialog} />
{/if}
{#if currentDialog === 'inventory'}
	<!-- Ici j'explicite le event handler mais j'aurais pu directement le forwarder à Map https://learn.svelte.dev/tutorial/event-forwarding -->
	<Inventory {user} {currentDialog} on:closeDialog={closeDialog} />
{/if}
{#if currentDialog === 'item'}
	<!-- Ici j'explicite le event handler mais j'aurais pu directement le forwarder à Map https://learn.svelte.dev/tutorial/event-forwarding -->
	<Item {user} {currentDialog} on:closeDialog={closeDialog} />
{/if}
