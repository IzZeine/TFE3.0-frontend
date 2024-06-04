<script>
	export let log;
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
			action = `se déplace vers la salle ${room}`;
			break;
		case 'item':
			action = `a récupéré un item dans la salle ${room}`;
			img = item;
			break;
		case 'key':
			action = `a trouvé la clef du donjon dans la salle ${room}`;
			img = item;
			break;
		case 'power':
			action = `a utilisé son pouvoir '${user.abilityName}'`;
			break;
		case 'battleStarted':
			console.log(log);
			action = `frappe quelqu'un dans la salle ${room}`;
			img = 'battle';
			break;
		case 'battleEnded':
			action = `remporte le combat`;
			break;
		default:
			console.log('nothing');
	}
</script>

<li class="log" in:receive out:sendTransition>
	<div class="header">
		<span><img src="/assets/img/{user.heroImg}" alt="userImg" class="fluidimg heroImg" /></span>
		<span class="h2">{user.username}</span>
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
