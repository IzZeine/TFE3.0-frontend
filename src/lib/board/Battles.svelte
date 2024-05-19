<script>
	import { socket } from '$lib/js/socketConnection.js';
	import throttle from 'lodash/throttle.js';
	import { onMount } from 'svelte';

	export let battles;

	const animBattle = (item) => {};
	const throttledAnimBattle = throttle(animBattle, 5000);

	const animBattleEnded = () => {};
	const throttledAnimBattleEnd = throttle(animBattleEnded, 5000);

	const onBattle = (data) => {
		let room = 'room' + data.room;
		console.log(room);
		throttledAnimBattle('battle');
	};
	const onBattleEnd = (winner) => {
		console.log(winner);
		throttledAnimBattleEnd(winner);
	};
	onMount(() => {
		socket.on('battle', onBattle);
		socket.on('returnAtSpawn', onBattleEnd);
		return () => {
			socket.off('battle', onBattle);
			socket.off('returnAtSpawn', onBattleEnd);
		};
	});

	/*
let animBattle = async (item) => {
	console.log('animBattle');
	let itemImg = '/assets/img/battle.png';
	let target = document.querySelector('.boardGame');
	target.style.position = 'relative';
	console.log(target);

	let itemDiv = document.body.appendChild(document.createElement('div'));
	itemDiv.classList.add('anim', 'animBattle', 'isActive');
	let itemDivImg1 = itemDiv.appendChild(document.createElement('img'));
	itemDivImg1.classList.add('fluidimg', 'sword', '--1');
	itemDivImg1.setAttribute('src', itemImg);

	let itemDivImg2 = itemDiv.appendChild(document.createElement('img'));
	itemDivImg2.classList.add('fluidimg', 'sword', '--2');
	itemDivImg2.setAttribute('src', itemImg);

	let targetBoundingClientRect = target.getBoundingClientRect();
	let TargetX = targetBoundingClientRect.x + targetBoundingClientRect.width / 2;
	let TargetY = targetBoundingClientRect.y + targetBoundingClientRect.height / 2;

	itemDiv.style.top = TargetY + 'px';
	itemDiv.style.left = TargetX + 'px';

	await sleep(5);
	itemDiv.remove();
};

let animBattleEnded = async (winner) => {
	let itemImg = '/assets/img/' + winner.heroImg;
	let crownImg = '/assets/img/crown.png';
	let target = document.querySelector('.boardGame');
	target.style.position = 'relative';
	console.log(target);

	let itemDiv = document.body.appendChild(document.createElement('div'));
	itemDiv.classList.add('anim', 'animBattleEnded', 'isActive');
	let itemDivCrownImg = itemDiv.appendChild(document.createElement('img'));
	itemDivCrownImg.classList.add('fluidimg', '--crown');
	itemDivCrownImg.setAttribute('src', crownImg);
	let itemDivImg = itemDiv.appendChild(document.createElement('img'));
	itemDivImg.classList.add('fluidimg', '--winner');
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
