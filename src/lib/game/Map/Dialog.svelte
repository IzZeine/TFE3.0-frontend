<script>
</script>

<dialog class="dialog dialog_inventory">
	<div class="headerDialog">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
		<slot name="header" />
	</div>
	<div class="contentDialog">
		<slot name="content" />
	</div>
	<div class="footerDialog">
		<div class="actionButtons">
			<button class="actionButton" on:click={closeDialog}>
				<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
			</button>
			<slot name="buttons" />
		</div>
	</div>
</dialog>
