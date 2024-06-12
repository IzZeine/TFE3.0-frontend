<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="container">
	<div class="loader h1">{$_('common.waiting')}</div>
</div>

<style>
	.container {
		height: 100dvh;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.loader {
		width: fit-content;
		padding-bottom: 8px;
		background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
		animation: loading 2s linear infinite;
	}

	@keyframes loading {
		to {
			background-size: 100% 3px;
		}
	}
</style>
