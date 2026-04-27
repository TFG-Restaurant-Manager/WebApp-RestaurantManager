<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <section id="caracteristicas" class="features">
        <div class="features__header">
            <span class="features__label">{{ t('features.label') }}</span>
            <h2 class="features__title">{{ t('features.title') }}</h2>
            <p class="features__subtitle">{{ t('features.subtitle') }}</p>
        </div>

        <div class="features__grid">
            <div class="feature-card">
                <div class="feature-icon-title">
                    <span class="feature-card__icon"><font-awesome-icon icon="utensils" /></span>
                    <h3 class="feature-card__title">{{ t('features.items.0.title') }}</h3>
                </div>
                <p class="feature-card__description">{{ t('features.items.0.description') }}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-title">
                    <span class="feature-card__icon"><font-awesome-icon icon="clipboard-list" /></span>
                    <h3 class="feature-card__title">{{ t('features.items.1.title') }}</h3>
                </div>
                <p class="feature-card__description">{{ t('features.items.1.description') }}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-title">
                    <span class="feature-card__icon"><font-awesome-icon icon="paintbrush" /></span>
                    <h3 class="feature-card__title">{{ t('features.items.2.title') }}</h3>
                </div>
                <p class="feature-card__description">{{ t('features.items.2.description') }}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-title">
                    <span class="feature-card__icon"><font-awesome-icon icon="clock" /></span>
                    <h3 class="feature-card__title">{{ t('features.items.3.title') }}</h3>
                </div>
                <p class="feature-card__description">{{ t('features.items.3.description') }}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-title">
                    <span class="feature-card__icon"><font-awesome-icon icon="chart-bar" /></span>
                    <h3 class="feature-card__title">{{ t('features.items.4.title') }}</h3>
                </div>
                <p class="feature-card__description">{{ t('features.items.4.description') }}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-title">
                    <span class="feature-card__icon"><font-awesome-icon icon="user-shield" /></span>
                    <h3 class="feature-card__title">{{ t('features.items.5.title') }}</h3>
                </div>
                <p class="feature-card__description">{{ t('features.items.5.description') }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.features {
    padding: 6rem 6rem;
    background: var(--color-bg-subtle, #f5f5f5);
}

/* ── Header ── */
.features__header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 4rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.features__label {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--color-text-muted, #666);
}

.features__title {
    margin: 0;
    font-size: clamp(1.7rem, 3vw, 2.3rem);
    font-weight: 800;
    letter-spacing: -0.8px;
    color: var(--color-text, #111);
    line-height: 1.2;
}

.features__subtitle {
    margin: 0;
    font-size: 1rem;
    color: var(--color-text-muted, #666);
    line-height: 1.6;
}

/* ── Grid ── */
.features__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    max-width: 1100px;
    margin: 0 auto;
}

/* ── Card ── */
.feature-card {
    background: var(--color-bg, #fff);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: 14px;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    transition: box-shadow 0.2s;
}

.feature-icon-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
}

.feature-card:hover {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
}

.feature-card__icon {
    display: block;
    font-size: 1.6rem;
    line-height: 1;
    color: var(--color-text, #111);
}

.feature-card__icon svg {
    width: 1.6rem;
    height: 1.6rem;
}

.feature-card__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text, #111);
}

.feature-card__description {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--color-text-muted, #666);
}

@media (max-width: 900px) {
    .features {
        padding: 4rem 2rem;
    }
}
</style>
