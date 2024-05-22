<script>
	import { socket } from '$lib/api/socketConnection';
	import Dialog from './Dialog.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	export let user = user;
	export let currentDialog;

	let myRoom = user.room;
	let dice1 = 1,
		dice2 = 1;
	let nerfDices = 0;
	let luckOfDices = 0;
	let itemInRoom;

	let tryToGetItemInRoom = async () => {
		let getItemBtn = document.querySelector('.getItemBtn');
		let bonusDicesElement = document.querySelector('.bonusDices');
		if (bonusDicesElement) bonusDicesElement.classList.add('isActive');
		let condition = itemInRoom.condition;
		let pointsDices = await rollDice();
		pointsDices += luckOfDices - nerfDices;
		if (pointsDices < condition) {
			getItemBtn.setAttribute('disabled', true);
			await sleep(1);
			getItemBtn.removeAttribute('disabled');

			if (bonusDicesElement) bonusDicesElement.classList.remove('isActive');

			await sleep(0.2);
			luckOfDices = 0;

			return;
		}
		disabledArrows();
		getItemBtn.setAttribute('disabled', true);
		await sleep(1);
		getItemBtn.removeAttribute('disabled');

		if (bonusDicesElement) bonusDicesElement.classList.remove('.isActive');
		luckOfDices = 0;

		let message =
			'Vous avez gagné : \n' +
			"<div class='itemInPopUpDiv'>" +
			"<img class='fluidimg itemInPopUp' src='/assets/img/" +
			itemInRoom.nameId +
			".png'	alt={itemInRoom.nameId}/>" +
			itemInRoom.name +
			'</div>';
		popUp(message);
		displayArrowsDirections();
		socket.emit('playSound', 'woosh');
		socket.emit('getItemInRoom', myRoom);
	};

	onMount(() => {
		socket.on('youAskedRooms', (rooms) => {
			if (!user) return;
			allRooms = rooms;
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			if (!itemInRoom || itemInRoom == 'null') {
				let getItemBtn = document.querySelector('.getItemBtn');
				getItemBtn.setAttribute('disabled', true);
				return;
			}
			itemInRoom = JSON.parse(itemInRoom);
		});
	});

	$: getItemBtnDisabled = !itemInRoom;
</script>

<Dialog {user} {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<div class="dices">
			<div class="dices">
				{#if dice1 && dice2}
					{#if nerfDices != 0}
						<p class="h1 bonusDices nerfOfDices">{luckOfDices - nerfDices}</p>
					{/if}
					{#if luckOfDices != 0}
						<p class="h1 bonusDices luckOfDices">+{luckOfDices}</p>
					{/if}
					<img class="fluidimg dice" src="/assets/img/dice{dice1}.png" alt="dice1" />
					<img class="fluidimg dice" src="/assets/img/dice{dice2}.png" alt="dice2" />
				{/if}
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="itemInRoom">
			{#if itemInRoom && itemInRoom != 'null'}
				{#if itemInRoom.rarity == 'légendaire'}
					<div class="animationLegendary"></div>
				{/if}
				<img
					class="fluidimg itemInRoom"
					src="/assets/img/{itemInRoom.nameId}.png"
					alt={itemInRoom.nameId}
				/>
				<div class="itemInRoom_stats">
					<p class="h1">{itemInRoom.name}</p>
					<p>
						Bonus : <span style="text-transform: uppercase;">{itemInRoom.type}</span>
						+{itemInRoom.bonus}
					</p>
					<p>Condition : faire un {itemInRoom.condition}+</p>
				</div>
			{:else}
				<p>Il n'y a pas d'item dans cette salle.</p>
				<p>Continuez votre chemin!</p>
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<button
			class="getItemBtn actionButton"
			disabled={getItemBtnDisabled}
			on:click={tryToGetItemInRoom}
		>
			<img class="fluidimg" src="/assets/img/diceRoll.png" alt="Ax" />
		</button>
	</svelte:fragment>
</Dialog>
