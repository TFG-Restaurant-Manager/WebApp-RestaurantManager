<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const form = ref({ name: '', email: '', message: '' })
const sent = ref(false)

function submit() {
  // TODO: conectar con backend o servicio de email
  sent.value = true
}
</script>

<template>
  <section id="contacto" class="contact">
    <div class="contact__inner">
      <div class="contact__info">
        <span class="contact__label">{{ t('contact.label') }}</span>
        <h2 class="contact__title">{{ t('contact.title') }}</h2>
        <p class="contact__subtitle">{{ t('contact.subtitle') }}</p>
        <a class="contact__email" href="mailto:hola@restaurantmanager.app">
          hola@restaurantmanager.app
        </a>
      </div>

      <div class="contact__form-wrap">
        <div v-if="sent" class="contact__sent">
          <font-awesome-icon icon="check" class="contact__sent-icon" />
          <p>{{ t('contact.sent') }}</p>
        </div>

        <form v-else class="contact__form" @submit.prevent="submit">
          <div class="contact__field">
            <label class="contact__field-label" for="c-name">{{ t('contact.fields.name') }}</label>
            <input
              id="c-name"
              v-model="form.name"
              class="contact__input"
              type="text"
              :placeholder="t('contact.fields.namePlaceholder')"
              required
            />
          </div>
          <div class="contact__field">
            <label class="contact__field-label" for="c-email">{{ t('contact.fields.email') }}</label>
            <input
              id="c-email"
              v-model="form.email"
              class="contact__input"
              type="email"
              :placeholder="t('contact.fields.emailPlaceholder')"
              required
            />
          </div>
          <div class="contact__field">
            <label class="contact__field-label" for="c-msg">{{ t('contact.fields.message') }}</label>
            <textarea
              id="c-msg"
              v-model="form.message"
              class="contact__input contact__textarea"
              :placeholder="t('contact.fields.messagePlaceholder')"
              rows="5"
              required
            />
          </div>
          <button type="submit" class="contact__submit">{{ t('contact.submit') }}</button>
        </form>
      </div>
    </div>

    <!-- Footer mínimo -->
    <div class="contact__footer">
      <span>{{ t('contact.footer', { year: new Date().getFullYear() }) }}</span>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 6rem 6rem 3rem;
  background: var(--color-bg-subtle, #f5f5f5);
}

.contact__inner {
  display: flex;
  gap: 5rem;
  max-width: 1000px;
  margin: 0 auto;
  align-items: flex-start;
}

/* ── Info ── */
.contact__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact__label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.contact__title {
  margin: 0;
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.8px;
  color: var(--color-text, #111);
  line-height: 1.2;
}

.contact__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted, #666);
  line-height: 1.65;
}

.contact__email {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text, #111);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Form ── */
.contact__form-wrap {
  flex: 1;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contact__field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text, #111);
}

.contact__input {
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e0e0e0);
  background: var(--color-bg, #fff);
  font-size: 0.9rem;
  color: var(--color-text, #111);
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  resize: none;
}
.contact__input:focus {
  border-color: var(--color-border-focus, #111);
}

.contact__textarea {
  min-height: 120px;
}

.contact__submit {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: var(--color-primary, #111);
  color: var(--color-text-on-primary, #fff);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  align-self: flex-start;
}
.contact__submit:hover { opacity: 0.8; }

/* ── Sent ── */
.contact__sent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 14px;
  background: var(--color-bg, #fff);
  text-align: center;
  color: var(--color-text-muted, #666);
  font-size: 0.95rem;
}
.contact__sent-icon {
  font-size: 2rem;
}

/* ── Footer ── */
.contact__footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border, #e0e0e0);
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-muted, #666);
}

@media (max-width: 900px) {
  .contact { padding: 4rem 2rem 2rem; }
  .contact__inner { flex-direction: column; gap: 2.5rem; }
}
</style>
