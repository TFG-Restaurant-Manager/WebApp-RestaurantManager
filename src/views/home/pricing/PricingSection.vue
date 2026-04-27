<script setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '@/views/components/BaseButton.vue'
const { t } = useI18n()
</script>

<template>
  <section id="precios" class="pricing">
    <div class="pricing__header">
      <span class="pricing__label">{{ t('pricing.label') }}</span>
      <h2 class="pricing__title">{{ t('pricing.title') }}</h2>
      <p class="pricing__subtitle">{{ t('pricing.subtitle') }}</p>
    </div>

    <div class="pricing__grid">

      <!-- Free -->
      <div class="plan-card">
        <div class="plan-card__top">
          <h3 class="plan-card__name">{{ t('pricing.plans.0.name') }}</h3>
          <div class="plan-card__price-row">
            <span class="plan-card__price">{{ t('pricing.plans.0.price') }}</span>
            <span class="plan-card__period">{{ t('pricing.plans.0.period') }}</span>
          </div>
          <p class="plan-card__description">{{ t('pricing.plans.0.description') }}</p>
        </div>
        <ul class="plan-card__features">
          <li v-for="j in 4" :key="j" class="plan-card__feature">
            <font-awesome-icon icon="check" class="plan-card__check" />
            {{ t(`pricing.plans.0.features.${j - 1}`) }}
          </li>
        </ul>
        <BaseButton variant="outline" :label="t('pricing.plans.0.cta')" class="plan-card__cta" />
      </div>

      <!-- Pro -->
      <div class="plan-card plan-card--highlighted">
        <div class="plan-card__top">
          <span class="plan-card__badge">{{ t('pricing.popular') }}</span>
          <h3 class="plan-card__name">{{ t('pricing.plans.1.name') }}</h3>
          <div class="plan-card__price-row">
            <span class="plan-card__price">{{ t('pricing.plans.1.price') }}</span>
            <span class="plan-card__period">{{ t('pricing.plans.1.period') }}</span>
          </div>
          <p class="plan-card__description">{{ t('pricing.plans.1.description') }}</p>
        </div>
        <ul class="plan-card__features">
          <li v-for="j in 6" :key="j" class="plan-card__feature">
            <font-awesome-icon icon="check" class="plan-card__check" />
            {{ t(`pricing.plans.1.features.${j - 1}`) }}
          </li>
        </ul>
        <BaseButton variant="primary" :label="t('pricing.plans.1.cta')" class="plan-card__cta" />
      </div>

      <!-- Enterprise -->
      <div class="plan-card">
        <div class="plan-card__top">
          <h3 class="plan-card__name">{{ t('pricing.plans.2.name') }}</h3>
          <div class="plan-card__price-row">
            <span class="plan-card__price">{{ t('pricing.plans.2.price') }}</span>
            <span v-if="t('pricing.plans.2.period')" class="plan-card__period">{{ t('pricing.plans.2.period') }}</span>
          </div>
          <p class="plan-card__description">{{ t('pricing.plans.2.description') }}</p>
        </div>
        <ul class="plan-card__features">
          <li v-for="j in 4" :key="j" class="plan-card__feature">
            <font-awesome-icon icon="check" class="plan-card__check" />
            {{ t(`pricing.plans.2.features.${j - 1}`) }}
          </li>
        </ul>
        <BaseButton variant="outline" :label="t('pricing.plans.2.cta')" class="plan-card__cta" />
      </div>

    </div>
  </section>
</template>

<style scoped>
.pricing {
  padding: 6rem 6rem;
  background: var(--color-bg, #fff);
}

/* ── Header ── */
.pricing__header {
  text-align: center;
  max-width: 500px;
  margin: 0 auto 4rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pricing__label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.pricing__title {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 800;
  letter-spacing: -0.8px;
  color: var(--color-text, #111);
}

.pricing__subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-muted, #666);
}

/* ── Grid ── */
.pricing__grid {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

/* ── Card ── */
.plan-card {
  flex: 1;
  min-width: 260px;
  max-width: 320px;
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--color-bg, #fff);
  position: relative;
}

.plan-card--highlighted {
  border-color: var(--color-primary, #111);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.plan-card__top {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.plan-card__badge {
  display: inline-block;
  width: fit-content;
  padding: 0.2rem 0.7rem;
  background: var(--color-primary, #111);
  color: var(--color-text-on-primary, #fff);
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-bottom: 0.25rem;
}

.plan-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text, #111);
}

.plan-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.plan-card__price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text, #111);
  letter-spacing: -1px;
}

.plan-card__period {
  font-size: 0.85rem;
  color: var(--color-text-muted, #666);
}

.plan-card__description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted, #666);
  line-height: 1.5;
}

/* ── Features ── */
.plan-card__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.plan-card__feature {
  font-size: 0.88rem;
  color: var(--color-text, #111);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.plan-card__check {
  font-size: 0.8rem;
  color: var(--color-text-muted, #555);
  flex-shrink: 0;
}

/* ── CTA ── */
.plan-card__cta :deep(.base-button) {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .pricing {
    padding: 4rem 2rem;
  }
}
</style>
