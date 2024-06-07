<script>
	import { socket } from '$lib/api/socketConnection';
	import Dialog from './Dialog.svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/api/stores';

	export let items, currentDialog;

	let allRooms;
	let myRoom = $user.room;
	let dice1 = 1,
		dice2 = 1;
	let itemInRoom;
	let dicesAnim = '';

	$: luckOfDices = $user.luckDices;

	let rollDices = async () => {
		for (let i = 0; i < 5; i++) {
			dice1 = Math.floor(Math.random() * 6) + 1;
			dice2 = Math.floor(Math.random() * 6) + 1;
		}
		return dice1 + dice2;
	};

	let tryToGetItemInRoom = async () => {
		socket.emit('usePa', $user);
		let condition = itemInRoom.condition;
		let pointsDices = await rollDices();
		dicesAnim = 'isActive';
		pointsDices += luckOfDices;
		console.log(pointsDices);
		setTimeout(async () => {
			dicesAnim = '';
			if (pointsDices < condition) {
				console.log('raté');
				return;
			}
			console.log('réussi');
			socket.emit('getItemInRoom', myRoom);
		}, 1000);
	};

	onMount(() => {
		socket.emit('getRooms', $user.gameId);
		socket.on('youAskedRooms', (rooms) => {
			if (!user) return;
			allRooms = rooms;
			myRoom = allRooms[$user.room];
			itemInRoom = items.find((item) => item.nameId === myRoom.itemId);
		});
	});

	$: getItemBtnDisabled = !itemInRoom || $user.pa <= 0 || dicesAnim == 'isActive' ? true : false;
</script>

<Dialog {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<div class="dices">
			<div class="dices">
				{#if dice1 && dice2}
					{#if luckOfDices > 0}
						<p class="h1 luckDices" style:color="green">+{luckOfDices}</p>
					{/if}
					{#if luckOfDices < 0}
						<p class="h1 luckDices" style:color="red">{luckOfDices}</p>
					{/if}
					<img class="fluidimg dice {dicesAnim}" src="/assets/img/dice{dice1}.png" alt="dice1" />
					<img class="fluidimg dice {dicesAnim}" src="/assets/img/dice{dice2}.png" alt="dice2" />
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
					<p class="h2">{itemInRoom.rarity}</p>
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

<style>
	.luckDices {
		position: absolute;
		bottom: -100%;
	}
	.dice.isActive {
		transition: 1s;
		animation: animDices 1s;
	}

	@keyframes animDices {
		0% {
			opacity: 1;
		}
		25% {
			opacity: 0.2;
			transform: rotate(0.5turn) scale(0.2);
		}
		75% {
			transform: rotate(1turn) scale(1.1);
		}
		100% {
			opacity: 1;
			transform: rotate(1turn) scale(1);
		}
	}
</style>
