import { ref, watch } from 'vue'

/** Preferencia del sistema operativo del usuario (prefers-color-scheme). */
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

/** Tema almacenado previamente por el usuario. `null` si nunca lo ha elegido. */
const stored = localStorage.getItem('theme')

/**
 * Estado global del tema. `true` = oscuro, `false` = claro.
 * Es un singleton a nivel de módulo: todos los componentes comparten la misma ref.
 */
const isDark = ref(stored !== null ? stored === 'dark' : prefersDark)

/**
 * Aplica el tema al elemento `<html>` vía `data-theme` y lo persiste en localStorage.
 * Añade temporalmente la clase `theme-transitioning` para que el cambio de colores sea animado.
 * @param {boolean} dark - `true` para modo oscuro, `false` para modo claro.
 */
function applyTheme(dark) {
  document.documentElement.classList.add('theme-transitioning')
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400)
}

// Aplica el tema almacenado (o el del sistema) al iniciar la app
applyTheme(isDark.value)

// Sincroniza automáticamente cada vez que cambia el estado
watch(isDark, applyTheme)

/**
 * Composable para gestionar el tema claro/oscuro.
 * El estado es un singleton: todas las llamadas a `useTheme()` devuelven la misma ref.
 * @returns {{ isDark: import('vue').Ref<boolean>, toggle: () => void }}
 */
export function useTheme() {
  /** Alterna entre modo claro y oscuro. */
  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
