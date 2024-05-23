<script>
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import throttle from 'lodash/throttle.js';
	import { positions } from './BoardGameSVG.svelte';

	export let user;

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
		if (id === user.id) {
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
		console.log(element);

		socket.on('usedPower', onUsedPower);
		return () => {
			socket.off('usedPower', onUsedPower);
		};
	});

	let position = { x: 0, y: 0 };
	$: {
		const roomPosition = $positions?.find((roomPosition) => {
			return roomPosition.id === `room${user.room}`;
		});
		if (position) {
			position = roomPosition;
		}
	}

	/*
	let playerMove = (userId) => {
		let userMove = activeUsers.find((id) => id.id === userId);
		let target = 'room' + userMove.room + '_' + userMove.player;

		let myPlayerDiv = document.querySelector('.' + userMove.player);
		let targetDiv = document.querySelector('#' + target);

		let targetBoundingClientRect = targetDiv.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x;
		let TargetY = targetBoundingClientRect.y;

		myPlayerDiv.style.top = TargetY + 'px';
		myPlayerDiv.style.left = TargetX + 'px';
	};
	*/
	/*
	let animOnPlayer = async (id, item) => {
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

		await sleep(5);
		itemDiv.remove();
	};
	*/
</script>

<li
	bind:this={element}
	class="userPawn"
	id={user.id}
	style:left={`${position?.x}px`}
	style:top={`${position?.y}px`}
>
	<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
</li>

<style>
	.userPawn {
		transform: translate(-50%, -50%);
	}
</style>
