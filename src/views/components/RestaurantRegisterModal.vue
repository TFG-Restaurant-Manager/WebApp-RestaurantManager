<script setup>
import { ref, watch, nextTick } from 'vue'
import { loadScript } from '@paypal/paypal-js'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'submit'])

const restPrefix = ref('')
const restName = ref('')
const restDescription = ref('')
const restEmail = ref('')
const restPhone = ref('')
const restAddress = ref('')

const managerName = ref('')
const managerEmail = ref('')
const managerPhone = ref('')
const managerCode = ref('')
const managerPassword = ref('')

const errors = ref({})
const step = ref('form') // 'form' | 'payment'
const pendingPayload = ref(null)
const paypalError = ref(null)

function reset() {
  restPrefix.value = ''
  restName.value = ''
  restDescription.value = ''
  restEmail.value = ''
  restPhone.value = ''
  restAddress.value = ''
  managerName.value = ''
  managerEmail.value = ''
  managerPhone.value = ''
  managerCode.value = ''
  managerPassword.value = ''
  errors.value = {}
  step.value = 'form'
  pendingPayload.value = null
  paypalError.value = null
}

function validate() {
  const e = {}
  if (!restPrefix.value) e.restPrefix = 'Prefijo obligatorio'
  else if (restPrefix.value.length > 5) e.restPrefix = 'Máximo 5 caracteres'
  if (!restName.value) e.restName = 'Nombre del restaurante obligatorio'
  if (!restEmail.value) e.restEmail = 'Email del restaurante obligatorio'
  else if (!/^\S+@\S+\.\S+$/.test(restEmail.value)) e.restEmail = 'Email inválido'
  if (!managerName.value) e.managerName = 'Nombre del gerente obligatorio'
  if (!managerEmail.value) e.managerEmail = 'Email del gerente obligatorio'
  else if (!/^\S+@\S+\.\S+$/.test(managerEmail.value)) e.managerEmail = 'Email inválido'
  if (!managerCode.value) e.managerCode = 'Código de empleado obligatorio'
  else if (!/^\d{1,5}$/.test(managerCode.value)) e.managerCode = 'El código debe ser numérico y tener máximo 5 dígitos'
  if (!managerPassword.value || managerPassword.value.length < 8) e.managerPassword = 'La contraseña debe tener al menos 8 caracteres'
  errors.value = e
  return Object.keys(e).length === 0
}

function close() {
  emit('close')
  reset()
}

function goToPayment() {
  const isValid = validate()
  if (isValid) {
    pendingPayload.value = {
      restaurant: {
        prefix: restPrefix.value,
        name: restName.value,
        description: restDescription.value,
        email: restEmail.value,
        phone: restPhone.value,
        address: restAddress.value,
      },
      employee: {
        name: managerName.value,
        email: managerEmail.value,
        phone: managerPhone.value,
        code: managerCode.value,
        password: managerPassword.value,
      },
    }
    step.value = 'payment'
  }
}

async function renderPayPalButton() {
  paypalError.value = null
  try {
    const paypal = await loadScript({
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ?? 'test',
      vault: 'true',
      intent: 'subscription',
      currency: 'EUR',
    })
    await paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'silver',
        layout: 'vertical',
        label: 'subscribe',
      },
      createSubscription(data, actions) {
        return actions.subscription.create({
          plan_id: import.meta.env.VITE_PAYPAL_PLAN_ID,
        })
      },
      onApprove(data) {
        emit('submit', { ...pendingPayload.value, subscriptionId: data.subscriptionID })
        emit('close')
        reset()
      },
      onError() {
        paypalError.value = 'Error en el pago. Por favor, inténtalo de nuevo.'
      },
    }).render('#paypal-button-container')
  } catch {
    paypalError.value = 'No se pudo cargar PayPal. Comprueba tu conexión.'
  }
}

watch(step, (v) => {
  if (v === 'payment') nextTick(renderPayPalButton)
})

watch(() => props.open, (v) => {
  if (!v) reset()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="props.open" class="register-overlay" @click.self="close">
      <div class="register-modal" role="dialog" aria-modal="true">

        <div class="register-header">
          <h3>Crear cuenta — Registro de restaurante</h3>
          <button class="register-close" @click="close" aria-label="Cerrar" type="button">✕</button>
        </div>

        <!-- Indicador de pasos -->
        <div class="register-steps">
          <span :class="['step', step === 'form' ? 'step--active' : 'step--done']">1. Datos</span>
          <span class="step-sep">→</span>
          <span :class="['step', step === 'payment' ? 'step--active' : '']" >2. Pago</span>
        </div>

        <!-- Paso 1: formulario -->
        <form v-if="step === 'form'" class="register-form" @submit.prevent="goToPayment" novalidate>
          <div class="register-grid">

            <section class="register-section">
              <h4>Datos del restaurante</h4>

              <label class="field">
                Prefijo (máx 5)
                <input v-model="restPrefix" maxlength="5" type="text" required />
                <p v-if="errors.restPrefix" class="field-error">{{ errors.restPrefix }}</p>
              </label>

              <label class="field">
                Nombre del restaurante
                <input v-model="restName" type="text" required />
                <p v-if="errors.restName" class="field-error">{{ errors.restName }}</p>
              </label>

              <label class="field">
                Descripción
                <textarea v-model="restDescription" rows="3" />
              </label>

              <label class="field">
                Email del restaurante
                <input v-model="restEmail" type="email" required />
                <p v-if="errors.restEmail" class="field-error">{{ errors.restEmail }}</p>
              </label>

              <label class="field">
                Teléfono
                <input v-model="restPhone" type="tel" />
              </label>

              <label class="field">
                Dirección
                <input v-model="restAddress" type="text" />
              </label>
            </section>

            <section class="register-section">
              <h4>Datos del gerente (empleado admin)</h4>

              <label class="field">
                Nombre del gerente
                <input v-model="managerName" type="text" required />
                <p v-if="errors.managerName" class="field-error">{{ errors.managerName }}</p>
              </label>

              <label class="field">
                Email del gerente
                <input v-model="managerEmail" type="email" required />
                <p v-if="errors.managerEmail" class="field-error">{{ errors.managerEmail }}</p>
              </label>

              <label class="field">
                Teléfono
                <input v-model="managerPhone" type="tel" />
              </label>

              <label class="field">
                Código de empleado
                <input v-model="managerCode" type="text" placeholder="Ej: REST001" />
                <p v-if="errors.managerCode" class="field-error">{{ errors.managerCode }}</p>
                <p class="field-hint">Este será el código con el que el gerente inicia sesión</p>
              </label>

              <label class="field">
                Contraseña
                <input v-model="managerPassword" type="password" required />
                <p v-if="errors.managerPassword" class="field-error">{{ errors.managerPassword }}</p>
              </label>
            </section>

          </div>

          <div class="register-actions">
            <button type="button" class="btn-cancel" @click="close">Cancelar</button>
            <button type="submit" class="btn-primary">Continuar al pago →</button>
          </div>
        </form>

        <!-- Paso 2: pago con PayPal -->
        <div v-if="step === 'payment'" class="payment-step">
          <p class="payment-summary">Plan <strong>Pro · 29€/mes</strong></p>
          <div id="paypal-button-container" class="paypal-container" />
          <p v-if="paypalError" class="field-error payment-error">{{ paypalError }}</p>
          <div class="register-actions">
            <button type="button" class="btn-cancel" @click="step = 'form'">← Volver</button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.register-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-modal {
  background: var(--color-surface, #fff);
  border-radius: 10px;
  width: 880px;
  max-width: 95vw;
  padding: 1.25rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.18);
}

.register-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.register-header h3 { margin: 0; font-size: 1.05rem }
.register-close { margin-left: auto; background: none; border: none; font-size: 1rem; cursor: pointer }

.register-form { display: flex; flex-direction: column; gap: 1rem }
.register-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem }
.register-section h4 { margin: 0 0 0.5rem 0 }
.field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.4rem }
.field input, .field textarea { padding: 0.5rem; border: 1px solid var(--color-border, #e0e0e0); border-radius: 6px }
.field-error { color: #d93025; font-size: 0.85rem; margin: 0 }
.field-hint { font-size: 0.8rem; color: var(--color-text-muted, #666); margin: 0 }

.code-row { display: flex; gap: 0.5rem }
.code-row input { flex: 1 }

.register-steps { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem }
.step { font-size: 0.82rem; font-weight: 600; color: var(--color-text-muted, #999) }
.step--active { color: var(--color-primary, #111) }
.step--done { color: var(--color-text-muted, #999) }
.step-sep { color: var(--color-text-muted, #ccc) }

.payment-step { display: flex; flex-direction: column; gap: 1rem; padding: 0.5rem 0 }
.payment-summary { margin: 0; font-size: 0.95rem }
.paypal-container { min-height: 48px }
.payment-error { margin-top: 0.25rem }

.register-actions { display: flex; justify-content: flex-end; gap: 0.5rem }
.btn-cancel { padding: 0.5rem 0.8rem; border-radius: 6px; border: 1px solid var(--color-border, #e0e0e0); background: none }
.btn-primary { padding: 0.55rem 0.9rem; border-radius: 6px; border: none; background: var(--color-primary, #111); color: #fff }

@media (max-width: 900px) {
  .register-modal { width: 95vw }
  .register-grid { grid-template-columns: 1fr }
}
</style>
