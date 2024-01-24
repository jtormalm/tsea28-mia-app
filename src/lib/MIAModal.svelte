<script lang="ts">
	import { mia_text } from './mia_file';

	export let parent: any;

	import { miaFile, rows } from './stores';
	import { onMount } from 'svelte';

    import { getMIA } from './mia_file';

    import { getDownload, readUpload } from './fileio';
	import { FileButton } from '@skeletonlabs/skeleton';
 
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold -mb-1';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

    let textArea: HTMLTextAreaElement;
    onMount(() => {
        textArea.scrollTop = 6195;
    });

    let files: FileList;
	$: if (files) readUpload(files[0])

    let filename: string = "tsea28.mia";



</script>

<div class="modal-example-form {cBase}">
	<header class="{cHeader} flex justify-between"
        ><div>
            MIA File
        </div>
        <div>
            <label class="label">
                <input class="input" type="text" placeholder="Filename" bind:value={filename}/>
            </label>
        </div>
    </header>
	<form class="modal-form {cForm}">
		<label class="label">
            <textarea class="textarea regular_cursor" rows="20" value={$miaFile} readonly bind:this={textArea}/>
        </label>
	</form>
	<footer class="modal-footer flex justify-between">
            <div class="flex gap-1">
                <div>
                    <FileButton name="files" button="btn variant-soft-secondary" bind:files={files}>
                        Import
                    </FileButton>
                </div>
                <div>
                    <button class="btn variant-soft-secondary" on:click={() => getDownload($miaFile, $rows, filename ? filename : "tsea28.mia")}>Export</button>
                </div>
            </div>
            <div>
                <button class="btn variant-soft-error" on:click={() => $miaFile = getMIA($rows, mia_text)}>Reset</button>
                <button class="btn variant-soft-warning" on:click={parent.onClose}>Close</button>
            </div>
    </footer>
</div>

<style>
    .regular_cursor {
        cursor: default !important;
    }
</style>