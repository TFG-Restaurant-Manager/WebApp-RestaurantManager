<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

/** Alterna entre español e inglés y persiste la preferencia. */
function toggle() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('lang', locale.value)
}
</script>

<template>
  <button
    class="lang-toggle"
    :aria-label="locale === 'es' ? 'Switch to English' : 'Cambiar a Español'"
    @click="toggle"
  >
    {{ locale === 'es' ? 'EN' : 'ES' }}
  </button>
</template>

<style scoped>
.lang-toggle {
  background: none;
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--color-text-muted, #666);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.lang-toggle:hover {
  background: var(--color-bg-subtle, #f5f5f5);
  color: var(--color-text, #111);
}
</style>
