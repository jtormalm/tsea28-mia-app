<script lang="ts">
    import BinaryToggle from "./BinaryToggle.svelte";

    export let length: number;
    export let value: string;
    export let name: string;

    let value_array: string[] = [];



    for (let i = 0; i < length; i++) {
        if (value[i] === "1") {
            value_array.push("1");
        }
        else {
            value_array.push("0");

        }
    }

    let previous_value: string = value;

    $: {
        if (value !== previous_value) {
            value_array = value.split("");
            previous_value = value;
        }
        else if (value_array.join("") !== value) {
            value = value_array.join("");
            previous_value = value;
        }
    };

</script>
<div class="flex flex-col items-center">
    <div>
        {name}
    </div>
    <div class="flex">
        {#each {length: length} as _, i}
                <BinaryToggle bind:value={value_array[i]} />
        {/each}
    </div>
</div>