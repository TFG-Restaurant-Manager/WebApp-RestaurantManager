<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Button',
  },
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'outline'
  },
})

const emit = defineEmits(['click'])

function handlePress(e) {
  const el = e.currentTarget
  el.classList.remove('is-pressed')
  void el.offsetWidth
  el.classList.add('is-pressed')
  emit('click', e)
}

function onAnimationEnd(e) {
  const el = (e && e.currentTarget) || (e && e.target) || null
  if (el && el.classList) el.classList.remove('is-pressed')
}
</script>

<template>
  <button
    :class="['base-button', `base-button--${props.variant}`]"
    type="button"
    @click="handlePress"
    @animationend="onAnimationEnd"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
.base-button {
  --btn-scale: 1;

  padding: 0.55rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    transform 450ms cubic-bezier(.2,.8,.2,1),
    box-shadow 450ms cubic-bezier(.2,.8,.2,1);
  user-select: none;
  will-change: transform, box-shadow;
  transform: scale(var(--btn-scale, 1));
}

/* ── Primary ── */
.base-button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
  box-shadow: 0 4px 12px var(--color-primary-shadow);
}

.base-button--primary:hover {
  background-color: var(--color-primary-dark);
  --btn-scale: 1.06;
  transform: scale(1.06);
  box-shadow: 0 6px 18px var(--color-primary-shadow);
}

/* ── Outline ── */
.base-button--outline {
  background-color: transparent;
  color: var(--color-text, #111);
  border: 1px solid var(--color-border, #e0e0e0);
  box-shadow: none;
}

.base-button--outline:hover {
  background-color: rgba(0, 0, 0, 0.04);
  --btn-scale: 1.03;
  transform: scale(1.03);
}

.base-button.is-pressed {
  animation: press 300ms cubic-bezier(.2,.8,.2,1) both;
}

@keyframes press {
  0% {
    transform: scale(var(--btn-scale, 1));
    box-shadow: 0 6px 18px var(--color-primary-shadow);
  }
  35% {
    transform: scale(calc(var(--btn-scale, 1) * 0.94)) translateY(1px);
    box-shadow: 0 3px 8px var(--color-primary-shadow);
  }
  100% {
    transform: scale(var(--btn-scale, 1));
    box-shadow: 0 6px 18px var(--color-primary-shadow);
  }
}
</style>
