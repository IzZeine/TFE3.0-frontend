<script>
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import throttle from 'lodash/throttle.js';

	export let player;

	let element;

	const animOnPlayer = async (id, item) => {
		/*
		let itemImg = '/assets/img/' + item + '.png';
		let target = document.getElementById(id);
		// target.style.position = 'relative'

		let itemDiv = document.body.appendChild(document.createElement('div'));
		itemDiv.classList.add('anim', 'animOnPlayer', 'isActive');
		let itemDivImg = itemDiv.appendChild(document.createElement('img'));
		itemDivImg.classList.add('fluidimg');
		itemDivImg.setAttribute('src', itemImg);

		let targetBoundingClientRect = target.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x + targetBoundingClientRect.width / 2;
		let TargetY = targetBoundingClientRect.y + targetBoundingClientRect.height / 2;

		itemDiv.style.top = TargetY + 'px';
		itemDiv.style.left = TargetX + 'px';

		itemDiv.remove();
		*/
	};

	const throttleAnimPlayer = throttle(animOnPlayer, 5000);

	const onUsedPower = (id, hero) => {
		if (id === player.id) {
			let img = 'power';
			if (hero === 'Chevalier') img = 'potionSpeed';
			if (hero === 'Druide') img = 'life';
			if (hero === 'Magicien') img = 'diceRoll';
			if (hero === 'Serpent') img = 'diceRoll';
			if (hero === 'Rodeur') img = 'power';
			if (hero === 'Necromancien') img = 'angel';
			throttleAnimPlayer(id, img);
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
</div>

<style lang="scss">
	.userPawn {
		img {
			border-radius: 100%;
			filter: drop-shadow(0 0 5px var(--primary));
		}
	}
</style>
