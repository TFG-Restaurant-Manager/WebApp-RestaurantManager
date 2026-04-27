<script setup>
import { useTheme } from '@/composables/useTheme.js'

/** @type {{ isDark: import('vue').Ref<boolean>, toggle: () => void }} */
const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="toggle"
  >
    <span class="theme-toggle__wrap">

      <!-- Sol — visible en modo claro -->
      <svg
        class="theme-toggle__icon theme-toggle__icon--sun"
        :class="{ 'theme-toggle__icon--out': isDark }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1"    x2="12" y2="3" />
        <line x1="12" y1="21"   x2="12" y2="23" />
        <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1"  y1="12" x2="3"  y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
        <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
      </svg>

      <!-- Luna — visible en modo oscuro -->
      <svg
        class="theme-toggle__icon theme-toggle__icon--moon"
        :class="{ 'theme-toggle__icon--out': !isDark }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  color: var(--color-text, #111);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.theme-toggle:hover {
  background: var(--color-bg-subtle, #f5f5f5);
}

/* Contenedor con dimensiones fijas para superponer los dos SVG */
.theme-toggle__wrap {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
}

/* Base común para ambos iconos */
.theme-toggle__icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition:
    opacity 0.35s ease,
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Estado oculto: sale girando hacia la derecha */
.theme-toggle__icon--out {
  opacity: 0;
  pointer-events: none;
  transform: rotate(90deg) scale(0.35);
}

/* La luna sale girando hacia la izquierda (dirección contraria al sol) */
.theme-toggle__icon--moon.theme-toggle__icon--out {
  transform: rotate(-90deg) scale(0.35);
}
</style>
