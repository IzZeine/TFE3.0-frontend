<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { page } from '$app/stores';

	let canvasEl: HTMLCanvasElement;
	export let url: string = $page.url.origin;
	onMount(() => {
		QRCode.toCanvas(
			canvasEl,
			url,
			{
				width: 120,
				errorCorrectionLevel: 'medium',
				color: { light: '#352e2d00', dark: '#f3a333' },
				margin: 0
			},
			function (error) {
				if (error) console.error(error);
			}
		);
	});
</script>

<div class="container">
	<canvas class="container__code" bind:this={canvasEl}></canvas>
	<div class="container__label">{url}</div>
</div>

<style lang="scss">
	.container {
		z-index: 99;
		position: fixed;
		bottom: 0;
		right: 0;
		padding: 0;
		margin: 1.5rem;
		color: var(--txtPrimary);
		text-align: center;
		&__label {
			font-size: 1rem;
		}
	}
</style>
