<script>
	//@ts-nocheck
	import { writable } from 'svelte/store';

	const directions = ['up', 'down', 'left', 'right'];
	export let user;

	const coolDownTime = 5000;

	const defaultTimer = {
		running: false,
		startedAt: null,
		elapsedTime: null,
		_interval: null
	};

	const timer = writable(defaultTimer);

	function stopTimer() {
		clearInterval(timer._interval);
		timer.set(defaultTimer);
	}

	function startTimer() {
		timer.set({
			running: true,
			startedAt: Date.now(),
			elapsedTime: 0,
			_interval: setInterval(() => {
				timer.update((t) => {
					t.elapsedTime = Date.now() - t.startTime;
					if (t.elapsedTime > coolDownTime) {
						stopTimer();
					}
				});
			}, 100) // accurate to 1/10th of a second
		});
	}

	function canGoToDirection(direction) {
		if ($timer.running) return false;
		//voir si le user sais aller par la
		return true;
	}

	function goToDirection(direction) {
		startTimer();
		//Envoyer event au socket pour se deplacer
	}
</script>

<div>
	{#each directions as direction}
		<button disabled={canGoToDirection(direction)} on:click={() => goToDirection(direction)}>
			{direction}
		</button>
	{/each}
	{#if $timer.running}
		<div>Cooldown {`${$timer.elapsedTime}/${coolDownTime}`}</div>
	{/if}
</div>
