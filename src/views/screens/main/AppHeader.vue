<script setup>
import { ref } from 'vue'
import { authStore } from '../../../stores/authStore'
import AuthModal from './AuthModal.vue'

const props = defineProps({
  /** Slug del restaurante activo, necesario para vincular el registro al restaurante. */
  restaurantId: { type: String, required: true },
})

const emit = defineEmits(['toggle'])

const modalOpen = ref(false)
</script>

<template>
  <header class="app-header">
    <!-- Botón hamburguesa del menú lateral -->
    <button class="app-header__menu" @click="emit('toggle')" aria-label="Abrir menú" type="button">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <span class="app-header__title">Restaurant Manager</span>

    <!-- Zona auth: a la derecha -->
    <div class="app-header__auth">
      <!-- Sesión activa: muestra el email y permite cerrar sesión -->
      <template v-if="authStore.state.user">
        <span class="app-header__username">{{ authStore.state.user.email }}</span>
        <button class="app-header__auth-btn" @click="authStore.logout()" type="button">Cerrar sesión</button>
      </template>

      <!-- Sin sesión: abre el modal -->
      <button v-else class="app-header__auth-btn" @click="modalOpen = true" type="button">
        Iniciar sesión
      </button>
    </div>

    <!-- Modal de login / register, vinculado al restaurante activo -->
    <AuthModal
      :open="modalOpen"
      :restaurant-id="restaurantId"
      @close="modalOpen = false"
    />
  </header>
</template>

<style scoped>
.app-header {
  height: 56px;
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 2px 8px var(--color-primary-shadow);
}

.app-header__menu {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.app-header__menu span {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  margin: 3px 0;
  border-radius: 2px;
}

.app-header__title {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* Zona auth: empuja al extremo derecho */
.app-header__auth {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.app-header__username {
  font-size: 0.82rem;
  opacity: 0.9;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__auth-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: inherit;
  border-radius: 5px;
  padding: 0.3rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 150ms;
}

.app-header__auth-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
