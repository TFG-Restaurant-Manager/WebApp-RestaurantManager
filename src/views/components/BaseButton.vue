<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Button',
  },
})

const emit = defineEmits(['click'])

function handlePress(e) {
  const el = e.currentTarget; // el boton
  el.classList.remove('is-pressed');
  void el.offsetWidth;
  el.classList.add('is-pressed');
}

function onAnimationEnd(e) {
  const el = (e && e.currentTarget) || (e && e.target) || null
  if (el && el.classList) el.classList.remove('is-pressed')
}
</script>

<template>
  <button
    class="base-button"
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
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--color-primary-shadow);
  transition:
    background-color 180ms ease,
    transform 450ms cubic-bezier(.2,.8,.2,1),
    box-shadow 450ms cubic-bezier(.2,.8,.2,1);
  user-select: none;
  will-change: transform, box-shadow;
  transform: scale(var(--btn-scale, 1));
}

.base-button:hover {
  background-color: var(--color-primary-dark);
  /* set the variable for pressed calculations, but also set transform
     directly so the hover transition animates smoothly */
  --btn-scale: 1.06;
  transform: scale(1.06);
  box-shadow: 0 6px 18px var(--color-primary-shadow);
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
