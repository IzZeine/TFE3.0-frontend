<script>
	export let log, roomsInfos;
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

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
			action = `se meut vers ${roomsInfos[room].nameDirection} (${room})`;
			break;
		case 'item':
			action = `a rapiné un bien précieux dans ${roomsInfos[room].nameDirection} (${room})`;
			img = item;
			break;
		case 'rock':
			action = `Quelle trouvaille! Une modeste cailloche`;
			img = 'rock';
			break;
		case 'key':
			action = `a mis la main sur la préciaude clef du donjon dans ${roomsInfos[room].nameDirection} (${room})`;
			img = item;
			break;
		case 'power':
			action = `a proféré un puissant enchantement '${user.abilityName}'`;
			break;
		case 'battleStarted':
			action = `C'est un attrapoire ! il y a un ${user.hero} dans ${roomsInfos[room].nameDirection}`;
			img = 'battle';
			break;
		case 'battleEnded':
			img = 'death';
			action = `Malaventure! Les héros s'esbignent prestement. Ils se sont pris une sacrée torgnole.`;
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
