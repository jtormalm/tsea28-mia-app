<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
    import BinaryToggleGroup from './BinaryToggleGroup.svelte';

    import { choices } from './choices';
    import Choice from './Choice.svelte';

    import { rows, currentEdit, rowsHistory } from './stores';

    let formData = $rows[$currentEdit];


    function resetFormData() {
        formData.alu = '0000';
        formData.tb = '000';
        formData.fb = '000';
        formData.s = '0';
        formData.p = '0';
        formData.lc = '00';
        formData.seq = '0000';
        formData.uadr = '0000000';
        formData.description = '';
    }

    function isFormEmpty() {
        return formData.alu === '0000' && formData.tb === '000' && formData.fb === '000' && formData.s === '0' && formData.p === '0' && formData.lc === '00' && formData.seq === '0000' && formData.uadr === '0000000' && formData.description === '';
    }


    function getBits(): string {
        let bits = '0b';
        bits += formData.alu;
        bits += formData.tb;
        bits += formData.fb;
        bits += formData.s;
        bits += formData.p;
        bits += formData.lc;
        bits += formData.seq;
        bits += formData.uadr;
        return bits;
    }
    
    let bits = getBits();

    $: bits = getBits(), formData;

    function getHex(): string {
        return "0x" + parseInt(getBits().slice(2), 2).toString(16).toUpperCase().padStart(7, "0");
    }

    let hex = getHex();
    $: hex = getHex(), formData
    
	function onFormSubmit(): void {
        $rows[$currentEdit].active = true;
        $rows[$currentEdit] = formData;
		modalStore.close();
	}
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';



    let formEmpty = isFormEmpty();
    $: formEmpty = isFormEmpty(), formData;




</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-example-form {cBase}">
    <div class="flex justify-between">
        <header class={cHeader}>Add new instruction</header>
        <div class="text-2xl mr-2">
            {hex}
        </div>
    </div>
	<!-- <article>{bits}    =    {hex}</article> -->
	<!-- Enable for debugging: -->

    <div class="flex justify-between">
        <BinaryToggleGroup name="ALU" length={4} bind:value={formData.alu} />
        <BinaryToggleGroup name="TB" length={3} bind:value={formData.tb} />
        <BinaryToggleGroup name="FB" length={3} bind:value={formData.fb} />
        <BinaryToggleGroup name="S" length={1} bind:value={formData.s} />
        <BinaryToggleGroup name="P" length={1} bind:value={formData.p} />
        <BinaryToggleGroup name="LC" length={2} bind:value={formData.lc} />
        <BinaryToggleGroup name="SEQ" length={4} bind:value={formData.seq} />
        <BinaryToggleGroup name="uADR" length={7} bind:value={formData.uadr} />
    </div>

	<form class="modal-form {cForm}">
        <Choice name="ALU" choices={choices.alu} bind:value={formData.alu}/>
        <Choice name="To bus" choices={choices.tb} bind:value={formData.tb}/>
        <Choice name="From bus" choices={choices.fb} bind:value={formData.fb}/>
        <Choice name="S-biten" choices={choices.s} bind:value={formData.s}/>
        <Choice name="P-biten" choices={choices.p} bind:value={formData.p}/>
        <Choice name="Loop Counter" choices={choices.lc} bind:value={formData.lc}/>
        <Choice name="SEQ fältet" choices={choices.seq} bind:value={formData.seq}/>
        <label class="label">
            <span>Description</span>
            <textarea class="textarea" rows="2" maxlength="120" bind:value={formData.description} placeholder="Beskriv instruktionen" />
        </label>
	</form>
	<footer class="flex justify-between">
            <div class="flex gap-2">
            </div>
            <div class="flex gap-2">
                {#if !formEmpty}
                    <button class="btn variant-soft-error" on:click={resetFormData}>Reset</button>
                {/if}
                <button class="btn variant-soft-warning" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                <button class="btn variant-soft-primary text-white" on:click={onFormSubmit}>Submit Form</button>
        </div>
    </footer>
</div>