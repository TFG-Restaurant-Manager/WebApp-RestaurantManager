<script setup>
import SegmentedButtons from '@/views/components/SegmentedButtons.vue'
import ThemeToggle from '@/views/components/ThemeToggle.vue'
import LangToggle from '@/views/components/LangToggle.vue'
import BaseButton from '@/views/components/BaseButton.vue'
import AuthCard from '@/views/components/AuthCard.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { restaurantService } from '@/services/restaurantService.js'

const { t } = useI18n()
const { user, logout } = useAuth()

/**
 * Llama al servicio para eliminar el restaurante y, si tiene éxito, cierra la sesión.
 * Si `remove()` lanza un error, `logout()` no se ejecuta y la sesión permanece activa.
 * @returns {Promise<void>}
 */
async function unsubscribe() {
  await restaurantService.remove()
  logout() // solo se ejecuta si remove() no lanzó error
}

/** IDs fijos de las secciones, independientes del idioma. */
const SECTION_IDS = ['inicio', 'caracteristicas', 'precios', 'contacto']

/** Opciones de navegación con labels traducidos. Se recalcula al cambiar idioma. */
const NAV_OPTIONS = computed(() => [
  { label: t('nav.inicio'), value: 'inicio' },
  { label: t('nav.caracteristicas'), value: 'caracteristicas' },
  { label: t('nav.precios'), value: 'precios' },
  { label: t('nav.contacto'), value: 'contacto' },
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

/** Controla la visibilidad del dropdown de la AuthCard (login). */
const showAuthCard = ref(false)

/** Controla la visibilidad del menú desplegable del usuario autenticado. */
const showUserMenu = ref(false)

/** Controla la visibilidad del diálogo de confirmación de baja. */
const showConfirm = ref(false)

/** `true` durante 4 s tras eliminar el restaurante correctamente. Muestra el toast de éxito. */
const showUnsubscribeSuccess = ref(false)

/** `true` durante 4 s si falla la eliminación del restaurante. Muestra el toast de error. */
const showUnsubscribeError = ref(false)

/** Alterna la visibilidad del menú de usuario. */
function toggleUserMenu() { showUserMenu.value = !showUserMenu.value }

/** Cierra el menú de usuario. */
function closeUserMenu() { showUserMenu.value = false }

/**
 * Cierra el menú de usuario y muestra el diálogo de confirmación de baja.
 */
function handleUnsubscribe() {
  closeUserMenu()
  showConfirm.value = true
}

/**
 * Confirma la baja: cierra el diálogo, llama a `unsubscribe` y muestra el toast
 * correspondiente según el resultado (éxito o error). El toast se oculta a los 4 s.
 * @returns {Promise<void>}
 */
async function confirmUnsubscribe() {
  showConfirm.value = false
  try {
    await unsubscribe()
    showUnsubscribeSuccess.value = true
    setTimeout(() => { showUnsubscribeSuccess.value = false }, 4000)
  } catch {
    showUnsubscribeError.value = true
    setTimeout(() => { showUnsubscribeError.value = false }, 4000)
  }
}

/**
 * Cierra el menú de usuario y ejecuta el logout.
 */
function handleLogout() {
  closeUserMenu()
  logout()
}

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
        <template v-if="user">
          <button class="app-header__user-btn" @click="toggleUserMenu" :aria-expanded="showUserMenu"
            aria-haspopup="true">
            <font-awesome-icon icon="user-circle" class="app-header__user-icon" />
          </button>
          <Transition name="auth-drop">
            <div v-if="showUserMenu" class="app-header__user-menu">
              <button class="user-menu__item user-menu__item--danger" @click="handleUnsubscribe">{{ t('nav.unsubscribe')
                }}</button>
              <button class="user-menu__item" @click="handleLogout">{{ t('nav.logout') }}</button>
            </div>
          </Transition>
        </template>
        <template v-else>
          <BaseButton :label="t('nav.login')" @click="showAuthCard = !showAuthCard" />
          <Transition name="auth-drop">
            <AuthCard v-if="showAuthCard" class="app-header__auth-card" @close="showAuthCard = false" />
          </Transition>
        </template>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showAuthCard || showUserMenu" class="auth-backdrop" @click="showAuthCard = false; closeUserMenu()" />
    </Transition>

    <!-- Unsubscribe toasts -->
    <Transition name="fade">
      <div v-if="showUnsubscribeSuccess" class="unsubscribe-toast unsubscribe-toast--ok">
        ✓ Cuenta eliminada correctamente.
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showUnsubscribeError" class="unsubscribe-toast unsubscribe-toast--err">
        ✕ Error al eliminar la cuenta. Inténtalo de nuevo.
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showConfirm" class="auth-backdrop" @click="showConfirm = false">
        <div class="confirm-dialog" @click.stop>
          <p class="confirm-dialog__title">¿Seguro que quieres darte de baja?</p>
          <p class="confirm-dialog__body">Se eliminarán todos los datos del restaurante y no podrás recuperarlos.</p>
          <div class="confirm-dialog__actions">
            <button class="confirm-dialog__btn confirm-dialog__btn--cancel"
              @click="showConfirm = false">Cancelar</button>
            <button class="confirm-dialog__btn confirm-dialog__btn--danger" @click="confirmUnsubscribe">Sí, borrar y
              darme
              de baja</button>
          </div>
        </div>
      </div>
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

/* ── User avatar button ── */
.app-header__user-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  color: var(--color-text, #111);
  border-radius: 50%;
  transition: opacity 0.15s;
}

.app-header__user-btn:hover {
  opacity: 0.65;
}

.app-header__user-icon {
  font-size: 1.6rem;
}

/* ── User dropdown menu ── */
.app-header__user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  overflow: hidden;
  z-index: 10;
}

.user-menu__item {
  background: none;
  border: none;
  padding: 0.7rem 1rem;
  text-align: left;
  font-size: 0.88rem;
  cursor: pointer;
  color: var(--color-text, #111);
  transition: background 0.12s;
  white-space: nowrap;
}

.user-menu__item:hover {
  background: var(--color-border, #f0f0f0);
}

.user-menu__item--danger {
  color: #d93025;
}

/* ── Backdrop ── */
.auth-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Confirm dialog ── */
.confirm-dialog {
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 14px;
  padding: 1.5rem;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.confirm-dialog__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text, #111);
}

.confirm-dialog__body {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-text-muted, #555);
  line-height: 1.5;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.confirm-dialog__btn {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.confirm-dialog__btn:hover {
  opacity: 0.75;
}

.confirm-dialog__btn--cancel {
  background: none;
  border: 1px solid var(--color-border, #e0e0e0);
  color: var(--color-text, #111);
}

.confirm-dialog__btn--danger {
  background: #d93025;
  color: #fff;
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

/* ── Unsubscribe toasts ── */
.unsubscribe-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 400;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
}

.unsubscribe-toast--ok {
  background: #d1fae5;
  color: #065f46;
}

.unsubscribe-toast--err {
  background: #fee2e2;
  color: #991b1b;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .app-header {
    flex-direction: row;
    flex-wrap: wrap;
    height: auto;
    padding: 0.5rem 0.75rem 0.6rem;
    row-gap: 0.55rem;
    column-gap: 0.35rem;
    align-items: center;
  }


  .app-header__logo {
    flex: 1;
  }


  .app-header__right {
    flex-direction: row-reverse;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
    flex: 0;
  }

  .app-header__nav {
    order: 99;
    flex-basis: 100%;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    padding-top: 0.5rem;
    z-index: 100;
  }

  .app-header__nav::-webkit-scrollbar {
    display: none;
  }

  :deep(.segmented-buttons) {
    width: 100%;
  }

  :deep(.seg-btn) {
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .app-header__user-menu {
    right: 0;
  }
}
</style>
