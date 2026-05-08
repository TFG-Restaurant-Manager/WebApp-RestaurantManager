<script setup>
import { ref } from 'vue'

// Versión simplificada: solo visual y con mínima lógica
const props = defineProps({
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Selecciona...' }
})

const open = ref(false)
const selected = ref(null)

function toggleOpen() {
    open.value = !open.value
}

function selectOption(option) {
    selected.value = typeof option === 'string' ? option : (option.label ?? String(option))
    open.value = false
}
</script>

<template>
    <div class="dropdown">
        <button class="toggle" type="button" @click="toggleOpen">
            <span class="label">{{ selected || props.placeholder }}</span>
            <span class="caret">▾</span>
        </button>

        <transition name="dropdown-menu">
            <ul v-if="open" class="menu">
                <li v-for="(option, index) in props.options" :key="index" class="item" @click="() => selectOption(option)">
                    {{ typeof option === 'string' ? option : option.label }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    display: inline-block;
    font-family: inherit;
    min-width: 200px;
}

.toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 8px;
    cursor: pointer;
    color: var(--color-text);
}

.label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.caret {
    margin-left: 0.5rem;
    color: var(--color-primary);
}

.menu {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 6px;
    max-height: 240px;
    overflow: auto;
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 8px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    z-index: 50;
    padding: 6px 0;
    transform-origin: top center;
}

.menu .item {
    list-style: none;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
}

.menu .item:hover {
    background: var(--color-primary);
    color: var(--color-text-on-primary);
}

.dropdown-menu-enter-from,
.dropdown-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.96);
}
.dropdown-menu-enter-active,
.dropdown-menu-leave-active {
  transition: transform 180ms cubic-bezier(.2,.8,.2,1), opacity 140ms ease;
}
.dropdown-menu-enter-to,
.dropdown-menu-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
</style>