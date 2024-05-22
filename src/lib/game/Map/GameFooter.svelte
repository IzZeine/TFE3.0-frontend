<script>
	//@ts-nocheck
	import { createEventDispatcher } from 'svelte';

	export let user;

	let inventoryBtnDisabled;
	let powerBtnDisabled;

	const dispatch = createEventDispatcher();
	function openInventory() {
		dispatch('openDialog', 'inventory');
	}
	function usePower() {
		dispatch('openDialog', 'power');
	}

	$: inventoryBtnDisabled = user.atk > 1; //Mettre logique pour voir si inventaire ouvrable
	$: powerBtnDisabled = user.atk > 1; //Mettre logique pour voir si power ouvrable
</script>

<div>
	<button disabled={inventoryBtnDisabled} on:click={openInventory}>Inventory</button>
	<button disabled={powerBtnDisabled} on:click={usePower}>Power</button>
</div>
