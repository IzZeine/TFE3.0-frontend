<script>
	import { applyAction } from '$app/forms';
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';

	export let player;

	let element;
	let ownPower = 'power';
	let otherPower = 'angel';
	let activeAnimation = '';

	const onUsedPower = (data) => {
		const { user, target } = data;
		const powerImg = document.querySelector('.powerImg');
		if (player.id == user.id) {
			activeAnimation = 'isActive';
			if (user.hero === 'Druide') ownPower = 'life';
			if (user.hero === 'Necromancien') ownPower = 'angel';
			if (user.hero === 'Magicien') ownPower = 'diceRoll';
			if (user.hero === 'Chevalier') ownPower = 'potionSpeed';
			if (user.hero === 'Serpent') ownPower = 'diceRoll';
			if (user.hero === 'Rodeur') ownPower = 'power';

			powerImg.addEventListener('animationend', () => {
				activeAnimation = '';
				powerImg.classList.remove('isActive'); // Supprime la classe d'animation
			});
		}
	};

	onMount(() => {
		socket.on('usedPower', onUsedPower);
		return () => {
			socket.off('usedPower', onUsedPower);
		};
	});
</script>

<div bind:this={element} class="userPawn" id={player.id}>
	<img
		class="fluidimg userPawn_img"
		src="/assets/img/{player.heroImg}"
		alt="pawn icon"
		style:background-color={player.color}
	/>
	<img class="powerImg {activeAnimation}" src="/assets/img/{ownPower}.png" alt="power" />
	<!-- <img class="powerImg" src="/assets/img/{otherPower}.png" alt="power" /> -->
</div>

<style lang="scss">
	.userPawn {
		position: relative;
		.userPawn_img {
			border-radius: 100%;
			filter: drop-shadow(0 0 5px var(--primary));
		}
	}

	.powerImg {
		opacity: 0;
		max-width: 80%;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, 0);
	}

	.powerImg.isActive {
		animation: animUp 2s;
	}

	@keyframes animUp {
		0% {
			opacity: 0;
			transform: translate(-50%, 0) translateY(0px);
		}
		75% {
			opacity: 1;
			transform: translate(-50%, 0) translateY(-15px);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, 0) translateY(-15px);
		}
	}
</style>
