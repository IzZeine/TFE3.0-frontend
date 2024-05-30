<script>
	import { page } from '$app/stores';
	import { socket } from '$lib/api/socketConnection';
	import { blur } from 'svelte/transition';
	import { user, moveCd, startTimer, stopTimer } from '$lib/api/stores';
	import { onMount } from 'svelte';

	const roomsConnections = $page.data.roomsConnections;
	const directions = ['top', 'bot', 'left', 'right'];

	$: moveSpeed = $user.speed * 1000;
	$: myRoom = $user.room;
	$: currentUser = $user;
	$: cd = $moveCd;
	$: directionsInMyRoom = roomsConnections[myRoom];

	let battleRoom;
	let canGoTop, canGoLeft, canGoRight, canGoBot;

	$: {
		canGoTop = canGoToDirection(currentUser, 'top', cd);
		canGoLeft = canGoToDirection(currentUser, 'left', cd);
		canGoRight = canGoToDirection(currentUser, 'right', cd);
		canGoBot = canGoToDirection(currentUser, 'bot', cd);
	}

	function canGoToDirection(user, direction, cd) {
		if (cd.running) return false;
		if (user.life <= 0) return false;
		directionsInMyRoom = roomsConnections[user.room];
		if (!myRoom) myRoom = user.room;
		let targetRoom = directionsInMyRoom?.[direction];
		if (battleRoom == targetRoom) return false;
		return targetRoom;
	}

	function goToDirection(direction) {
		let targetRoom = directionsInMyRoom[direction];
		if (!targetRoom) return;
		if (targetRoom == 19 && !$user.hasKey) {
			console.log("you don't have the key");
			return;
		}
		startTimer();
		myRoom = targetRoom;
		socket.emit('askToChangeRoom', targetRoom, async (response) => {
			user.set(response.user);
			myRoom = $user.room;
			directionsInMyRoom = roomsConnections[$user.room];
		});
		if ($user.hero == 'Golem') {
			socket.emit('dropARock');
		}
	}

	$: {
		if ($moveCd.elapsedTime > moveSpeed) {
			stopTimer();
		}
	}

	const closeRoomForBattle = (data) => {
		battleRoom = data;
	};
	const openRoomAfterBattle = (data) => {
		battleRoom = null;
	};

	onMount(() => {
		socket.on('battle', closeRoomForBattle);
		socket.on('endedBattle', openRoomAfterBattle);
		return () => {
			socket.off('battle', closeRoomForBattle);
			socket.off('endedBattle', openRoomAfterBattle);
		};
	});
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
	</div>
{/if}
<div class="--mooving">
	{#if !$moveCd.running}
		<h1
			class="h2 directionSalle"
			in:blur={{ y: 50, duration: moveSpeed / 2 }}
			out:blur={{ duration: 0 }}
		>
			Salle {$user.room}
		</h1>
	{:else}
		<h1
			class="h2 directionSalle"
			in:blur={{ y: 50, duration: moveSpeed / 2 }}
			out:blur={{ duration: 0 }}
		>
			Déplacement..
		</h1>
	{/if}
</div>

<style>
	.--mooving {
		display: flex;
		justify-content: center;
	}
</style>
