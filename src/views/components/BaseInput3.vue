<script setup>
import { ref } from 'vue'
const props = defineProps({
    placeholder: { type: String, default: 'Username' }
})

</script>


<template>
    <input type="text" autocomplete="off" name="text" class="input" :placeholder="props.placeholder" />
</template>

<style scoped>
.input {
    border: none;
    outline: none;
    border-radius: 15px;
    padding: 1em;
    background-color: var(--color-surface, var(--color-bg, #ccc));
    box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.06);
    transition: 300ms ease-in-out;
}

.input:focus {
    background-color: var(--color-surface, #fff);
    transform: scale(1.03);
    box-shadow: 0 8px 30px var(--color-primary-shadow, rgba(0,0,0,0.12));
}
</style>
