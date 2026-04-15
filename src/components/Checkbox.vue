<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    name: { type: String, default: '' },
    size: { type: [String, Number], default: '28px' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const styleVars = computed(() => ({
    '--size': typeof props.size === 'number' ? `${props.size}px` : props.size
}))

const root = ref(null)

function onChange(e) {
    const checked = e.target.checked
    emit('update:modelValue', checked)
    emit('change', checked)
    try { if (root.value && !root.value.classList.contains('has-interacted')) root.value.classList.add('has-interacted') } catch (e) { }
}

function pressAnimation(el) {
    if (el) {
        el.classList.remove('is-pressed')
        void el.offsetWidth
        el.classList.add('is-pressed')
    }
}

function pointerDown(e) {
    pressAnimation(e.currentTarget)
    try { if (root.value && !root.value.classList.contains('has-interacted')) root.value.classList.add('has-interacted') } catch (e) { }
}

function onAnimationEnd(e) {
    const el = (e && e.currentTarget) || (e && e.target) || null
    if (el && el.classList) el.classList.remove('is-pressed')
}
</script>

<template>
    <label class="checkbox" :style="styleVars" ref="root">
        <input type="checkbox" :checked="modelValue" :name="name" @change="onChange" />

        <span class="checkbox-box" @pointerdown="pointerDown" @touchstart.passive="pointerDown"
            @animationend="onAnimationEnd">
            <svg class="check-svg" viewBox="0 0 24 24" aria-hidden="true">
                <path class="check-path" d="M4 12l4 4 12-12" />
            </svg>
        </span>

        <span v-if="label" class="label">{{ label }}</span>
    </label>
</template>

<style scoped>
.checkbox {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    user-select: none;
}

.checkbox input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
}

.checkbox-box {
    width: var(--size, 28px);
    height: var(--size, 28px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid rgba(33, 53, 71, 0.08);
    background: linear-gradient(180deg, #ffffff, #fbfbfb);
    transition: border-color 180ms ease, box-shadow 200ms ease, transform 140ms ease;
    box-shadow: 0 6px 18px rgba(8, 15, 22, 0.06);
    position: relative;
    z-index: 0;
    overflow: visible;
}

.checkbox-box::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
    opacity: 0;
    transition: opacity 260ms cubic-bezier(.2, .8, .2, 1) 0ms;
    z-index: 0;
}

.checkbox-box::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(60% 40% at 25% 20%, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0));
    opacity: 0.9;
    mix-blend-mode: overlay;
    z-index: 2;
}

.checkbox-box svg {
    width: 66%;
    height: 66%;
    position: relative;
    z-index: 3;
}

.checkbox-box svg .check-path {
    stroke: var(--color-text-on-primary, #fff);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 28;
    stroke-dashoffset: 28;
    transition: stroke-dashoffset 300ms cubic-bezier(.2, .8, .2, 1) 0ms, opacity 200ms ease 0ms;
    opacity: 0;
}

.checkbox input:checked+.checkbox-box svg .check-path {
    transition: stroke-dashoffset 300ms cubic-bezier(.2, .8, .2, 1) 160ms, opacity 160ms ease 160ms;
}

.checkbox input:focus-visible+.checkbox-box {
    outline: 3px solid rgba(66, 184, 131, 0.14);
    outline-offset: 4px;
}


.checkbox input:checked+.checkbox-box {
    box-shadow: 0 18px 40px var(--color-primary-shadow, rgba(66, 184, 131, 0.12));
    border-color: transparent;
    animation: check-bounce 420ms cubic-bezier(.2, .8, .2, 1);
}

.checkbox input:checked+.checkbox-box::before {
    opacity: 1;
    transition-delay: 140ms;
}

.checkbox.has-interacted input:not(:checked)+.checkbox-box {

    animation: uncheck-pop 240ms cubic-bezier(.2, .8, .2, 1);
}


.checkbox.has-interacted input:not(:checked)+.checkbox-box svg .check-path {
    stroke-dashoffset: 28;
    opacity: 0;
    transition: stroke-dashoffset 300ms cubic-bezier(.2, .8, .2, 1) 0ms, opacity 200ms ease 80ms;
}

.checkbox.has-interacted input:not(:checked)+.checkbox-box::before {
    opacity: 0;
    transition-delay: 80ms;
}

.checkbox input:checked+.checkbox-box svg .check-path {
    stroke-dashoffset: 0;
    opacity: 1;
}

.checkbox-box.is-pressed {
    transform: scale(0.96);
}

@keyframes check-bounce {
    0% {
        transform: translateY(0) scale(0.92);
    }

    40% {
        transform: translateY(-12%) scale(1.06);
    }

    70% {
        transform: translateY(6%) scale(0.99);
    }

    100% {
        transform: translateY(0) scale(1);
    }
}

@keyframes uncheck-pop {
    0% {
        transform: translateY(0) scale(1);
    }

    35% {
        transform: translateY(0) scale(0.92);
    }

    100% {
        transform: translateY(0) scale(1);
    }
}

.label {
    font-weight: 700;
    color: var(--color-text, #213547);
}

@media (max-width: 420px) {
    .checkbox {
        gap: 0.45rem;
    }
}
</style>
