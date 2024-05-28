<script>
	import Player from './Player.svelte';
	import { positions } from './BoardGameSVG.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { socket } from '$lib/api/socketConnection';

	export let activeUsers, index;

	let playersInRoom;
	let columns;
	let position = { x: 0, y: 0 };
	let battleSended = false;

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
					// battleSended = false;
				});
			}
		}
	}
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
		<li in:receive={{ key: player.id }} out:send={{ key: player.id }} animate:flip>
			<Player {player} />
		</li>
	{/each}
</ul>

<style lang="scss">
	.room {
		position: absolute;
		display: grid;
		justify-content: center;
		align-content: center;
		justify-items: center;
		gap: 6px;
	}
	li {
		max-width: 60px;
	}
</style>
