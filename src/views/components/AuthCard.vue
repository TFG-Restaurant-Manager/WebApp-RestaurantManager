<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { useI18n } from 'vue-i18n'
// Login-only card (registration removed)

const emit = defineEmits(['close'])

const { login, loading, error } = useAuth()
const { t } = useI18n()

const form = ref({ code: '', password: '' })

async function submit() {
  error.value = null
  const ok = await login({ code: form.value.code, password: form.value.password })
  if (ok) emit('close')
}
</script>

<template>
  <div class="auth-card">

    <!-- Form (login only) -->
    <form class="auth-card__form" @submit.prevent="submit">

      <div class="auth-card__field">
        <label class="auth-card__label" for="ac-code">{{ t('auth.fieldCode') }}</label>
        <input
          id="ac-code"
          v-model="form.code"
          class="auth-card__input"
          type="text"
          :placeholder="t('auth.fieldCodePlaceholder')"
          autocomplete="username"
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
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="error" class="auth-card__error">
        {{ error }}
      </p>

      <button type="submit" class="auth-card__submit" :disabled="loading">
        <span v-if="loading" class="auth-card__spinner" />
        <span v-else>{{ t('auth.submitLogin') }}</span>
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
