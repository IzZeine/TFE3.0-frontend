<script lang="ts">
	import { onMount } from 'svelte';
	export let src: string;
	export let autoPlay = true;
	export let loop = false;
	export let volume = 1;

	let audioElement: HTMLAudioElement;

	onMount(() => {
		audioElement.volume = volume;
	});
</script>

<audio {src} {loop} autoplay={autoPlay} bind:this={audioElement} />
