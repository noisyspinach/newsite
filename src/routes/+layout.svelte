<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/all.css';

	let { children } = $props();

	let x = $state(0);
	let y = $state(0);

	function moveCursor(event) {
		x = event.clientX;
		y = event.clientY;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onmousemove={moveCursor} />

<div
	class="cursor"
	style={`left: ${x}px; top: ${y}px;`}
></div>

{@render children()}