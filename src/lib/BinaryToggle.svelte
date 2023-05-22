<script lang="ts">
    import { modeCurrent } from '@skeletonlabs/skeleton';

    export let value: string = "0";

    let button: HTMLButtonElement 
    function toggle(event: MouseEvent) {
        if (event.clientX < button.offsetLeft || event.clientX > button.offsetLeft + button.offsetWidth) return;
        value = value === "0" ? "1" : "0";
    }
    

</script>

<div class="p-1/2 w-5 rounded-md {$modeCurrent ? "bg-gray-800 text-slate-200" : "text-gray-800 bg-slate-200"} font-bold grid align-middle content-center">
    <button on:click|self={toggle} bind:this={button}>
        {value}
    </button>
</div>