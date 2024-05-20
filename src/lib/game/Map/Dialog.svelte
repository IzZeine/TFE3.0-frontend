<script>

</script>

<dialog class="dialog dialog_inventory">
	<div class="contentDialog">
		<slot />
	</div>
	<div class="footerDialog">
		<div class="actionButtons">
			<button class="actionButton" on:click={closeDialog}>
				<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
			</button>
		</div>
	</div>
</dialog>