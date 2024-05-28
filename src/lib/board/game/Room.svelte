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
	let columns;
	let position = { x: 0, y: 0 };
	let battleSended = false;
	let activeAnimation = ''; // default ''

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
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
				columns = Math.min(playersInRoom.length, 3);
			} else {
				columns = Math.min(playersInRoom.length, 2);
			}
		}

		if (playersInRoom.length > 1) {
			let battle = playersInRoom.find((user) => user.team === 'boss');
			if (battle && !battleSended) {
				battleSended = true;
				socket.emit('battle', playersInRoom, async (response) => {
					console.log(response);
					battleSended = false;
				});
			}
		}
	}

	onMount(() => {
		socket.on('itemWasTaken', (data) => {
			console.log(data.id - 1);
			if (index == data.id - 1) activeAnimation = 'isActive';
		});
	});
</script>

<ul
	class="room room_{index}"
	style:grid-template-columns=" repeat({columns}, 1fr)"
	style:top="{position.y}px"
	style:left="{position.x}px"
	style:height="{position.height}px"
	style:width="{position.width}px"
>
	{#each playersInRoom as player (player.id)}
		<li class="player" in:receive={{ key: player.id }} out:send={{ key: player.id }} animate:flip>
			<Player {player} />
		</li>
	{/each}
</ul>
<img
	src="/assets/img/inventory.png"
	alt="inventory"
	style:left={`${position.x + position.width / 2}px`}
	style:top={`${position.y + position.height / 2}px`}
	class="fluidimg itemInRoom {activeAnimation}"
/>

<style lang="scss">
	.room {
		position: absolute;
		display: grid;
		justify-content: center;
		align-content: center;
		justify-items: center;
		gap: 6px;
	}
	.player {
		max-width: 60px;
	}
	.itemInRoom {
		max-width: 3%;
		opacity: 0;
		position: absolute;
		transform: translate(-50%, -50%);
		filter: drop-shadow(0 0 5px var(--txtPrimary));
	}

	.itemInRoom.isActive {
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
