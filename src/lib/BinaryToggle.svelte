<script lang="ts">
    export let value: string = "0";

    let button: HTMLButtonElement 
    function toggle(event: MouseEvent) {
        if (event.clientX < button.offsetLeft || event.clientX > button.offsetLeft + button.offsetWidth) return;
        value = value === "0" ? "1" : "0";
    }
    

</script>

<div class="p-1/2 w-5 rounded-md bg-slate-200 text-gray-800 font-bold grid align-middle content-center">
    <button on:click|self={toggle} bind:this={button}>
        {value}
    </button>
</div>