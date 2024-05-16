<script>
	// @ts-nocheck
	import { clearStorage, getItems, getRoomsConnections, getUser, sleep } from '$lib';
	import { onMount } from 'svelte';
	import { socket } from '$lib/js/socketConnection.js';
	import { fade, fly, blur, slide } from 'svelte/transition';

	// export let data;
	// const socket = data.socket;

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
	let mooveSpeed = 1
	let isFixed = true
	let usersInGame = ''
	let nerfDices = 0
	let luckOfDices = 0
	let luckRatio = 0

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

		socket.on('updateUsers',async (data)=>{
			user = await getUser(socket);
			updateInventory(user);
			displayArrowsDirections()
			usersInGame = data;
			if(user.life <= 0){
				let actionButtonsElement = document.querySelectorAll('.actionButton')
				actionButtonsElement.forEach((btn)=>{
					btn.setAttribute('disabled', true);
				})
			}
		})

		socket.on('saveYou', async(id)=>{
			if(user.id != id)	{
				console.log('notYou')
				return;
			}
			console.log('you are saved')
			let actionButtonsElement = document.querySelectorAll('.actionButton')
				actionButtonsElement.forEach((btn)=>{
					btn.removeAttribute('disabled');
			})
		})
		
		socket.on('youAskedRooms', (rooms) => {
			if(!user) return;
			displayArrowsDirections();
			allRooms = rooms;
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			if(!itemInRoom || itemInRoom == 'null') {
				let getItemBtn = document.querySelector('.getItemBtn');
				getItemBtn.setAttribute('disabled', true);
				return;
			}
			itemInRoom = JSON.parse(itemInRoom);
		});

		socket.on('movePlayer', async (userID) => {
			displayArrowsDirections();
			user = await getUser(socket);
			myRoom = allRooms[user.room];
			itemInRoom = myRoom.item;
			if(user.hero == 'Golem') {
				let rockDef = Math.floor(Math.random() * 4) * 5;
				let rock = {def: rockDef}
				console.log(rock)
				socket.emit ('dropARock', rock )
			}
			if(!itemInRoom || itemInRoom == 'null') return;
			itemInRoom = JSON.parse(itemInRoom); // convert string to json
		});

		socket.on('battle', async (data) => {
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

			if (user.room != data.room) return;
			
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

			if (user.team = 'boss') socket.emit('battleEnded', winner);

		});

		socket.on('returnAtSpawn', async () => {
			user = await getUser(socket);
			displayArrowsDirections();

			if(user.life <= 0){
				let actionButtonsElement = document.querySelectorAll('.actionButton')
				actionButtonsElement.forEach((btn)=>{
					btn.setAttribute('disabled', true);
				})
			}

			if (user.team == 'hero' && myRoom.item != 'null' && myRoom.item != null) {
				let getItemBtn = document.querySelector('.getItemBtn');
				getItemBtn.removeAttribute('disabled');
			}

			closeDialog('dialog_battle')
		});

		socket.on('isNerfingDices', () =>{
			console.log("dices is nerf")
			nerfDices = 3
		})
		socket.on('undoNerfingDices', () =>{
			console.log("dices is normal")
			nerfDices = 0
		})
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

		await sleep(mooveSpeed);

		for (let direction of diectionsKeys) {
			if (directions[direction] == 'null') continue;
			let arrow = document.querySelector('#' + direction);
			if (directions[direction] != 'null') arrow.removeAttribute('disabled');
		}
	};

	let askToChangeRoom = async() => {
		isFixed = false
		let direction = event.target.id;
		let targetRoom = directions[direction];
		if (targetRoom == 'null') return;
		if (targetRoom == 19) {
			let hasKey = myInventory.some((item) => item.nameId === 'key');
			if (!hasKey) {
				popUp("You don't have the key");
				isFixed = true
				return;
			}
		}
		socket.emit('askToChangeRoom', targetRoom);
		dice1 = 1;
		dice2 = 1;
		await sleep(mooveSpeed)
		isFixed = true
	};

	let tryToGetItemInRoom = async () => {
		let getItemBtn = document.querySelector('.getItemBtn');
		let bonusDicesElement = document.querySelector('.bonusDices')
		if (bonusDicesElement) bonusDicesElement.classList.add('isActive')
		let condition = itemInRoom.condition;
		let pointsDices = await rollDice();
		pointsDices += luckOfDices - nerfDices
		if (pointsDices < condition) {
			getItemBtn.setAttribute('disabled', true);
			await sleep(1);
			getItemBtn.removeAttribute('disabled');

			if (bonusDicesElement) bonusDicesElement.classList.remove('isActive')

			await sleep(0.2)
			luckOfDices = 0

			return;
		}
		disabledArrows();
		getItemBtn.setAttribute('disabled', true);
		await sleep(1);
		getItemBtn.removeAttribute('disabled');

		if (bonusDicesElement) bonusDicesElement.classList.remove('.isActive')
		luckOfDices = 0

		let message =
			'Vous avez gagné : \n' +
			"<div class='itemInPopUpDiv'>" +
			"<img class='fluidimg itemInPopUp' src='/assets/img/" +
			itemInRoom.nameId +
			".png'	alt={itemInRoom.nameId}/>" +
			itemInRoom.name +
			'</div>';
		popUp(message);
		displayArrowsDirections();
		console.log(user)
		socket.emit('getItemInRoom', myRoom);
		closeDialog('dialog_item')
	};

	let rollDice = async() => {
		for(let i=0;i<5;i++){
			dice1 = Math.floor(Math.random() * 6) + 1;
			dice2 = Math.floor(Math.random() * 6) + 1;
			await sleep(0.07)
		}
		return dice1 + dice2;
	};

	let cooldownTimer = async (duration, color) => {
		let cdElement = document.querySelector('#cooldown');
		cdElement.textContent = duration
		cdElement.style.color = color
		let count = 0
		let intervalId = setInterval ( () => { 
			count++; 
			cdElement.textContent = duration - count
			if (count >= duration ) { 
				count = 0
				clearInterval (intervalId);
			} 
		}, 1000 ) ;
		await sleep(duration)
		cdElement.textContent = ''
	}

	let useAbility = async(data) => {
		let powerElement = document.querySelector('.--power');
		powerElement.setAttribute('disabled', true);
		let colorActive = 'green'
		let colorInactive = 'red'

		socket.emit('useAbility', data)

		switch (user.hero){
			case 'Rodeur':
				closeDialog('dialog_power')
				disabledArrows()
				await sleep(1)
				socket.emit('askToChangeRoom', data);
				await cooldownTimer(5, colorInactive)
				powerElement.removeAttribute('disabled');			
				break;
			case 'Chevalier' :
				mooveSpeed = data;
				closeDialog('dialog_power')
				await cooldownTimer(10, colorActive)
				mooveSpeed = 1;
				await cooldownTimer(60, colorInactive)
				powerElement.removeAttribute('disabled');			
				break;
			case 'Necromancien' :
				socket.emit('saveUser',(data))
				closeDialog('dialog_power')
				powerElement.removeAttribute('disabled');			
				break;
			case 'Druide' :
				socket.emit('healUser',(data))
				closeDialog('dialog_power')
				await cooldownTimer(5, colorInactive)
				powerElement.removeAttribute('disabled');
				break;
			case 'Magicien' :
				upLuckToDice()
				closeDialog('dialog_power')
				let message = 'vous gagnez +' + luckOfDices + ' points pour le prochain lancé de dés'
				popUp(message)
				await cooldownTimer(5, colorInactive)
				powerElement.removeAttribute('disabled');	
				break;
			case 'Serpent' :
				socket.emit('nerfDices')
				closeDialog('dialog_power')
				await cooldownTimer(10, colorActive)
				socket.emit('undoNerfDices')
				await cooldownTimer(120, colorInactive)
				break;
			default :
				console.log('personne');
		}
	}

	let openDialog = (target) => {
		let dialogTarget = document.querySelector('.'+target)
		if(target == 'dialog_power') randomRoomTP = getnumber()
		let getItemBtn = document.querySelector('.getItemBtn');
		getItemBtn.removeAttribute('disabled');
		if(!itemInRoom) {
			getItemBtn.setAttribute('disabled', true);
		}
		dialogTarget.show()
	}

	let closeDialog = (target) => {
		let dialogTarget = document.querySelector('.'+target)
		dialogTarget.close()
	}
 
	let getnumber = () =>{
		let numbers = [];
		while(numbers.length < 5){
				var r = Math.floor(Math.random() * 38) + 1;
				while (r==19){
					 r = Math.floor(Math.random() * 38) + 1;
					}
				if(numbers.indexOf(r) === -1) numbers.push(r);
		}
		return numbers
	}

	let upLuckToDice = () => {
		luckOfDices =  Math.floor(Math.random() * 3 + luckRatio);
		if(luckOfDices == 0) luckRatio += 0.25
		if(luckOfDices > 0) luckRatio = 0
	}

	let randomRoomTP = getnumber()

	// @TODO : si le boss est mort ou que l'ensemble de items restants ne suffisent pas pour battre le boss, le jeu se termine
</script>

<div class="maxContent">
		<!-- {#if isFixed} -->
		<div class="mapUserContainer" in:blur={{ y: 50, duration: mooveSpeed*500 }} out:blur={{duration: mooveSpeed*500}}>
			{#if myRoom}
				{#if isFixed}
					<div class="headerMap" in:blur={{ y: 50, duration: mooveSpeed*500 }} out:blur={{duration: mooveSpeed*500}}>
						<div class="cardHero">
							<div class="lifes">
										<ul class="cardHero_stats-life">
											{#each { length: user.life } as _, index}
												{@const numberOfLife = user.life}
												{@const isLast = index === user.life - 1}
												<li>
													<img class="fluidimg" src="/assets/img/life.svg" alt="life" />
												</li>
												{#if isLast}
													{#each { length: 3 - numberOfLife } as _, index}
														<li>
															<img class="fluidimg" src="/assets/img/noLife.svg" alt="life" />
														</li>
													{/each}
												{/if}
											{/each}
											{#if user.life <= 0}
											{#each { length: 3 } as _}
												<li>
													<img class="fluidimg" src="/assets/img/noLife.svg" alt="life" />
												</li>
											{/each}
											{/if}
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
					{:else}
					<div></div>
				{/if}
				{#if user.life <= 0 } <p>Vous êtes mort..</p> {/if}
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

				<div class="sideBarUser">
					{#if isFixed}
						<h1 class="h2 directionSalle" in:blur={{ y: 50, duration: mooveSpeed*500 }} out:blur={{duration: mooveSpeed*0}}>
							Salle {user.room}
						</h1>
						{:else}
							<h1 class="h2 directionSalle"  in:blur={{ y: 50, duration: mooveSpeed*500 }} out:blur={{duration: 0}}>
								Mooving..
							</h1>
					{/if}
					<div class="actionButtons">
						{#if myRoom && (user.team == 'hero' || user.hero == 'Dragon')}
							<button class="actionButton --inventory" on:click={() => openDialog("dialog_inventory")}>
								<img class="fluidimg" src="/assets/img/inventory.png" alt="inventory">
							</button>
						{/if}
							<button class="actionButton --power" on:click={() => openDialog("dialog_power")}>
								<p class="h2" id="counter"><span id='cooldown'></span></p>
								<img class="fluidimg" src="/assets/img/power.png" alt="Ax" />
							</button>
						{#if myRoom && (user.team == 'hero' || user.hero == 'Dragon')}
							<button class="actionButton --find" on:click={() => openDialog("dialog_item")}>
								<img class="fluidimg" src="/assets/img/find.png" alt="find" />
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
		<!-- {/if} -->

		<dialog class="dialog dialog_item">
			<div class="headerDialog">
				<div class="dices">
					<div class="dices">
						{#if dice1 && dice2}
							{#if nerfDices != 0}
								<p class="h1 bonusDices nerfOfDices">{luckOfDices - nerfDices}</p>
							{/if}
							{#if luckOfDices != 0}
								<p class="h1 bonusDices luckOfDices">+{luckOfDices}</p>
							{/if}
							<img class="fluidimg dice" src="/assets/img/dice{dice1}.png" alt="dice1"/>
							<img class="fluidimg dice" src="/assets/img/dice{dice2}.png" alt="dice2"/>
						{/if}
					</div>
				</div>
			</div>
			<div class="contentDialog">
				<div class="itemInRoom">
					{#if itemInRoom && itemInRoom != 'null'}
						{#if itemInRoom.rarity == 'légendaire'}
							<div class="animationLegendary"></div>
						{/if}
						<img
							class="fluidimg itemInRoom"
							src="/assets/img/{itemInRoom.nameId}.png"
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
									src="/assets/img/{Object.keys(countOfItems[index])[0]}.png"
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

		{#if user.hero == 'Rodeur'}
		<dialog class="dialog dialog_power --rodeur">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
				<ul class="roomChoice">
					{#each randomRoomTP as room}
							<li class="roomChoice_item"><button class="roomChoice_item-btn" on:click={() => useAbility(room)}>{room}</button></li>
					{/each}
				</ul>
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
				<!-- <button class="btnPrimary" on:click={useAbility}>Utiliser</button> -->
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Chevalier'}
		<dialog class="dialog dialog_power --knight">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
				<button class="btnPrimary" on:click={() => {useAbility(0.3); closeDialog("dialog_power")}}>Utiliser</button>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Druide'}
		<dialog class="dialog dialog_power --druide">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
				<ul class="userChoice">
					{#each usersInGame as user}
						{#if user.life < 3 && user.life > 0}
							<li class="userChoice_item">
								<button class="userChoice_item-btn" on:click={() => useAbility(user)}>
									<img class="fluidimg hero" src="/assets/img/{user.heroImg}" alt="heroDead">
								</button>
								<p class="userChoice_item-username">{user.username}</p>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Necromancien'}
		<dialog class="dialog dialog_power --necromancer">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
				<ul class="userChoice">
					{#each usersInGame as user}
						{#if user.life <= 0}
							<li class="userChoice_item">
								<button class="userChoice_item-btn" on:click={() => useAbility(user)}>
									<img class="fluidimg hero" src="/assets/img/{user.heroImg}" alt="heroDead">
								</button>
								<p class="userChoice_item-username">{user.username}</p>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Magicien'}
		<dialog class="dialog dialog_power --wizard">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
				<div class="luckText">
					<p>Vous avez</p>
					<p>+{luckOfDices} points</p>
					<p>au prochain lancé de dés!</p>
				</div>
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
				<p>Si vous relancez votre sort, vous perdrez votre bonus actuel</p>
				<button class="btnPrimary" on:click={() => {useAbility(0)}}>Utiliser</button>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Serpent'}
		<dialog class="dialog dialog_power --knight">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
				<button class="btnPrimary" on:click={() => {useAbility(0); closeDialog("dialog_power")}}>Utiliser</button>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Dragon'}
		<dialog class="dialog dialog_power --knight">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
			</div>
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

		{#if user.hero == 'Golem'}
		<dialog class="dialog dialog_power --golem">
			<div class="headerDialog">
				<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau">
				{#if countOfItems}
				<ul class="inventory -rock">
					{#each countOfItems as item, index}
						<li class="inventory_item">
							<img
								class="fluidimg"
								src="/assets/img/{Object.keys(countOfItems[index])[0]}.png"
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
			<div class="contentDialog">
				<p class="h2">{user.abilityName}</p>
				<p>{user.ability}</p>
			</div>
			<div class="footerDialog">
				<div class="actionButtons">
					<button class="actionButton" on:click={() => closeDialog("dialog_power")}>
						<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
					</button>
			</div>
		</dialog>
		{/if}

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
