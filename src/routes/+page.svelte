<script lang="ts">
	import Table from '$lib/Table.svelte';
	// import { Table } from '@skeletonlabs/skeleton';

	import { LightSwitch, clipboard, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { FileButton, Modal, SlideToggle } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';

	import {modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	import InstructionModal from '../lib/InstructionModal.svelte';
	import { onMount } from 'svelte';

	import {Toast} from '@skeletonlabs/skeleton';

	import { rows, currentEdit, displayMode, miaFile, rowsHistory } from '$lib/stores';

	import { getMIA, clearMIAmemory } from '$lib/mia_file';
	import MiaModal from '$lib/MIAModal.svelte';
	import { getDownload, readUpload } from '$lib/fileio';

	import type { MIAData } from '$lib/types';

	import { tableMapper, tableMapperMeta } from '$lib/tableMapping';


	let getNewId = () => {
		return Math.floor(Math.random() * 10000000000).toString(16);
	}

	function emptyFormData(): MIAData {
		return {
			alu: '0000',
			tb: '000',
			fb: '000',
			s: '0',
			p: '0',
			lc: '00',
			seq: '0000',
			uadr: '0000000',
			description: '',
			active: false,
			id: getNewId(),
		};
	}


	function openModal() {
		const modalComponent: ModalComponent = {
			ref: InstructionModal,
			props: {},
			slot: '<p>Skeleton</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
		};
		modalStore.trigger(d);
	}

	function openMIAModal() {
		$miaFile = getMIA($rows, clearMIAmemory($miaFile))


		const modalComponent: ModalComponent = {
			ref: MiaModal,
			props: {},
			slot: '<p>Skeleton</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
		};
		modalStore.trigger(d);
	}
	


    let sourceData: MIAData[] = $rows;

    let tableSimple: TableSource



	$: deleteInactiveRows(), rowsHistory.push($rows), sourceData = $rows, $displayMode, tableSimple = {
		head: ['Pos', 'ALU', 'TB', 'FB', "S", "P", "LC", "SEQ", "uADR", "value", "description"].map((x) => `<div class="flex justify-center">${x}</div>`),
		body: tableMapper(sourceData, $displayMode),
		meta: tableMapperMeta(sourceData, $displayMode),
		// foot: ['', '', '','','','','','','',  '']
	};

	let loaded = false;
	onMount(() => {
		loaded = true;

		if ($rowsHistory.rows.length === 0) {
			rowsHistory.push($rows)
		}

		if ($rows == null) {
			$rows = [];
		}

		for (let i = 0; i < $rows.length; i++) {
			if ($rows[i].id === undefined) {
				$rows[i].id = getNewId();
			}
		}
	});

	let dataExists = false;
	$: if (loaded) {
		dataExists = $rows.length !== 0 && $rows.some((row) => row.active);
	}

	function addRow() {
		$rows = [...$rows, emptyFormData()];
		$currentEdit = $rows.length - 1;
		openModal();
	}

	function edit(rowMeta: any) {
		$currentEdit = rowMeta.detail[0]
		openModal();
	}

	function deleteRow(rowMeta: any) {
		$rows.splice(rowMeta.detail[0], 1);
		$rows = $rows
	}


	function confirmDelete() {
			if ($rows.length === 0) return;
			const confirm: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: 'Do you want to delete all entries?',
			response: (r: boolean) => {
				if (r) {
					$rows = [];

				}
			},
		};
		modalStore.trigger(confirm);
		}


	function deleteInactiveRows() {
		if ($rows === undefined) return;
		if ($modalStore.length === 0) {
			let newRows: MIAData[] = [];
			for (let i = 0; i < $rows.length; i++) {
				if ($rows[i].active) {
					newRows.push($rows[i]);
				}
			}
			$rows = newRows;
		}
	}


	function undo() {
		if ($rowsHistory.rows.length === 0) return;
		$rows = rowsHistory.previous()
	}
	
	function redo() {
		if ($rowsHistory.current === $rowsHistory.rows.length - 1) return;
		$rows = rowsHistory.next()
	}

	let canUndo = false;
	$: canUndo = rowsHistory.hasPrevious(), $rows
	
	let canRedo = false;
	$: canRedo = rowsHistory.hasNext(), $rows
 
	let deleteMode = false;

	function copyHex(rowMeta) {
		console.log(rowMeta.detail)
		// sooooo janky
		const hex = rowMeta.detail[rowMeta.detail.length - 3].slice(46, 55);
		navigator.clipboard.writeText(hex);
		const t: ToastSettings = {
			message: `Copied ${hex} to clipboard`,
			background: 'variant-filled-secondary',
		};
		toastStore.trigger(t);
	}

</script>

<Toast />
<Modal />
<div class="flex justify-between">
	<div>
		<h1
		class="text-2xl font-bold text-gray-200 pb-8 bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent box-decoration-clone select-none">TSEA28 MIA</h1>
	</div>
	
	<div class="flex gap-4 mr-6">
		<div class="mt-8">
			<button type="button" on:click={() => openMIAModal()} class="btn btn-sm rounded-md variant-filled variant-filled-secondary">Import/Export</button>
		</div>
		{#if loaded}
		<!-- <div class="mt-8">
			<label class="btn btn-sm bg-gray-200 text-black hover:cursor-pointer variant-filled-secondary" for="miaFiles">Import .mia</label>
		</div> -->
		<!-- <div> -->
			<!-- <label class="label">
				<span>Display Mode</span>
				<select bind:value={$displayMode} class="select">
					<option value="0">Description + Bits</option>
					<option value="1">Description</option>
					<option value="2">Bits</option>
				</select>
			</label> -->
		<!-- </div> -->
		<div class="mt-8">
			<button type="button" class="btn btn-sm variant-filled variant-filled-primary rounded-md" disabled={!canUndo} on:click={() => undo()}>
				Undo
			</button>
		</div>
		<div class="mt-8">
			<button type="button" class="btn btn-sm variant-filled variant-filled-primary rounded-md" disabled={!canRedo} on:click={() => redo()}>
				Redo
			</button>
		</div>
		<div class="mt-8">
			<SlideToggle name="slider-label" active="bg-secondary-500" bind:checked={deleteMode}>Delete</SlideToggle>
		</div>
		{/if}
	</div>
</div>

<div>
	<Table ... interactive={true} on:edit={edit} on:delete={deleteRow} on:deleteAll={confirmDelete} on:create={addRow} on:selected={copyHex} source={tableSimple} bind:deleteMode/>
</div>