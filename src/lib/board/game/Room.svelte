<script>
	import Player from './Player.svelte';
	import { positions } from './BoardGameSVG.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { socket } from '$lib/api/socketConnection';
	import { onMount } from 'svelte';

	export let activeUsers, index;

	let playersInRoom;
	let columns, maxWidth;
	let position = { x: 0, y: 0 };
	let battleSended = false;
	let animItem = ''; // default ''
	let animBattle = ''; // default ''
	let animItemImg = 'inventory';

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 500,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	$: {
		playersInRoom = activeUsers.filter((user) => user.room === index).map((user) => ({ ...user }));

		const roomPosition = $positions?.find((roomPosition) => roomPosition.id === `room${index}`);
		if (roomPosition) {
			position = roomPosition;
			if (position.width >= position.height) {
				maxWidth = position.height;
				columns = 3;
			} else {
				columns = 2;
			}
		}

		if (playersInRoom.length > 1) {
			let battle = playersInRoom.find((user) => user.team === 'boss');
			if (battle && !battleSended) {
				battleSended = true;
				socket.emit('battle', playersInRoom, async (response) => {
					battleSended = false;
				});
			}
		}
	}

	const onTakeItem = (data) => {
		let id = data.id;
		while (id > 39) {
			id -= 39;
		}
		if (index == id - 1) {
			if (data.itemId == 'key') animItemImg = 'key';
			animItem = 'isActive';
		}
	};

	const onTakeRock = (data) => {
		if (index == data) {
			animItemImg = 'rock';
			animItem = 'isActive';
		}
	};

	const onBattle = (data) => {
		if (index == data) animBattle = 'isActive';
	};

	onMount(() => {
		socket.on('itemWasTaken', onTakeItem);
		socket.on('takeRock', onTakeRock);
		socket.on('battle', onBattle);
		return () => {
			socket.off('itemWasTaken', onTakeItem);
			socket.off('takeRock', onTakeRock);
			socket.off('battle', onBattle);
		};
	});
</script>

<div
	class="room"
	style:top="{position.y}px"
	style:left="{position.x}px"
	style:height="{position.height}px"
	style:width="{position.width}px"
>
	<ul class="playerList room_{index}" style:grid-template-columns=" repeat({columns}, auto)">
		{#each playersInRoom as player (player.id)}
			<li
				class="player"
				style:max-width="{maxWidth}px"
				in:receive={{ key: player.id }}
				out:send={{ key: player.id }}
				animate:flip={{ duration: 250 }}
			>
				<Player {player} />
			</li>
		{/each}
	</ul>
	<div class="animContainer">
		<img
			src="/assets/img/{animItemImg}.png"
			alt="inventory"
			class="fluidimg imgAnim itemInRoom {animItem}"
		/>
		<img src="/assets/img/battle.png" alt="swords" class="fluidimg imgAnim battle {animBattle}" />
	</div>
</div>

<style lang="scss">
	.room {
		position: fixed;
	}

	.playerList {
		display: grid;
		justify-content: center;
		align-content: center;
		justify-items: center;
		width: 100%;
		height: 100%;
	}

	.animContainer {
		width: 100%;
		height: 100%;
		transform: translate(0, -100%);
	}

	.imgAnim {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 3.5rem;
		opacity: 0;
	}

	.itemInRoom {
		filter: drop-shadow(0 0 5px var(--txtPrimary));
	}

	.battle {
		filter: drop-shadow(0 0 5px red);
	}

	.imgAnim.isActive {
		animation: animUp 2s;
	}

	@keyframes animUp {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) translateY(0px);
		}
		75% {
			opacity: 1;
			transform: translate(-50%, -50%) translateY(-15px);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) translateY(-15px);
		}
	}
</style>
