<script>
	import { onMount } from 'svelte';
	import Dialog from './Dialog.svelte';
	import { user } from '$lib/api/stores';

	export let currentDialog, items;

	let myInventory = $user.inventory.split('/');
	let countOfItems = [];

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
						<img class="fluidimg" src="/assets/img/{item.name}.png" alt={item.name} />
						<p class="numOfItem">
							<span>{item.count}</span>
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</svelte:fragment>
</Dialog>
