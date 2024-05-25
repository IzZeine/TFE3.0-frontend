<script>
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { socket } from '$lib/api/socketConnection';
	import { user } from '$lib/api/stores';

	let moveSpeed = 1000;

	const roomsConnections = $page.data.roomsConnections;
	const directions = ['top', 'bot', 'left', 'right'];

	$: myRoom = $user.room;
	$: currentUser = $user;
	$: directionsInMyRoom = roomsConnections[myRoom];

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
					return {
						...t,
						elapsedTime: Date.now() - t.startedAt
					};
				});
			}, 100) // accurate to 1/10th of a second
		});
	}

	let canGoTop;
	let canGoLeft;
	let canGoRight;
	let canGoBot;

	$: {
		console.log(currentUser);
		canGoTop = canGoToDirection(currentUser, 'top');
		canGoLeft = canGoToDirection(currentUser, 'left');
		canGoRight = canGoToDirection(currentUser, 'right');
		canGoBot = canGoToDirection(currentUser, 'bot');
	}

	function canGoToDirection(user, direction) {
		user = currentUser;
		if ($timer.running) return false;
		if (user.life <= 0) return false;
		directionsInMyRoom = roomsConnections[user.room];
		if (!myRoom) myRoom = user.room;
		return directionsInMyRoom?.[direction];
	}

	function goToDirection(direction) {
		// startTimer();
		let targetRoom = directionsInMyRoom[direction];
		if (!targetRoom) return;
		if (targetRoom == 19) {
			// let hasKey = myInventory.some((item) => item.nameId === 'key');
			// if (!hasKey) {
			// 	popUp("You don't have the key");
			// 	return;
		}
		myRoom = targetRoom;
		console.log(targetRoom);
		socket.emit('askToChangeRoom', targetRoom, async (response) => {
			user.set(response.user);
			myRoom = $user.room;
			directionsInMyRoom = roomsConnections[$user.room];
		});
	}

	$: {
		if ($timer.elapsedTime > coolDownTime) {
			stopTimer();
		}
	}
</script>

{#if user}
	<div class="directionsArrows">
		<button
			class="directionArrow directionArrow_top"
			id="top"
			disabled={!canGoTop}
			on:click={() => goToDirection('top')}
		>
			<img class="fluidimg directionArrow_img" src="/assets/img/top.svg" alt="top" />
		</button>
		<button
			class="directionArrow directionArrow_left"
			id="left"
			disabled={!canGoLeft}
			on:click={() => goToDirection('left')}
		>
			<img class="fluidimg directionArrow_img" src="/assets/img/left.svg" alt="left" />
		</button>
		<button
			class="directionArrow directionArrow_right"
			id="right"
			disabled={!canGoRight}
			on:click={() => goToDirection('right')}
		>
			<img class="fluidimg directionArrow_img" src="/assets/img/right.svg" alt="right" />
		</button>
		<button
			class="directionArrow directionArrow_bot"
			id="bot"
			disabled={!canGoBot}
			on:click={() => goToDirection('bot')}
		>
			<img class="fluidimg directionArrow_img" src="/assets/img/bot.svg" alt="bot" />
		</button>
		{#if $timer?.running}
			<div>Cooldown {`${$timer.elapsedTime}/${coolDownTime}`}</div>
		{/if}
	</div>
{/if}
<!-- {#if isFixed} -->
<h1
	class="h2 directionSalle"
	in:blur={{ y: 50, duration: moveSpeed * 500 }}
	out:blur={{ duration: moveSpeed * 0 }}
>
	Salle {$user.room}
</h1>
<!-- {:else} -->
<h1
	class="h2 directionSalle"
	in:blur={{ y: 50, duration: moveSpeed * 500 }}
	out:blur={{ duration: 0 }}
>
	Mooving..
</h1>
<!-- {/if} -->
