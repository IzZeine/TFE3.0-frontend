<script>
	export let log, roomsInfos;
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { _ } from 'svelte-i18n';

	let action, img;

	let { type, user, room, item } = log;

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 750,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} translateX(${50 - t * 50}px);
					opacity: ${t}
				`
			};
		}
	});

	function sendTransition(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 750,
			easing: quintOut,
			css: (t) => `
        transform: ${transform} scale(${t});
        opacity: ${1 - t}
      `
		};
	}

	switch (type) {
		case 'move':
			action = $_('desktop.boardGame.log.move') + roomsInfos[room].nameDirection + ` (${room})`;
			break;
		case 'item':
			action = $_('desktop.boardGame.log.item') + roomsInfos[room].nameDirection + ` (${room})`;
			img = item;
			break;
		case 'rock':
			action = $_('desktop.boardGame.log.rock');
			img = 'rock';
			break;
		case 'key':
			action = $_('desktop.boardGame.log.key') + roomsInfos[room].nameDirection + ` (${room})`;
			img = item;
			break;
		case 'power':
			action = $_('desktop.boardGame.log.power') + ` '${user.abilityName}'`;
			break;
		case 'battleStarted':
			action = $_('desktop.boardGame.log.battleStarted') + roomsInfos[room].nameDirection;
			img = 'battle';
			break;
		case 'battleEnded':
			img = 'death';
			action = $_('desktop.boardGame.log.battleEnded');
			break;
		default:
			console.log('nothing');
	}
</script>

<li class="log" in:receive out:sendTransition>
	<div class="header">
		{#if log.type != 'battleEnded'}
			<span><img src="/assets/img/{user.heroImg}" alt="userImg" class="fluidimg heroImg" /></span>
			<span class="h2">{user.username}</span>
		{/if}
		{#if img}
			<span><img src="/assets/img/{img}.png" alt="userImg" class="fluidimg heroImg" /></span>
		{/if}
	</div>
	<p class="action">
		{action}
	</p>
</li>

<style>
	.h2 {
		font-size: 16px;
	}
	.heroImg {
		max-width: 30px;
		height: auto;
	}
	.log {
		background-color: var(--BGTranspary);
		padding: 6px;
	}
	.header {
		display: flex;
		gap: 6px;
		align-items: center;
	}
	.action {
		padding: 6px;
	}
</style>
