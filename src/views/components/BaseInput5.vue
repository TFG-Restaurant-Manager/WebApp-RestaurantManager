<script setup>
const props = defineProps({ placeholder: { type: String, default: 'Username' } })
</script>

<template>
    <div class="inputbox">
        <input required type="text" placeholder="">
        <span>{{ props.placeholder }}</span>
        <i></i>
    </div>
</template>

<style scoped>
.inputbox {
    position: relative;
    width: 196px;
    margin-top: 30px;
}

.inputbox input {
    position: relative;
    width: 100%;
    padding: 10px 10px 10px;
    background: transparent;
    outline: none;
    border: none;
    color: var(--color-text, #23242a);
    font-size: 1em;
    letter-spacing: 0.05em;
    z-index: 10;
}


.inputbox span {
    position: absolute;
    left: 0;
    top: 0;
    padding: 10px;
    font-size: 1em;
    color: var(--color-muted, #8f8f8f);
    letter-spacing: 0.05em;
    transition: 0.5s;
    pointer-events: none;
}


.inputbox input:focus~span,
.inputbox input:valid~span {
    color: var(--color-primary, #45f3ff);
    transform: translateY(-25px);
    font-size: 0.75em;
}


.inputbox i {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: var(--color-border, rgba(0,0,0,0.12));
    border-radius: 4px;
    transition: 0.5s;
    pointer-events: none;
    z-index: 1;
}

.inputbox input:focus~i,
.inputbox input:valid~i {
    height: 100%;
    background: var(--color-primary, #23242a);
    border-bottom: 2px solid var(--color-primary, #45f3ff);
}
</style>
