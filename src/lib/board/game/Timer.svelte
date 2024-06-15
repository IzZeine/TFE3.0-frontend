<script>
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection';

	$: secTurn = 0;
	let color;

	$: {
		if (secTurn <= 5) {
			color = 'red';
		} else {
			color = '--txtPrimary';
		}
	}

	const onSecTurn = (data) => {
		secTurn = data;
	};

	onMount(() => {
		socket.on('cdTurn', onSecTurn);

		return () => {
			socket.off('cdTurn', onSecTurn);
		};
	});
</script>

<div class="timerTurn" style="--color:{secTurn <= 5 ? 'red' : '--txtPrimary'}">
	{#if secTurn >= 10}
		<p>0:{secTurn}</p>
	{:else}
		<p>0:0{secTurn}</p>
	{/if}
</div>

<style>
	.timerTurn {
		transition: 0.2s;
		color: var(--color);
	}
</style>
