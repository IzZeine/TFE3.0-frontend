<script>
	//@ts-nocheck
	import { createEventDispatcher } from 'svelte';
	import { user } from '$lib/api/stores';
	import { moveCd } from '$lib/api/stores';

	let inventoryBtnDisabled;
	let powerBtnDisabled;

	const dispatch = createEventDispatcher();
	function openInventory() {
		dispatch('openDialog', 'inventory');
	}
	function openPower() {
		dispatch('openDialog', 'power');
	}
	function openItem() {
		dispatch('openDialog', 'item');
	}

	$: inventoryBtnDisabled =
		($user.team == 'hero' || $user.hero == 'Dragon') && !$moveCd.running && $user.life > 0
			? false
			: true;

	// $: powerBtnDisabled = $user.canUsePower && !$moveCd.running &&$user.life>0 ? false : true;
	$: powerBtnDisabled = !$moveCd.running && $user.life > 0 ? false : true;

	$: itemBtnDisabled =
		($user.team == 'hero' || $user.hero == 'Dragon') && !$moveCd.running && $user.life > 0
			? false
			: true;
</script>

<div class="sideBarUser">
	<div class="actionButtons">
		<button
			class="actionButton --inventory"
			disabled={inventoryBtnDisabled}
			on:click={openInventory}
		>
			<img class="fluidimg" src="/assets/img/inventory.png" alt="inventory" />
		</button>
		<button class="actionButton --power" disabled={powerBtnDisabled} on:click={openPower}>
			<img class="fluidimg" src="/assets/img/power.png" alt="power" />
		</button>
		<button class="actionButton --find" disabled={itemBtnDisabled} on:click={openItem}>
			<img class="fluidimg" src="/assets/img/find.png" alt="find" />
		</button>
	</div>
</div>
