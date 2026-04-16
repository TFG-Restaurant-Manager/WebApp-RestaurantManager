<script setup>
import { ref } from 'vue'
</script>

<template>
    <div class="group">
        <input required="" type="text" class="input">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label>Name</label>
    </div>
</template>

<style scoped>
.group {
    position: relative;
    width: 200px;
    box-sizing: border-box;
}

.input {
    font-size: 16px;
    padding: 10px 0px 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--color-border, #d0d0d0);
    background: transparent;
    box-sizing: border-box;
    color: var(--color-text, #23242a);
}

.input:focus {
    outline: none;
}

label {
    color: var(--color-muted, #999);
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 10px;
    transition: 0.2s ease all;
}

.input:focus~label,
.input:valid~label {
    top: -20px;
    font-size: 14px;
    color: var(--color-primary, #45f3ff);
}

.bar {
    position: relative;
    display: block;
    width: 100%;
}

.bar:before,
.bar:after {
    content: '';
    height: 2px;
    width: 0;
    bottom: 0;
    position: absolute;
    background: var(--color-primary, #45f3ff);
    transition: 0.2s ease all;
}

.bar:before {
    left: 50%;
}

.bar:after {
    right: 50%;
}

.input:focus~.bar:before,
.input:focus~.bar:after {
    width: 50%;
}

.highlight {
    position: absolute;
    height: 60%;
    width: 100%;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
}

.input:focus~.highlight {
    animation: inputHighlighter 0.3s ease;
}

@keyframes inputHighlighter {
    from {
        background: var(--color-primary, #45f3ff);
    }
    to {
        width: 0;
        background: transparent;
    }
}
</style>