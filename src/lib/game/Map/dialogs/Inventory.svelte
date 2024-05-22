<script>
	import { onMount } from 'svelte';
	import Dialog from './Dialog.svelte';

	export let user;
	export let currentDialog;

	let myInventory = [];
	let countOfItems = [];

	const compterObjetsIdentiques = (array) => {
		const compteur = {}; // Objet pour stocker les occurrences des objets
		// Parcourir le tableau d'objets
		array.forEach((item) => {
			// Convertir l'objet en une chaîne JSON pour le représenter comme une clé
			const cle = item.nameId;
			// Incrémenter le compteur pour cette clé
			compteur[cle] = (compteur[cle] || 0) + 1;
		});
		return compteur;
	};

	const updateInventory = (user) => {
		let inventory = user.inventory;
		if (!inventory) return;
		myInventory = [];
		inventory = inventory.split('/');
		for (let item of inventory) {
			item = JSON.parse(item);
			myInventory.push(item);
		}

		countOfItems = compterObjetsIdentiques(myInventory);
		countOfItems = Object.entries(countOfItems).map(([cle, valeur]) => ({ [cle]: valeur }));
	};

	onMount(() => {
		updateInventory(user);
	});
</script>

<Dialog {user} {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		{#if countOfItems}
			<ul class="inventory">
				{#each countOfItems as item, index}
					<li class="inventory_item">
						<img
							class="fluidimg"
							src="/assets/img/{Object.keys(countOfItems[index])[0]}.png"
							alt={Object.keys(countOfItems[index])[0]}
						/>
						<p class="numOfItem">
							<span>{countOfItems[index][Object.keys(countOfItems[index])[0]]}</span>
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</svelte:fragment>
</Dialog>
