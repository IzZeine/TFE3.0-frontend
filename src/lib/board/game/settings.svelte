<div class="settings">
	<button class="btnSettings">
		<img src="/assets/img/settings.png" class="fluidimg" alt="settings" />
	</button>
</div>

<style lang="scss">
	.settings {
		display: flex;
		position: fixed;
		bottom: 0;
		right: 0;
		max-width: 1rem;
		height: auto;
		margin: 1rem;
	}
	.btnSettings {
		&:hover {
			animation: turn 5s infinite;
		}
	}

	@keyframes turn {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
