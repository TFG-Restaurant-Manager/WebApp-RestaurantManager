<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { useI18n } from 'vue-i18n'
import SegmentedButtons from '@/views/components/SegmentedButtons.vue'

const emit = defineEmits(['close'])

const { login, register, loading, error } = useAuth()
const { t } = useI18n()

const mode = ref('login')
const form = ref({ name: '', email: '', password: '', passwordConfirm: '' })
const validationError = ref(null)

const isLogin = computed(() => mode.value === 'login')

const TAB_OPTIONS = computed(() => [
  { label: t('auth.tabLogin') },
  { label: t('auth.tabRegister') },
])

const activeTabLabel = computed({
  get: () => isLogin.value ? t('auth.tabLogin') : t('auth.tabRegister'),
  set: (label) => {
    const newMode = label === t('auth.tabLogin') ? 'login' : 'register'
    switchMode(newMode)
  },
})

function switchMode(newMode) {
  mode.value = newMode
  validationError.value = null
  error.value = null
  form.value = { name: '', email: '', password: '', passwordConfirm: '' }
}

async function submit() {
  validationError.value = null
  error.value = null

  if (!isLogin.value && form.value.password !== form.value.passwordConfirm) {
    validationError.value = t('auth.errorPasswordMismatch')
    return
  }

  const ok = isLogin.value
    ? await login({ email: form.value.email, password: form.value.password })
    : await register({ name: form.value.name, email: form.value.email, password: form.value.password })

  if (ok) emit('close')
}
</script>

<template>
  <div class="auth-card">

    <!-- Tabs -->
    <SegmentedButtons v-model="activeTabLabel" :options="TAB_OPTIONS" />

    <!-- Form -->
    <form class="auth-card__form" @submit.prevent="submit">

      <div v-if="!isLogin" class="auth-card__field">
        <label class="auth-card__label" for="ac-name">{{ t('auth.fieldName') }}</label>
        <input
          id="ac-name"
          v-model="form.name"
          class="auth-card__input"
          type="text"
          :placeholder="t('auth.fieldNamePlaceholder')"
          autocomplete="name"
          required
        />
      </div>

      <div class="auth-card__field">
        <label class="auth-card__label" for="ac-email">{{ t('auth.fieldEmail') }}</label>
        <input
          id="ac-email"
          v-model="form.email"
          class="auth-card__input"
          type="email"
          :placeholder="t('auth.fieldEmailPlaceholder')"
          autocomplete="email"
          required
        />
      </div>

      <div class="auth-card__field">
        <label class="auth-card__label" for="ac-password">{{ t('auth.fieldPassword') }}</label>
        <input
          id="ac-password"
          v-model="form.password"
          class="auth-card__input"
          type="password"
          :placeholder="t('auth.fieldPasswordPlaceholder')"
          :autocomplete="isLogin ? 'current-password' : 'new-password'"
          required
        />
      </div>

      <div v-if="!isLogin" class="auth-card__field">
        <label class="auth-card__label" for="ac-password-confirm">{{ t('auth.fieldPasswordConfirm') }}</label>
        <input
          id="ac-password-confirm"
          v-model="form.passwordConfirm"
          class="auth-card__input"
          type="password"
          :placeholder="t('auth.fieldPasswordConfirmPlaceholder')"
          autocomplete="new-password"
          required
        />
      </div>

      <p v-if="validationError || error" class="auth-card__error">
        {{ validationError || error }}
      </p>

      <button type="submit" class="auth-card__submit" :disabled="loading">
        <span v-if="loading" class="auth-card__spinner" />
        <span v-else>{{ isLogin ? t('auth.submitLogin') : t('auth.submitRegister') }}</span>
      </button>

    </form>
  </div>
</template>

<style scoped>
.auth-card {
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 16px;
  padding: 1.5rem;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* ── Form ── */
.auth-card__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-card__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.auth-card__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text, #111);
}

.auth-card__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 8px;
  font-size: 0.92rem;
  color: var(--color-text, #111);
  background: var(--color-bg, #fff);
  outline: none;
  transition: border-color 0.15s;
}

.auth-card__input:focus {
  border-color: var(--color-border-focus, #111);
}

.auth-card__error {
  margin: 0;
  font-size: 0.82rem;
  color: #d93025;
  background: #fce8e6;
  border-radius: 6px;
  padding: 0.45rem 0.7rem;
}

.auth-card__submit {
  margin-top: 0.1rem;
  padding: 0.7rem;
  background: var(--color-primary, #111);
  color: var(--color-text-on-primary, #fff);
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.15s;
}

.auth-card__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-card__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-text-on-primary, #fff);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
