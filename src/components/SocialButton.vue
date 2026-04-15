<script setup>
import { computed } from 'vue'

const props = defineProps({
    label: { type: String, required: true },
    icon: { type: String, default: '' },
    hoverBg: { type: String, default: '' },
    hoverWidth: { type: String, default: '6rem' }
})

const emit = defineEmits(['click'])

function pressAnimation(element) {
    if (element) {
        element.classList.remove('is-pressed')
        void element.offsetWidth
        element.classList.add('is-pressed')
    }
}

function pointerDown(event) {
    pressAnimation(event.currentTarget)
}

function handleClick(event) {
    emit('click', event)
}

function onAnimationEnd(event) {
    const element = (event && event.currentTarget) || (event && event.target) || null
    if (element && element.classList) element.classList.remove('is-pressed')
}

const styleVars = computed(() => ({
    '--hover-bg': props.hoverBg || 'transparent',
    '--hover-width': props.hoverWidth || '6rem'
}))
</script>

<template>
    <button class="social-btn boton1" type="button" :style="styleVars" @pointerdown="pointerDown"
        @touchstart.passive="pointerDown" @click="handleClick" @animationend="onAnimationEnd">
        <div class="divIcono">
            <i :class="icon" aria-hidden="true"></i>
            <h3>{{ label }}</h3>
        </div>
    </button>
</template>

<style scoped>
.social-btn {
    background-color: var(--color-surface, #ffffff);
    color: var(--social-text, #111);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    padding: 0.9rem 1rem;
    box-shadow: 0 10px 24px rgba(33, 53, 71, 0.06);
    transition: all 0.28s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    position: relative;
    z-index: 1;
}

.social-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--hover-bg, rgba(0, 0, 0, 0.04));
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0;
    pointer-events: none;
    transition: opacity 220ms cubic-bezier(.2, .8, .2, 1), transform 220ms cubic-bezier(.2, .8, .2, 1);
    will-change: opacity, transform;
    transform: translateZ(0);
    z-index: 0;
}

.divIcono {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 1.2rem;
    overflow: hidden;
    transition: width 0.28s ease;
    position: relative;
    z-index: 2;
}

.social-btn:hover .divIcono {
    width: var(--hover-width, 6rem);
}

.divIcono i {
    font-size: 1rem;
    display: inline-block;
    color: currentColor;
    transition: color 0.18s ease, opacity 0.18s ease;
}

.divIcono h3 {
    opacity: 0;
    pointer-events: none;
    clip-path: inset(0 100% 0 0);
    transition: opacity 0.28s ease, clip-path 0.28s ease;
    margin: 0;
    font-size: 0.75rem;
}

.social-btn:hover .divIcono h3 {
    opacity: 1;
    pointer-events: auto;
    clip-path: inset(0 0 0 0);
}

.social-btn:hover::before {
    opacity: 1;
}

.social-btn:hover {
    color: white;
    border-color: rgba(0, 0, 0, 0.06);
    box-shadow: 0 18px 42px rgba(33, 53, 71, 0.14);
    z-index: 5;
}

.social-btn.is-pressed {
    animation: clickScale 0.28s;
    z-index: 6;
}

@keyframes clickScale {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.95);
    }

    100% {
        transform: scale(1);
    }
}
</style>
