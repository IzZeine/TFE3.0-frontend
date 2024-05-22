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

{#if currentDialog === 'power'}
	<PowerDialogs {user} {currentDialog} on:closeDialog={closeDialog} />
{/if}
{#if currentDialog === 'inventory'}
	<Inventory {user} {currentDialog} on:closeDialog={closeDialog} />
{/if}
{#if currentDialog === 'item'}
	<Item {user} {currentDialog} on:closeDialog={closeDialog} />
{/if}
