<script>
	import { createEventDispatcher } from 'svelte';
	import PowerDialogs from './PowerDialogs.svelte';
	import Inventory from './Inventory.svelte';
	import Item from './Item.svelte';

	export let items, currentDialog, game;

	console.log('le dialog', currentDialog);

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{#if currentDialog === 'power'}
	<PowerDialogs {currentDialog} {game} on:closeDialog={closeDialog} />
{/if}
{#if currentDialog === 'inventory'}
	<Inventory {items} {currentDialog} on:closeDialog={closeDialog} />
{/if}
{#if currentDialog === 'item'}
	<Item {items} {currentDialog} on:closeDialog={closeDialog} />
{/if}
