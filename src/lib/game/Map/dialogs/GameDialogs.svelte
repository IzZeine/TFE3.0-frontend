<script>
	import { createEventDispatcher } from 'svelte';
	import PowerDialogs from './PowerDialogs.svelte';
	import Inventory from './Inventory.svelte';
	import { fade, fly, blur, slide } from 'svelte/transition';
	import Item from './Item.svelte';

	export let items, currentDialog, game;

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{#if currentDialog}
	<div class="dialog" in:blur={{ duration: 300 }} out:blur={{ duration: 300 }}>
		{#if currentDialog === 'power'}
			<PowerDialogs {currentDialog} {game} on:closeDialog={closeDialog} />
		{/if}
		{#if currentDialog === 'inventory'}
			<Inventory {items} {currentDialog} on:closeDialog={closeDialog} />
		{/if}
		{#if currentDialog === 'item'}
			<Item {items} {currentDialog} on:closeDialog={closeDialog} />
		{/if}
	</div>
{/if}
