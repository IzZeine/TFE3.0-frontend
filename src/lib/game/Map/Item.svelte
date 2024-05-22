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