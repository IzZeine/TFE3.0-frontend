<script>
	import { socket } from '$lib/api/socketConnection';
	import { onMount } from 'svelte';

	let turn;
	let animTurn = '';
	const changeTurn = (data) => {
		navigator.vibrate(200);
		console.log(data);
		turn = data;
		animTurn = 'isActive';
		setTimeout(function () {
			animTurn = '';
		}, 2500);
	};
	onMount(() => {
		socket.on('changeTurn', changeTurn);
		return () => {
			socket.off('changeTurn', changeTurn);
		};
	});
</script>

<div class="turnsInfos {animTurn}">
	<p class="h1">TOUR : {turn}</p>
</div>

<style lang="scss">
	.turnsInfos {
		display: none;
		position: absolute;
		text-wrap: nowrap;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		.h1 {
			opacity: 0;
		}
	}
	.turnsInfos.isActive {
		display: block;
		.h1 {
			animation: animTurn 2s;
		}
	}

	@keyframes animTurn {
		0% {
			opacity: 0;
			transform: translate(50%, 0) skew(-20deg, 0);
		}
		25% {
			opacity: 1;
			transform: translate(0, 0%) skew(0);
		}
		75% {
			opacity: 1;
			transform: translate(0%, 0%) skew(0);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, 0%) skew(-20deg, 0);
		}
	}
</style>
