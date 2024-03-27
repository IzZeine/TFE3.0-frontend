<script>
	// @ts-nocheck
	import { clearStorage, getItems, getRoomsConnections, getUser } from '$lib';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	const socket = io('http://localhost:3000');

	export let user = user;
	let gameID = '';
	let sessionID = '';

	//@TODO : quand il veut changer de room il fait un request au serveur et le serveur envoie les infos au gameboard

	let roomsConnections, directions;
	let allRooms;
	let myRoom = '';
	let myInventory = [];
	let countOfItems;
	let itemInRoom;
	let dice1, dice2;

	onMount(async () => {
		sessionID = sessionStorage.getItem('sessionID');
		gameID = sessionStorage.getItem('gameID');

		socket.on('connect', async () => {
			popUp("Connected to the server")
			if (gameID) {
				// trouver l'utilisateur
				user = await getUser(socket);

				if (!user) {
					clearStorage();
					window.location.href = '/';
				}
				socket.emit('joinGame', gameID);
				socket.emit('getRooms', user.gameId);

				
			}
		});

		updateInventory(user);
		displayArrowsDirections();

		socket.on('youAskedRooms', (rooms) => {
			allRooms = rooms;
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			itemInRoom = JSON.parse(itemInRoom);
		});

		socket.on('movePlayer', async (userID) => {
			displayArrowsDirections();
			console.log("2")
			user = await getUser(socket);
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			itemInRoom = JSON.parse(itemInRoom); // convert string to json
		});

		socket.on('updateUser', (user) => {
			updateInventory(user);
		});

		socket.on('battle', async (data) => {
			let getItemBtn = document.querySelector(".getItemBtn")
			getItemBtn.setAttribute("disabled", true)
			user = await getUser(socket);
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			itemInRoom = JSON.parse(itemInRoom); // convert string to json
			disabledArrows()
			console.log("1")
			if (user.room != data.room) {
				popUp("Un combat est en cours")
				return;
			}
			console.log(data)
			popUp("Vous entrez dans un combat!")
			let bossLife = data.boss.def
			let heroesAtk = 0;
			for(let hero of data.heroes){
				heroesAtk += hero.atk
			}
			console.log(bossLife," / ",heroesAtk)
			
			await sleep(2)

			let winner;

			if(bossLife > heroesAtk) popUp("Le boss remporte! <br> -1 au hero le plus faible"), winner = data.boss;
			if(bossLife == heroesAtk) popUp("Match nul.. <br> tout le monde à son spawn");
			if(bossLife < heroesAtk) popUp("Les heroes remportent <br> fin de la partie!"), winner = "endGame";

			console.log(winner)
			if(user.id == data.boss.id) socket.emit("battleEnded", winner )
		});

		socket.on("returnAtSpawn", async()=>{
			user = await getUser(socket);
			displayArrowsDirections()
			let getItemBtn = document.querySelector(".getItemBtn")

			getItemBtn.removeAttribute("disabled")
		})
	});

	let popUp = async (message) =>{
		let popupDiv = document.body.appendChild(document.createElement("div"));
		popupDiv.classList.add("popup")
		let popupTxt = popupDiv.appendChild(document.createElement("p"));
		popupTxt.classList.add("popup-message")

		await sleep(0.1)

		popupDiv.classList.add("is-active")
		popupTxt.innerHTML = message

		await sleep(3)
		popupDiv.classList.remove("is-active")
		await sleep(1)
		popupTxt.innerHTML = ""
		popupDiv.remove()
	}

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
		if(user.life <= 0) return;
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
		socket.emit('askToChangeRoom', targetRoom);
		dice1 = null;
		dice2 = null;
	};

	let tryToGetItemInRoom = async () => {
		let condition = itemInRoom.condition;
		let pointsDices = rollDice();
		if (pointsDices < condition) {
			popUp("raté..")
			return;
		} 
		disabledArrows();
		await sleep(1);
		let message = "Vous avez gagné : \n" + "<img class='fluidimg'	src='/src/assets/img/" + itemInRoom.nameId + ".PNG'	alt={itemInRoom.nameId}/>" + itemInRoom.name;
		popUp(message)
		displayArrowsDirections();
		socket.emit('getItemInRoom', myRoom);
	};

	let rollDice = () => {
		dice1 = Math.floor(Math.random() * 6) + 1;
		dice2 = Math.floor(Math.random() * 6) + 1;
		return dice1 + dice2;
	};

	let displayCardHero = () => {
		const display = document.querySelector('.cardHero');
		display.classList.add('is-active');
	};

	let hideCardHero = () => {
		const display = document.querySelector('.cardHero');
		display.classList.remove('is-active');
	};

	// @TODO : quand le combat se lance :
	// @TODO : prendre la vie du boss et le total des atk des users
	// @TODO : si life > atk
	// @TODO : boss gagne, le user le plus faible perd une vie
	// @TODO : si le user n'a plus de vie : mort : spectateur (tous ces items partent avec lui)
	// @TODO : si life = atk
	// @TODO : tout le monde repart
	// @TODO : else
	// @TODO : le boss perd de la vie
	// @TODO : si le boss n'a plus de vie : mort : fin de game
	// @TODO : après chaque combat, tous le monde retourne à son spawn

	// @TODO : si le boss est mort ou que l'ensemble de items restants ne suffisent pas pour battre le boss, le jeu se termine
</script>

<ul style="display: flex; gap:12px">
	{#each {length : user.life} as item, index}
		<li>X</li>
	{/each}
</ul>

<p>{user.hero}</p>
<div class="container mapUserContainer">
	<h1 class="h1">Your room : {user.room}</h1>
	<div class="directionsArrows">
		<button class="directionArrow directionArrow_top" id="top" disabled on:click={askToChangeRoom}>
			<img class="directionArrow_img" src="/src/assets/img/top.svg" alt="top" />
		</button>
		<button
			class="directionArrow directionArrow_right"
			id="right"
			disabled
			on:click={askToChangeRoom}
		>
			<img class="directionArrow_img" src="/src/assets/img/right.svg" alt="top" />
		</button>
		<button class="directionArrow directionArrow_bot" id="bot" disabled on:click={askToChangeRoom}>
			<img class="directionArrow_img" src="/src/assets/img/bot.svg" alt="top" />
		</button>
		<button
			class="directionArrow directionArrow_left"
			id="left"
			disabled
			on:click={askToChangeRoom}
		>
			<img class="directionArrow_img" src="/src/assets/img/left.svg" alt="top" />
		</button>
	</div>
	{#if myRoom}
		<div class="itemInRoom">
			{#if itemInRoom}
				<img
					class="fluidimg"
					src="/src/assets/img/{itemInRoom.nameId}.PNG"
					alt={itemInRoom.nameId}
				/>
				<p>{itemInRoom.name}</p>
				<p>{itemInRoom.rarity}</p>
				<p>{itemInRoom.condition}</p>
				{#if dice1 && dice2}
					<p>
						<span>{dice1}</span> ; <span>{dice2}</span> <span> => </span>
						<span>{dice1 + dice2}</span>
					</p>
				{/if}
				<button class="getItemBtn" on:click={tryToGetItemInRoom}>Attraper</button>
			{:else}
				<p>no item here</p>
			{/if}
		</div>
	{/if}
</div>
<div class="sideBarUser">
	<button class="showCardHero" on:click={displayCardHero}>
		<img style="width: 60px; height: auto;" src="/src/assets/img/inventory.PNG" alt="inventory" />
	</button>
	<button class="showCardHero"> habilité </button>
</div>
<div class="cardHero">
	<button on:click={hideCardHero}>
		<img style="width: 60px; height: auto;" src="/src/assets/img/inventory.PNG" alt="inventory" />
	</button>
	<div></div>
	<img class="fluidimg userPawn_img" src="/src/assets/img/{user.heroImg}" alt="pawn icon" />
	<p>{user.hero}</p>
	<p>life : {user.life}</p>
	<p>atk : {user.atk}</p>
	<p>def : {user.def}</p>
	<p>@TODO : add hability</p>
	{#if countOfItems}
		<ul class="inventory">
			{#each countOfItems as item, index}
				<li class="inventory_item">
					<img
						style="width: 30px; height : auto;"
						src="/src/assets/img/{Object.keys(countOfItems[index])[0]}.PNG"
						alt={Object.keys(countOfItems[index])[0]}
					/>
					<p><span> x {countOfItems[index][Object.keys(countOfItems[index])[0]]}</span></p>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<!-- @TODO : implémenter les abilities -->

<!-- @TODO : quand le boss arrive dans la même salle : -->
<!-- @TODO : un combat se lance (composant) -->

<!-- @TODO : si le joueur n'a plus de vie alors il meurt et devient spectateur -->
