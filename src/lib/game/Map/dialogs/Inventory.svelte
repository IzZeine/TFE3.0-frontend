<script>
	import { onMount } from 'svelte';
	import Dialog from './Dialog.svelte';
	import { user } from '$lib/api/stores';
	import { blur } from 'svelte/transition';
	import { _ } from 'svelte-i18n';

	export let currentDialog, items;

	let myInventory = $user.inventory.split('/');
	let countOfItems = [];
	let currentItem;

	function countOccurrences(arr) {
		if (!$user.inventory) return;
		const counts = {};
		arr.forEach((item) => {
			counts[item] = (counts[item] || 0) + 1;
		});
		return Object.entries(counts).map(([name, count]) => ({ name, count }));
	}

	const updateInventory = () => {
		countOfItems = countOccurrences(myInventory);
	};

	const displayItem = (target) => {
		currentItem = items.find((item) => item.nameId == target.name);
	};
	const removeCurentItem = () => {
		currentItem = null;
	};

	onMount(() => {
		updateInventory();
	});
</script>

<Dialog {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		{#if countOfItems}
			<ul class="inventory">
				{#each countOfItems as item}
					<li class="inventory_item">
						<button class="btnItem" on:click={() => displayItem(item)}>
							<img class="fluidimg" src="/assets/img/{item.name}.png" alt={item.name} />
							<p class="numOfItem">
								<span>{item.count}</span>
							</p>
						</button>
					</li>
				{/each}
			</ul>
			{#if currentItem}
				<div class="currentItem" in:blur={{ duration: 300 }} out:blur={{ duration: 300 }}>
					<img src="/assets/img/{currentItem.nameId}.png" class="fluidimg imgItem" alt="item" />
					<p>{currentItem.name} <span>{currentItem.rarity}</span></p>
					<p>{currentItem.bonus} <span>{currentItem.type}</span></p>
					<button on:click={removeCurentItem}>
						<img src="/assets/img/close.svg" class="fluidimg close" alt="close" />
					</button>
				</div>
			{/if}
		{:else}
			<p class="noItems">{$_('mobile.map.inventory.noItem')}</p>
		{/if}
	</svelte:fragment>
</Dialog>

<style lang="scss">
	.currentItem {
		position: fixed;
		left: 50%;
		transform: translate(-50%, 0);
		border: solid 1px var(--txtPrimary);
		width: 80%;
		box-sizing: border-box;
		padding: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background-color: var(--BGTranspary);
		.close {
			position: absolute;
			top: 0;
			right: 0;
			max-width: 30px;
			margin: 12px;
		}
	}
	.numOfItem {
		color: var(--txtPrimary);
	}
	.noItems {
		text-align: center;
	}
</style>
