<script>
	import { sleep } from '$lib';

	export let user;

	/*
	for (let player of activeUsers) {
		let target = 'room' + player.room + '_' + player.player;

		let myPlayerDiv = document.querySelector('.' + player.player);
		let targetDiv = document.querySelector('#' + target);

		let targetBoundingClientRect = targetDiv.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x;
		let TargetY = targetBoundingClientRect.y;

		myPlayerDiv.style.top = TargetY + 'px';
		myPlayerDiv.style.left = TargetX + 'px';
	}*/

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

<li class="userPawn {user.player}" id={user.id}>
	<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
</li>