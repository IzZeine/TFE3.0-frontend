<script>
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let user;

	const roomsConnections = $page.data.roomsConnections;
	const directions = ['top', 'bot', 'left', 'right'];

	let myRoom = user.room;
	let directionsInMyRoom;

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
					console.log(t);
					t.elapsedTime = Date.now() - t.startedAt;
					if (t.elapsedTime > coolDownTime) {
						stopTimer();
					}
				});
			}, 1000) // accurate to 1/10th of a second
		});
	}

	function canGoToDirection(direction) {
		if ($timer.running) return false;
		if (user.life <= 0) return false;
		if (!myRoom) myRoom = user.room;
		directionsInMyRoom = roomsConnections[user.room];
		if (directionsInMyRoom?.[direction] == 'null') return true;
		return false;
	}

	console.log(canGoToDirection('top'));

	function goToDirection(direction) {
		startTimer();
		//Envoyer event au socket pour se deplacer
	}

	onMount(() => {});
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
	{#if $timer?.running}
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
