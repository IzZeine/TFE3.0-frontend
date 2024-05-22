<script>
	//@ts-nocheck
	import { writable } from 'svelte/store';

	const directions = ['top', 'bot', 'left', 'right'];
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

<div class="directionsArrows">
	{#each directions as direction}
		<button
			class="directionArrow directionArrow_{direction}"
			id={direction}
			disabled={canGoToDirection(direction)}
			on:click={() => goToDirection(direction)}
		>
			<img class="fluidimg directionArrow_img" src="/assets/img/{direction}.svg" alt={direction} />
		</button>
	{/each}
	{#if $timer.running}
		<div>Cooldown {`${$timer.elapsedTime}/${coolDownTime}`}</div>
	{/if}
</div>
<!-- {#if isFixed} -->
<h1
	class="h2 directionSalle"
	in:blur={{ y: 50, duration: mooveSpeed * 500 }}
	out:blur={{ duration: mooveSpeed * 0 }}
>
	Salle {user.room}
</h1>
<!-- {:else} -->
<h1
	class="h2 directionSalle"
	in:blur={{ y: 50, duration: mooveSpeed * 500 }}
	out:blur={{ duration: 0 }}
>
	Mooving..
</h1>
<!-- {/if} -->
