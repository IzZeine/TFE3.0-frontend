<script>
	export let log;
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let action;

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

	switch (log.type) {
		case 'move':
			action = `se déplace vers la salle ${log.target}`;
			break;
		case 'item':
			action = `à récupérer un item dans la salle ${log.target}`;
			break;
		case 'key':
			break;
		case 'power':
			break;
		case 'battle':
			break;
		default:
			console.log('nothing');
	}
</script>

<li class="log" in:receive out:sendTransition>
	<span><img src="/assets/img/{log.user?.heroImg}" alt="userImg" class="fluidimg heroImg" /></span>
	<span class="h2">{log.user?.username}</span>
	<p>
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
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		background-color: var(--BGTranspary);
		padding: 6px;
	}
</style>
