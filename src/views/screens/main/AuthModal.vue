<script setup>
import { ref, watch } from 'vue'
import { authStore } from '../../../stores/authStore'

const props = defineProps({

  restaurantId: { type: String, required: true },

  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])


const tab = ref('login')

const email = ref('')
const password = ref('')

function reset() {
  email.value = ''
  password.value = ''
  authStore.clearError()
}

watch(tab, reset)
watch(() => props.open, (v) => { if (v) reset() })

async function submit() {
  const creds = { email: email.value, password: password.value, restaurantId: props.restaurantId }
  try {
    if (tab.value === 'login') {
      await authStore.login(creds)
    } else {
      await authStore.register(creds)
    }

    emit('close')
  } catch {

  }
}

function close() {
  authStore.clearError()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="auth-overlay" @click.self="close">
      <div class="auth-modal" role="dialog" aria-modal="true">

        <div class="auth-tabs">
          <button class="auth-tab" :class="{ active: tab === 'login' }" @click="tab = 'login'" type="button">Iniciar
            sesión</button>
          <button class="auth-tab" :class="{ active: tab === 'register' }" @click="tab = 'register'"
            type="button">Registrarse</button>
          <button class="auth-close" @click="close" aria-label="Cerrar" type="button">✕</button>
        </div>

        <form class="auth-form" @submit.prevent="submit" novalidate>
          <label class="auth-label">
            Email
            <input v-model="email" class="auth-input" type="email" autocomplete="email" required
              placeholder="correo@ejemplo.com" />
          </label>
          <label class="auth-label">
            Contraseña
            <input v-model="password" class="auth-input" type="password" autocomplete="current-password" required
              placeholder="••••••••" />
          </label>

          <p v-if="authStore.state.error" class="auth-error">{{ authStore.state.error }}</p>

          <button class="auth-submit" type="submit" :disabled="authStore.state.loading">
            <span v-if="authStore.state.loading">Cargando...</span>
            <span v-else>{{ tab === 'login' ? 'Entrar' : 'Crear cuenta' }}</span>
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-modal {
  background: var(--color-surface, #fff);
  border-radius: 10px;
  width: 340px;
  max-width: 95vw;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

/* Tabs */
.auth-tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
  padding-bottom: 0.5rem;
}

.auth-tab {
  flex: 1;
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.4rem 0;
  cursor: pointer;
  color: var(--color-muted, #999);
  border-bottom: 2px solid transparent;
  transition: color 150ms, border-color 150ms;
}

.auth-tab.active {
  color: var(--color-primary, #4a90e2);
  border-bottom-color: var(--color-primary, #4a90e2);
}

.auth-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-muted, #999);
  padding: 0.2rem 0.4rem;
  margin-left: auto;
}

/* Formulario */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.auth-label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--color-muted, #888);
}

.auth-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.15));
  border-radius: 6px;
  font-size: 0.9rem;
  background: var(--color-bg, #f9f9f9);
  color: var(--color-text, #333);
  outline: none;
  transition: border-color 150ms;
}

.auth-input:focus {
  border-color: var(--color-primary, #4a90e2);
}

.auth-error {
  font-size: 0.78rem;
  color: #e53e3e;
  margin: 0;
}

.auth-submit {
  margin-top: 0.25rem;
  padding: 0.6rem;
  border-radius: 6px;
  border: none;
  background: var(--color-primary, #4a90e2);
  color: var(--color-text-on-primary, #fff);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms;
}

.auth-submit:hover:not(:disabled) {
  background: var(--color-primary-dark, #357abd);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
