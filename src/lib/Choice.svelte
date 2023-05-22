<script lang="ts">
	import { onMount } from 'svelte';

	export let name: string;
	export let choices: { value: string; text: string }[];
	export let value: string = '';

	let select: HTMLSelectElement;

	onMount(() => {
        if (value !== '') return;
		select.selectedIndex = 0;
	});
</script>

<label class="label">
	<span class="ml-0 select-none">{name}</span>
	<select bind:value bind:this={select} class="select w-full">
		<option selected={true} value={choices[0].value}>{choices[0].text}</option>
		{#each choices.slice(1) as choice}
			<option value={choice.value}>{choice.text}</option>
		{/each}
	</select>
</label>
