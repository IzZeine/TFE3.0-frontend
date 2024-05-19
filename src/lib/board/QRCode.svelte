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
				width: 160,
				errorCorrectionLevel: 'medium',
				color: { light: '#07061d', dark: '#FA73B4' },
				margin: 0
			},
			function (error) {
				if (error) console.error(error);
				console.log('success!');
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
		padding: 0.5rem;
		margin: 1.5rem;
		color: white;
		text-align: center;
		&__code {
			margin-bottom: 1rem;
		}
		&__label {
			font-size: 1rem;
		}
	}
</style>
