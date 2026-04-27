<script setup>
import SegmentedButtons from '@/views/components/SegmentedButtons.vue'
import { ref, onMounted, onUnmounted } from 'vue'

/** Opciones de navegación. `label` es el texto visible y `value` el id de la sección destino. */
const NAV_OPTIONS = [
  { label: 'Inicio', value: 'inicio' },
  { label: 'Características', value: 'caracteristicas' },
  { label: 'Precios', value: 'precios' },
  { label: 'Contacto', value: 'contacto' },
]

/** Lookup label → id de sección (para scroll programático). */
const LABEL_TO_ID = Object.fromEntries(NAV_OPTIONS.map(o => [o.label, o.value]))

/** Lookup id de sección → label (para actualizar el botón activo al hacer scroll). */
const ID_TO_LABEL = Object.fromEntries(NAV_OPTIONS.map(o => [o.value, o.label]))

/** Label del botón actualmente activo, sincronizado con la sección visible. */
const activeSection = ref('Inicio')

/** Altura del header en px, usada como offset al calcular la sección visible. */
const HEADER_HEIGHT = 60

/**
 * Bandera que indica que el scroll fue iniciado por el usuario al pulsar un botón.
 * Mientras está activa, `updateActive` no modifica `activeSection` para evitar parpadeos.
 */
let programmingScroll = false

/** Timer que desactiva `programmingScroll` una vez termina la animación de scroll suave. */
let scrollEndTimer = null

/**
 * Calcula qué sección está actualmente visible y actualiza `activeSection`.
 * Se ignora si `programmingScroll` está activo (scroll iniciado por clic en nav).
 */
function updateActive() {
  if (!programmingScroll) {
    const sections = NAV_OPTIONS.map(({ value }) => ({
      id: value,
      el: document.getElementById(value),
    })).filter(s => s.el)

    const mid = window.scrollY + HEADER_HEIGHT + window.innerHeight * 0.35

    let current = sections[0].id
    for (const { id, el } of sections) {
      if (el.offsetTop <= mid) current = id
    }

    const label = ID_TO_LABEL[current]
    if (label && label !== activeSection.value) activeSection.value = label
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
 * @param {string} label - Label del botón pulsado.
 */
function onNavChange(label) {
  const id = LABEL_TO_ID[label]
  if (id) {
    activeSection.value = label
    programmingScroll = true
    clearTimeout(scrollEndTimer)

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

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

    <!-- Navegación (derecha) -->
    <nav class="app-header__nav">
      <SegmentedButtons v-model="activeSection" :options="NAV_OPTIONS" @change="onNavChange" />
    </nav>
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

/* ── Nav ── */
.app-header__nav {
  display: flex;
  align-items: center;
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
