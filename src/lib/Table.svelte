<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tableA11y, type TableSource } from '@skeletonlabs/skeleton';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import AiOutlineEdit from 'svelte-icons-pack/ai/AiOutlineEdit';
	import TiDelete from 'svelte-icons-pack/ti/TiDelete';
	import TiPlus from 'svelte-icons-pack/ti/TiPlus';
	import TiMinus from 'svelte-icons-pack/ti/TiMinus';

	import { rows, rowsHistory } from './stores';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	// import { tableA11y } from "../../utilities/DataTable/DataTable";
	const dispatch = createEventDispatcher();
	export let source: TableSource;
	export let interactive = false;
	export let element = 'table';
	export let text = '';
	export let color = '';
	export let regionHead = '';
	export let regionBody = '';
	export let regionCell = '';
	export let regionFoot = '';
	export let deleteMode = false;

	let hovering: number | null = null;

    if (source === undefined) {
        source = {
            head: [],
            body: [],
            meta: []
        };
    }
    if (source.meta === undefined) {
        source.meta = [];
    }

	function onRowClick(event: KeyboardEvent | MouseEvent, rowIndex: number) {
		if (!interactive) return;
		event.preventDefault();
		event.stopPropagation();
		const rowMetaData = source.meta ? source.meta[rowIndex] : source.body[rowIndex];
		dispatch('selected', rowMetaData);
	}
	function onRowKeydown(event: KeyboardEvent, rowIndex: number) {
		if (['Enter', 'Space'].includes(event.code)) onRowClick(event, rowIndex);
	}

	function editRow(event: MouseEvent, rowIndex: number) {
		if (!interactive) return;
		event.preventDefault();
		event.stopPropagation();
		const rowMetaData = source.meta ? source.meta[rowIndex] : source.body[rowIndex];
		//   rowMetaData.event = event;
		dispatch('edit', rowMetaData);
	}

	function deleteRow(event: MouseEvent, rowIndex: number) {
		if (!interactive) return;
		event.preventDefault();
		event.stopPropagation();
		const rowMetaData = source.meta ? source.meta[rowIndex] : source.body[rowIndex];
		//   rowMetaData.event = event;
		dispatch('delete', rowMetaData);
	}

	function createRow(event: MouseEvent) {
		if (!interactive) return;
		event.preventDefault();
		event.stopPropagation();
		dispatch('create');
	}

	function deleteAllRows(event: MouseEvent) {
		if (!interactive) return;
		event.preventDefault();
		event.stopPropagation();
		dispatch('deleteAll');
	}

	$: classesBase = `${$$props.class || ''}`;
	$: classesTable = `${element} ${text} ${color}`;

	const dragstart = (event: DragEvent, i: number) => {
        if (event.dataTransfer === null) {
            return;
        }
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start.toString());
	};

	const drop = (event: DragEvent, target: number) => {
        if (event.dataTransfer === null) {
            return;
        }
		console.log('drop');
		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));
		const newTracklist = $rows;

		if (start < target) {
			newTracklist.splice(target + 1, 0, newTracklist[start]);
			newTracklist.splice(start, 1);
		} else {
			newTracklist.splice(target, 0, newTracklist[start]);
			newTracklist.splice(start + 1, 1);
		}
		$rows = newTracklist;
		hovering = null;
	};
</script>

<div class="table-container {classesBase} select-none">
	<!-- Table -->
	<!-- prettier-ignore -->
	<table
            class="{classesTable}"
            class:table-interactive={interactive}
            role="grid"
            use:tableA11y
        >
            <!-- on:keydown={(e) => onTableKeydown(elemTable, e)} -->
            <!-- Head -->
            <thead class="table-head {regionHead}">
                <tr>
                    {#each source.head as heading }
                        <th>{@html heading}</th>
                    {/each}
                    <th>

                    </th>
                </tr>
            </thead>
            <!-- Body -->
            <tbody class="table-body {regionBody}">
                {#each source.body as row, rowIndex (source.meta ? source.meta[rowIndex][12] : rowIndex)}
                    <!-- Row -->
                    <!-- prettier-ignore -->
                    <tr
                        on:click={(e) => { onRowClick(e, rowIndex); }}
                        on:keydown={(e) => { onRowKeydown(e, rowIndex); }}
                        animate:flip="{{duration: 200}}"
                        aria-rowindex={rowIndex + 1}
                        draggable={true}
                        on:dragstart={event => dragstart(event, rowIndex)}
                        on:drop|preventDefault={event => drop(event, rowIndex)}
                        on:dragenter={() => {hovering = rowIndex}}
                        on:dragend={() => {hovering = null}}
                        on:dragover={(e) => { e.preventDefault(); }}
                        class="{hovering === rowIndex ? 'opacity-25 scale-105 duration-200' : 'duration-0'}  ease-out "
                    >
                        {#each row as cell, cellIndex}
                            <!-- Cell -->
                            <!-- prettier-ignore -->
                            <td
                                class="{regionCell} !align-middle"
                                role="gridcell"
                                aria-colindex={cellIndex + 1}
                                tabindex={cellIndex === 0 ? 0 : -1}
                                on:dragover={(e) => { e.preventDefault(); }}>
                                {@html cell ? cell : '-'}
                            </td>
                        {/each}
                        <td>
                            <button type="button" class="btn-icon {deleteMode ? "variant-filled-warning" : "variant-filled-secondary fill-white"} flex justify-center p-1 rounded-md transition-colors duration-300" on:click={(e) => {
                                if (deleteMode) {
                                    deleteRow(e, rowIndex)
                                } else {
                                    editRow(e, rowIndex)
                                }
                            }}>
                                {#if deleteMode}
                                <Icon src={TiMinus} size="1.5em"/>
                                {:else}
                                <Icon src={AiOutlineEdit} size="1.25em"/>
                                {/if}
                            </button>
                        </td>
                    </tr>
                {/each}
                <tr>
                </tr>
            </tbody>
            <!-- Foot -->
            {#if true}
                <tfoot class="table-foot {regionFoot}">
                        <tr>
                            {#each source.head as _ }
                                <td></td>
                            {/each}
                            <td>
                                <button type="button"  class="btn-icon {deleteMode ? "variant-filled-error" : "variant-filled-primary"}  flex justify-center p-1 rounded-md -ml-1 transition-colors duration-300" on:click={(e) => {
                                    if (deleteMode) {
                                        deleteAllRows(e)
                                    } else {
                                        createRow(e)
                                    }
                                }}>
                                    {#if (deleteMode)}
                                    <Icon src={TiDelete} size="1.5em"/>
                                    {:else}
                                    <Icon src={TiPlus} size="1.5em"/>
                                    {/if}
                                </button>
                            </td>
                    </tr>
                </tfoot>
            {/if}
        </table>
</div>

<style>
	.list {
		background-color: white;
		border-radius: 4px;
		box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
	}

	.list-item {
		display: block;
		padding: 0.5em 1em;
	}

	.list-item:not(:last-child) {
		border-bottom: 1px solid #dbdbdb;
	}

	.list-item.is-active {
		background-color: #3273dc;
		color: #fff;
	}
</style>
