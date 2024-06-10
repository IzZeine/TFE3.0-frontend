<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let innerWidth = 0;
	const onResize = () => {
		if (innerWidth < 500) {
			goto('/');
		}
	};

	onMount(() => {
		onResize();
	});
</script>

<svelte:window on:resize={onResize} bind:innerWidth />
<slot />
