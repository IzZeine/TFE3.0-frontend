<script>
	// @ts-nocheck
	import { clearStorage, getItems, getRoomsConnections, getUser } from '$lib';
	import { onMount } from 'svelte';
	import { socket } from '$lib/js/socketConnection.js';

	// export let data;
	// const socket = data.socket;
	// console.log(socket)

	export let user = user;
	let color = user.color
	let gameID = '';
	let sessionID = '';

	let roomsConnections, directions;
	let allRooms;
	let myRoom = ''; // initial ''
	let myInventory = [];
	let countOfItems;
	let itemInRoom = ''; // initial ''
	let dice1 = 1,
		dice2 = 1;
	let battle;

	onMount(async () => {
		sessionID = sessionStorage.getItem('sessionID');
		gameID = sessionStorage.getItem('gameID');

		popUp('Vous êtes connecté');
		if (gameID) {
				// trouver l'utilisateur
				user = await getUser(socket);

				if (!user) {
					clearStorage();
					window.location.href = '/';
				}
				socket.emit('joinGame', gameID);
				socket.emit('getRooms', gameID);
			}

		updateInventory(user);
		displayArrowsDirections();

		socket.on('youAskedRooms', (rooms) => {
			if(!user) return;
			allRooms = rooms;
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			itemInRoom = JSON.parse(itemInRoom);
		});

		socket.on('movePlayer', async (userID) => {
			displayArrowsDirections();
			user = await getUser(socket);
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			itemInRoom = JSON.parse(itemInRoom); // convert string to json
		});

		socket.on('updateUser', (user) => {
			updateInventory(user);
		});

		socket.on('battle', async (data) => {
			console.log(data)
			battle = data
			console.log(battle)
			openDialog('dialog_battle')

			user = await getUser(socket);
			myRoom = allRooms[user.room];

			if (user.team == 'hero' && myRoom.item != 'null' && myRoom.item != null) {
				let getItemBtn = document.querySelector('.getItemBtn');
				getItemBtn.setAttribute('disabled', true);
			}

			disabledArrows();

			if (user.room != data.room) {
				popUp('Un combat est en cours');
				return;
			}

			popUp('Vous entrez dans un combat!');
			let bossLife = data.boss.def;
			let heroesAtk = 0;
			for (let hero of data.heroes) {
				heroesAtk += hero.atk;
			}

			await sleep(2);

			let winner;

			if (bossLife > heroesAtk)
				popUp('Le boss remporte! <br> -1 au hero le plus faible'), (winner = data.boss);
			if (bossLife == heroesAtk)
				popUp('Match nul.. <br> tout le monde à son spawn'), (winner = data.boss.room);
			if (bossLife < heroesAtk)
				popUp('Les heroes remportent <br> fin de la partie!'), (winner = 'endGame');
			if (user.id == data.boss.id) socket.emit('battleEnded', winner);

			closeDialog('dialog_battle')

		});

			socket.on('returnAtSpawn', async () => {
				user = await getUser(socket);
				displayArrowsDirections();

				if (user.team == 'hero' && myRoom.item != 'null' && myRoom.item != null) {
					let getItemBtn = document.querySelector('.getItemBtn');
					getItemBtn.removeAttribute('disabled');
				}
			});
	});

	let popUp = async (message) => {
		let popupDiv = document.body.appendChild(document.createElement('div'));
		popupDiv.classList.add('popup');
		let popupTxt = popupDiv.appendChild(document.createElement('p'));
		popupTxt.classList.add('popup-message');

		await sleep(0.1);

		popupDiv.classList.add('is-active');
		popupTxt.innerHTML = message;

		await sleep(2);
		popupDiv.classList.remove('is-active');
		await sleep(1);
		popupTxt.innerHTML = '';
		popupDiv.remove();
	};

	let updateInventory = (user) => {
		let inventory = user.inventory;
		if (!inventory) return;
		myInventory = [];
		inventory = inventory.split('/');
		for (let item of inventory) {
			item = JSON.parse(item);
			myInventory.push(item);
		}

		countOfItems = compterObjetsIdentiques(myInventory);
		countOfItems = Object.entries(countOfItems).map(([cle, valeur]) => ({ [cle]: valeur }));
	};

	let compterObjetsIdentiques = (array) => {
		const compteur = {}; // Objet pour stocker les occurrences des objets
		// Parcourir le tableau d'objets
		array.forEach((item) => {
			// Convertir l'objet en une chaîne JSON pour le représenter comme une clé
			const cle = item.nameId;
			// Incrémenter le compteur pour cette clé
			compteur[cle] = (compteur[cle] || 0) + 1;
		});
		return compteur;
	};

	let sleep = (sec) => {
		return new Promise((resolve) => setTimeout(resolve, sec * 1000));
	};

	let disabledArrows = () => {
		let topArrow = document.querySelector('#top');
		let leftArrow = document.querySelector('#left');
		let rightArrow = document.querySelector('#right');
		let botArrow = document.querySelector('#bot');
		let arrows = [topArrow, leftArrow, rightArrow, botArrow];
		for (let arrow of arrows) {
			arrow.setAttribute('disabled', true);
		}
	};

	let displayArrowsDirections = async () => {
		if (user.life <= 0) return;
		if(!myRoom) myRoom = user.room
		roomsConnections = await getRoomsConnections();
		roomsConnections = Object.values(roomsConnections); // change Json to array

		directions = roomsConnections[user.room];
		let diectionsKeys = Object.keys(directions);

		disabledArrows();

		await sleep(0.1);
		for (let direction of diectionsKeys) {
			if (directions[direction] == 'null') continue;
			let arrow = document.querySelector('#' + direction);
			if (directions[direction] != 'null') arrow.removeAttribute('disabled');
		}
	};

	let askToChangeRoom = () => {
		let direction = event.target.id;
		let targetRoom = directions[direction];
		if (targetRoom == 'null') return;
		if (targetRoom == 19) {
			let hasKey = myInventory.some((item) => item.nameId === 'key');
			if (!hasKey) {
				popUp("You don't have the key");
				return;
			}
		}
		socket.emit('askToChangeRoom', targetRoom);
		dice1 = 1;
		dice2 = 1;
	};

	let tryToGetItemInRoom = async () => {
		let getItemBtn = document.querySelector('.getItemBtn');
		let condition = itemInRoom.condition;
		let pointsDices = rollDice();
		if (pointsDices < condition) {
			getItemBtn.setAttribute('disabled', true);
			await sleep(1);
			getItemBtn.removeAttribute('disabled');
			return;
		}
		disabledArrows();
		getItemBtn.setAttribute('disabled', true);
		await sleep(1);
		getItemBtn.removeAttribute('disabled');

		let message =
			'Vous avez gagné : \n' +
			"<div class='itemInPopUpDiv'>" +
			"<img class='fluidimg itemInPopUp' src='/assets/img/" +
			itemInRoom.nameId +
			".PNG'	alt={itemInRoom.nameId}/>" +
			itemInRoom.name +
			'</div>';
		popUp(message);
		displayArrowsDirections();
		socket.emit('getItemInRoom', myRoom);
	};

	let rollDice = () => {
		dice1 = Math.floor(Math.random() * 6) + 1;
		dice2 = Math.floor(Math.random() * 6) + 1;
		return dice1 + dice2;
	};

	let openDialog = (target) => {
		let dialogTarget = document.querySelector('.'+target)
		dialogTarget.show()
	}

	let closeDialog = (target) => {
		let dialogTarget = document.querySelector('.'+target)
		dialogTarget.close()
	}

	// @TODO : si le boss est mort ou que l'ensemble de items restants ne suffisent pas pour battre le boss, le jeu se termine
</script>

{#if user.life == 0}
	<p>you are dead..</p>
{/if}

<div class="maxContent">
	<div class="mapUserContainer">
		{#if myRoom}
			<div class="headerMap">
				<div class="cardHero">
					<div class="lifes">
						<ul class="cardHero_stats-life">
							{#each { length: user.life } as item, index}
								{@const numberOfLife = user.life}
								{@const isLast = index === user.life - 1}
								<li>
									<img class="fluidimg" src="/assets/img/life.svg" alt="life" />
								</li>
								{#if isLast}
									{#each { length: 3 - numberOfLife } as item, index}
										<li>
											<img class="fluidimg" src="/assets/img/noLife.svg" alt="life" />
										</li>
									{/each}
								{/if}
							{/each}
						</ul>
					</div>
					<img class="fluidimg cardHero_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
					<div class="cardHero_stats">						
						<div class="cardHero_stats-atk-def">
							<div class="cardHero_stats-atk-def_atk">
								<p>ATK: <span>{user.atk}</span></p>
							</div>
							<div class="cardHero_stats-atk-def_def">
								<p>DEF: <span>{user.def}</span></p>
							</div>
						</div>
					</div>
				</div>
				<p class="cardHero_hero" style='--color:{color};'>{user.hero}</p>
			</div>
			<div class="sideBarUser">
				<div class="directionsArrows">
					<button
						class="directionArrow directionArrow_top"
						id="top"
						disabled
						on:click={askToChangeRoom}
					>
						<img class="directionArrow_img" src="/assets/img/top.svg" alt="top" />
					</button>
					<button
						class="directionArrow directionArrow_right"
						id="right"
						disabled
						on:click={askToChangeRoom}
					>
						<img class="directionArrow_img" src="/assets/img/right.svg" alt="top" />
					</button>
					<button
						class="directionArrow directionArrow_bot"
						id="bot"
						disabled
						on:click={askToChangeRoom}
					>
						<img class="directionArrow_img" src="/assets/img/bot.svg" alt="top" />
					</button>
					<button
						class="directionArrow directionArrow_left"
						id="left"
						disabled
						on:click={askToChangeRoom}
					>
						<img class="directionArrow_img" src="/assets/img/left.svg" alt="top" />
					</button>
				</div>
				<h1 class="h2 directionSalle">Salle {user.room}</h1>
				<div class="actionButtons">
					{#if myRoom && user.team == 'hero'}
						<button class="actionButton" on:click={() => openDialog("dialog_inventory")}>
							<img class="fluidimg" src="/assets/img/inventory.png" alt="inventory">
						</button>
					{/if}
						<button class="actionButton" on:click={() => openDialog("dialog_power")}>
							<img class="fluidimg" src="/assets/img/power.png" alt="Ax" />
						</button>
					{#if myRoom && user.team == 'hero'}
						<button class="getItemBtn actionButton" on:click={() => openDialog("dialog_item")}>
							<img class="fluidimg" src="/assets/img/ax.PNG" alt="Ax" />
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<dialog class="dialog dialog_item">
		<div class="headerDialog">
			<div class="dices">
				<div class="dices">
					<img class="fluidimg dice" src="/assets/img/dice{dice1}.png" alt="dice1" />
					<img class="fluidimg dice" src="/assets/img/dice{dice2}.png" alt="dice2" />
				</div>
			</div>
		</div>
		<div class="contentDialog">
			<div class="itemInRoom">
				{#if itemInRoom}
					<img
						class="fluidimg itemInRoom"
						src="/assets/img/{itemInRoom.nameId}.PNG"
						alt={itemInRoom.nameId}
					/>
					<div class="itemInRoom_stats">
						<p class="h1">{itemInRoom.name}</p>
						<p>
							Bonus : <span style="text-transform: uppercase;">{itemInRoom.type}</span> +{itemInRoom.bonus} 
						</p>
						<p>Condition : faire un {itemInRoom.condition}+</p>
					</div>
				{:else}
					<p>Il n'y a pas d'item dans cette salle.</p>
					<p>Continuez votre chemin!</p>
				{/if}
			</div>
		</div>
		<div class="footerDialog">
			<div class="actionButtons">
				<button class="actionButton" on:click={() => closeDialog("dialog_item")}>
					<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
				</button>
				<button class="getItemBtn actionButton" on:click={tryToGetItemInRoom}>
					<img class="fluidimg" src="/assets/img/diceRoll.png" alt="Ax" />
				</button>
			</div>
		</div>
	</dialog>

	<dialog class="dialog dialog_inventory">
		<div class="contentDialog">
			{#if countOfItems}
				<ul class="inventory">
					{#each countOfItems as item, index}
						<li class="inventory_item">
							<img
								class="fluidimg"
								src="/assets/img/{Object.keys(countOfItems[index])[0]}.PNG"
								alt={Object.keys(countOfItems[index])[0]}
							/>
							<p class="numOfItem">
								<span>{countOfItems[index][Object.keys(countOfItems[index])[0]]}</span>
							</p>
						</li>
					{/each}
				</ul>
			{/if}	
		</div>
		<div class="footerDialog">
			<div class="actionButtons">
				<button class="actionButton" on:click={() => closeDialog("dialog_inventory")}>
					<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
				</button>
			</div>
		</div>
	</dialog>

	<dialog class="dialog dialog_power">
		<div class="headerDialog">
		</div>
		<div class="contentDialog">
			<p>{user.ability}</p>
			<button class="btnPrimary">Utiliser</button>
		</div>
		<div class="footerDialog">
			<div class="actionButtons">
				<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
					<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
				</button>
		</div>
	</dialog>

	<dialog class="dialog dialog_battle">
		{#if battle}
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/{battle.boss.heroImg}" alt="boss">
				<p class="h1 dialog_battle-boss" style='--color:{color};'>{battle.boss.hero}</p>
				<div class="heroes">
					{#each battle.heroes as hero}
						<img class="fluidimg hero" src="/assets/img/{hero.heroImg}" alt="hero">
					{/each}
				</div>
			</div>
			<div class="contentDialog">
				<div class="right">
					<p class="h2">Le méchant</p>
					<p>DEF: {battle.boss.def}</p>
				</div>
				<div class="left">
					<p class="h2">Les gentils</p>
					<p>ATK: {battle.boss.def}</p>
				</div>
			</div>
			<div class="footerDialog">
				<p>Vous combattez !</p>
			</div>
		{/if}
	</dialog>
</div>


<style>
	.cardHero_hero{
		color: var(--color);
		position: relative;
		width: fit-content;
		margin: 0 auto;
	}
	.cardHero_hero::after,
	.cardHero_hero::before {
		content: '';
		position: absolute;
		top: 50%;
		flex-direction: row;
		background-color: var(--color);
		height: 2px;
		width: 30px;
	}
	.cardHero_hero::before {
		transform: translate(-100%, 0);
		left: -12px;
	}
	.cardHero_hero::after {
		transform: translate(100%, 0);
		right: -12px;
	}
	.dialog_battle-boss{
		color: var(--color);
	}
</style>
