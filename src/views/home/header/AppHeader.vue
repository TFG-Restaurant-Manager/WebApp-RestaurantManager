<script setup>
import SegmentedButtons from '@/views/components/SegmentedButtons.vue'
import ThemeToggle from '@/views/components/ThemeToggle.vue'
import LangToggle from '@/views/components/LangToggle.vue'
import BaseButton from '@/views/components/BaseButton.vue'
import AuthCard from '@/views/components/AuthCard.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()

/** IDs fijos de las secciones, independientes del idioma. */
const SECTION_IDS = ['inicio', 'caracteristicas', 'precios', 'contacto']

/** Opciones de navegación con labels traducidos. Se recalcula al cambiar idioma. */
const NAV_OPTIONS = computed(() => [
  { label: t('nav.inicio'),          value: 'inicio' },
  { label: t('nav.caracteristicas'), value: 'caracteristicas' },
  { label: t('nav.precios'),         value: 'precios' },
  { label: t('nav.contacto'),        value: 'contacto' },
])

/**
 * Estado interno del botón activo como ID de sección (locale-independiente).
 * Se traduce a label bajo demanda para pasarlo a SegmentedButtons.
 */
const activeValue = ref('inicio')

/**
 * Label activo derivado de `activeValue`.
 * El setter convierte el label emitido por SegmentedButtons de vuelta a value.
 */
const activeLabel = computed({
  get: () => NAV_OPTIONS.value.find(o => o.value === activeValue.value)?.label ?? '',
  set: (label) => {
    const opt = NAV_OPTIONS.value.find(o => o.label === label)
    if (opt) activeValue.value = opt.value
  },
})

/** Altura del header en px, usada como offset al calcular la sección visible. */
const HEADER_HEIGHT = 60

/**
 * Bandera que indica que el scroll fue iniciado por el usuario al pulsar un botón.
 * Mientras está activa, `updateActive` no modifica `activeValue` para evitar parpadeos.
 */
let programmingScroll = false

/** Timer que desactiva `programmingScroll` una vez termina la animación de scroll suave. */
let scrollEndTimer = null

const showAuthCard = ref(false)

/**
 * Calcula qué sección está actualmente visible y actualiza `activeValue`.
 * Se ignora si `programmingScroll` está activo (scroll iniciado por clic en nav).
 */
function updateActive() {
  if (!programmingScroll) {
    const sections = SECTION_IDS.map(id => ({
      id,
      el: document.getElementById(id),
    })).filter(s => s.el)

    const mid = window.scrollY + HEADER_HEIGHT + window.innerHeight * 0.35

    let current = sections[0].id
    for (const { id, el } of sections) {
      if (el.offsetTop <= mid) current = id
    }

    if (current !== activeValue.value) activeValue.value = current
  }
}

onMounted(() => window.addEventListener('scroll', updateActive, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('scroll', updateActive)
  clearTimeout(scrollEndTimer)
})

/**
 * Maneja el clic en un botón de navegación.
 * Fija el botón activo inmediatamente y desplaza suavemente a la sección correspondiente.
 * Bloquea `updateActive` durante ~900ms para evitar que el scroll intermedio revierta el activo.
 * @param {string} label - Label del botón pulsado (en el idioma actual).
 */
function onNavChange(label) {
  const opt = NAV_OPTIONS.value.find(o => o.label === label)
  if (opt) {
    activeValue.value = opt.value
    programmingScroll = true
    clearTimeout(scrollEndTimer)

    document.getElementById(opt.value)?.scrollIntoView({ behavior: 'smooth' })

    scrollEndTimer = setTimeout(() => {
      programmingScroll = false
    }, 900)
  }
}
</script>

<template>
  <header class="app-header">
    <!-- Logo (izquierda) -->
    <div class="app-header__logo">
      <!-- Sustituir por <img> cuando esté disponible el logo -->
      <span class="app-header__logo-text">Restaurant<strong>Manager</strong></span>
    </div>

    <!-- Navegación + toggle de tema (derecha) -->
    <div class="app-header__right">
      <nav class="app-header__nav">
        <SegmentedButtons v-model="activeLabel" :options="NAV_OPTIONS" @change="onNavChange" />
      </nav>
      <ThemeToggle />
      <LangToggle />

      <!-- Login button + dropdown card -->
      <div class="app-header__auth-wrap">
        <BaseButton :label="t('nav.login')" @click="showAuthCard = !showAuthCard" />
        <Transition name="auth-drop">
          <AuthCard v-if="showAuthCard" class="app-header__auth-card" @close="showAuthCard = false" />
        </Transition>
      </div>
    </div>

    <!-- Backdrop: closes the card when clicking outside -->
    <Transition name="fade">
      <div v-if="showAuthCard" class="auth-backdrop" @click="showAuthCard = false" />
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  min-height: 60px;
  background: var(--color-bg, #fff);
  border-bottom: 1px solid var(--color-border, #e0e0e0);
}

/* ── Logo ── */
.app-header__logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.app-header__logo-text {
  font-size: 1.1rem;
  letter-spacing: -0.3px;
  color: var(--color-text, #111);
}

.app-header__logo-text strong {
  font-weight: 800;
}

/* ── Nav + toggle ── */
.app-header__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-header__nav {
  display: flex;
  align-items: center;
}

/* ── Auth wrap + dropdown ── */
.app-header__auth-wrap {
  position: relative;
  flex-shrink: 0;
  z-index: 200;
}

.app-header__auth-card {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 10;
}

/* ── Backdrop ── */
.auth-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}

/* ── Transitions ── */
.auth-drop-enter-active,
.auth-drop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(.2, .8, .2, 1);
}

.auth-drop-enter-from,
.auth-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .app-header {
    flex-direction: column;
    height: auto;
    padding: 0.6rem 1rem;
    gap: 0.5rem;
    align-items: stretch;
  }

  .app-header__logo {
    justify-content: center;
  }

  .app-header__right {
    width: 100%;
    justify-content: center;
  }

  .app-header__nav {
    width: 100%;
  }

  :deep(.segmented-buttons) {
    width: 100%;
  }

  :deep(.seg-btn) {
    padding: 0.35rem 0.5rem;
    font-size: 0.78rem;
  }
}
</style>
