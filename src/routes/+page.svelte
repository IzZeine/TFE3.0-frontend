<script>
	import { _ } from 'svelte-i18n';
	let innerWidth;
</script>

<svelte:window bind:innerWidth />

<div class="container">
	<img class="fluidimg logo" src="/assets/img/logo.png" alt="logo" />
	<ul>
		{#if innerWidth > 500}
			<li><a href="/board" class="btnPrimary">{$_('homepage.create')}</a></li>
		{/if}
		<li><a href="/game" class="btnPrimary">{$_('homepage.join')}</a></li>
	</ul>
</div>

<style lang="scss">
	.container {
		box-sizing: border-box;
		width: 100dvw;
		height: 100dvh;
		background-image: url('/assets/img/coverMobile.png');
		background-position: bottom left;
		background-size: cover;
		background-repeat: no-repeat;
		display: flex;
		flex-direction: column;
		@media (min-width: 500px) {
			background-image: url('/assets/img/cover.png');
			padding: 120px;
			display: block;
		}
	}
	ul {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;

		@media (min-width: 500px) {
			margin-top: 60px;
		}
	}
	li {
		width: 100%;
		@media (min-width: 500px) {
			width: 200px;
		}
	}
	a {
		margin: 0;
		display: block;
		text-align: center;
	}
	img {
		margin: 0 auto;
	}
</style>
