<script>
	// @ts-nocheck
	import BoardGameSVG from '$lib/components/BoardGameSVG.svelte';
	import { onMount } from 'svelte';
	import { socket } from '$lib/js/socketConnection.js';
	import { sleep } from '$lib/js/sleep';

	export let activeUsers = activeUsers;

	onMount(async () => {
		socket.on('updateUsers', (data) => {
			activeUsers = data;
			positionOfPlayers();
		});

		socket.on('movePlayer', (userId) => {
			socket.on('updateUsers', (data) => {
				activeUsers = data;
			});
			playerMove(userId);
		});

		socket.on('takeItemInRoom', (room, boss) => {
			if (boss) {
				animInRoom(room,'rock')
				return;
			}
			animInRoom(room,'inventory' )
		})

		socket.on('battle', (data) =>{
			let room = "room" + data.room
			console.log(room)
			animBattle('battle')
		})

		socket.on('usedPower', (id,hero) =>{
			console.log(id, hero)
			let img = 'power'
			if(hero == 'Chevalier') img = 'potionSpeed'
			if(hero == 'Druide') img = 'life'
			if(hero == 'Magicien') img = 'diceRoll'
			if(hero == 'Serpent') img = 'diceRoll'
			if(hero == 'Rodeur') img = 'power'
			if(hero == 'Necromancien') img = 'angel'
			animOnPlayer(id, img)
		})

		socket.on('returnAtSpawn', (winner) => {
			console.log(winner)
			animBattleEnded(winner)
		})
	});

	let positionOfPlayers = () => {
		for (let player of activeUsers) {
			let target = 'room' + player.room + '_' + player.player;

			let myPlayerDiv = document.querySelector('.' + player.player);
			let targetDiv = document.querySelector('#' + target);

			let targetBoundingClientRect = targetDiv.getBoundingClientRect();
			let TargetX = targetBoundingClientRect.x;
			let TargetY = targetBoundingClientRect.y;

			myPlayerDiv.style.top = TargetY + 'px';
			myPlayerDiv.style.left = TargetX + 'px';
		}
	};

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

	let animInRoom = async (room, item) => {
		let itemImg = "/assets/img/" + item + ".png"
		let target = document.getElementById(room)
		target.style.position = 'relative'

		let itemDiv = document.body.appendChild(document.createElement('div'))
		itemDiv.classList.add("anim","animInRoom", 'isActive')
		let itemDivImg = itemDiv.appendChild(document.createElement('img'))
		itemDivImg.classList.add("fluidimg")
		itemDivImg.setAttribute("src", itemImg)

		let targetBoundingClientRect = target.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x + targetBoundingClientRect.width/2;
		let TargetY = targetBoundingClientRect.y + targetBoundingClientRect.height/2;

		itemDiv.style.top = TargetY + 'px';
		itemDiv.style.left = TargetX + 'px';

		await sleep(5)
		itemDiv.remove()
	}

	let animOnPlayer = async (id, item) => {
		let itemImg = "/assets/img/" + item + ".png"
		let target = document.getElementById(id)
		// target.style.position = 'relative'

		let itemDiv = document.body.appendChild(document.createElement('div'))
		itemDiv.classList.add("anim","animOnPlayer", 'isActive')
		let itemDivImg = itemDiv.appendChild(document.createElement('img'))
		itemDivImg.classList.add("fluidimg")
		itemDivImg.setAttribute("src", itemImg)

		let targetBoundingClientRect = target.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x + targetBoundingClientRect.width/2;
		let TargetY = targetBoundingClientRect.y + targetBoundingClientRect.height/2;

		itemDiv.style.top = TargetY + 'px';
		itemDiv.style.left = TargetX + 'px';

		await sleep(5)
		itemDiv.remove()
	}

	let animBattle = async (item) => {
		console.log('animBattle')
		let itemImg = "/assets/img/battle.png"
		let target = document.querySelector(".boardGame")
		target.style.position = 'relative'
		console.log(target)

		let itemDiv = document.body.appendChild(document.createElement('div'))
		itemDiv.classList.add("anim","animBattle", 'isActive')
		let itemDivImg1 = itemDiv.appendChild(document.createElement('img'))
		itemDivImg1.classList.add("fluidimg", "sword", '--1')
		itemDivImg1.setAttribute("src", itemImg)

		let itemDivImg2 = itemDiv.appendChild(document.createElement('img'))
		itemDivImg2.classList.add("fluidimg", "sword", '--2')
		itemDivImg2.setAttribute("src", itemImg)

		let targetBoundingClientRect = target.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x + targetBoundingClientRect.width/2;
		let TargetY = targetBoundingClientRect.y + targetBoundingClientRect.height/2;

		itemDiv.style.top = TargetY + 'px';
		itemDiv.style.left = TargetX + 'px';

		await sleep(5)
		itemDiv.remove()
	}

	let animBattleEnded = async (winner) => {
		let itemImg = "/assets/img/"+ winner.heroImg
		let crownImg = "/assets/img/crown.png"
		let target = document.querySelector(".boardGame")
		target.style.position = 'relative'
		console.log(target)

		let itemDiv = document.body.appendChild(document.createElement('div'))
		itemDiv.classList.add("anim","animBattleEnded", 'isActive')
		let itemDivCrownImg = itemDiv.appendChild(document.createElement('img'))
		itemDivCrownImg.classList.add("fluidimg", "--crown")
		itemDivCrownImg.setAttribute("src", crownImg)
		let itemDivImg = itemDiv.appendChild(document.createElement('img'))
		itemDivImg.classList.add("fluidimg", "--winner")
		itemDivImg.setAttribute("src", itemImg)

		let targetBoundingClientRect = target.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x + targetBoundingClientRect.width/2;
		let TargetY = targetBoundingClientRect.y + targetBoundingClientRect.height/2;

		itemDiv.style.top = TargetY + 'px';
		itemDiv.style.left = TargetX + 'px';

		await sleep(5)
		itemDiv.remove()
	}


</script>

<div class="boardGame">
	<ul class="usersPawnList">
		{#each activeUsers as user}
			<li class="userPawn {user.player}" id={user.id}>
				<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
			</li>
		{/each}
	</ul>
	<img class="fluidimg boardGameImg" src="/assets/img/boardgame.png" alt="boardgame" />
	<BoardGameSVG />
</div>

<style>
	:global(svg) {
		max-width: 100%;
		height: auto;
		display: block;
		color: rgba(255, 255, 255, 0);
	}
</style>
