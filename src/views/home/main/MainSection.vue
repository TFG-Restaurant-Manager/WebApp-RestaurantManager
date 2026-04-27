<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <section id="inicio" class="main">
        <div class="main__content">
            <span class="main__badge">{{ t('main.badge') }}</span>
            <h1 class="main__title">
                {{ t('main.title') }}<br />
                <span class="main__title--accent">{{ t('main.titleAccent') }}</span>
            </h1>
            <p class="main__subtitle">{{ t('main.subtitle') }}</p>
            <div class="main__actions">
                <button class="main__cta main__cta--primary">{{ t('main.ctaPrimary') }}</button>
                <button class="main__cta main__cta--secondary">{{ t('main.ctaSecondary') }}</button>
            </div>
        </div>

        <!-- Mockup visual SUSTITUIR POR IMAGEN DE LA APP -->
        <div class="main__visual">
            <img
                src="@/assets/iMockup - iPhone 16 Pro Max.png"
                :alt="t('main.mockupAlt')"
                class="main__phone"
            />
        </div>
    </section>
</template>

<style scoped>
.main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    padding: 3rem 6rem 5rem;
    background: var(--color-bg, #fff);
    min-height: 85vh;
}

/* ── Content ── */
.main__content {
    flex: 1;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.main__badge {
    display: inline-block;
    width: fit-content;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    border: 1px solid var(--color-border, #e0e0e0);
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-text-muted, #666);
    letter-spacing: 0.3px;
}

.main__title {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--color-text, #111);
    letter-spacing: -1.5px;
}

.main__title--accent {
    color: var(--color-text-muted, #555);
    font-weight: 700;
}

.main__subtitle {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.65;
    color: var(--color-text-muted, #666);
    max-width: 480px;
}

.main__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
}

.main__cta {
    padding: 0.75rem 1.75rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    border: none;
}

.main__cta:hover {
    opacity: 0.85;
}

.main__cta:active {
    transform: scale(0.97);
}

.main__cta--primary {
    background: var(--color-primary, #111);
    color: var(--color-text-on-primary, #fff);
}

.main__cta--secondary {
    background: transparent;
    color: var(--color-text, #111);
    border: 1px solid var(--color-border, #e0e0e0);
}

/* ── Visual / mockup ── */
.main__visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.main__phone {
    max-height: 520px;
    max-width: 100%;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 16px 8px rgba(0,0,0,0.15));
}

.main__mockup {
    width: 100%;
    max-width: 480px;
    border-radius: 14px;
    border: 1px solid var(--color-border, #e0e0e0);
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
}

.main__mockup-bar {
    height: 36px;
    background: var(--color-bg-subtle, #f5f5f5);
    border-bottom: 1px solid var(--color-border, #e0e0e0);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px;
}

.main__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border, #e0e0e0);
}

.main__mockup-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    background: #fff;
}

.main__mockup-row {
    height: 14px;
    border-radius: 6px;
    background: var(--color-bg-subtle, #f0f0f0);
}

.main__mockup-row--wide {
    width: 75%;
}

.main__mockup-row--medium {
    width: 55%;
}

.main__mockup-row--short {
    width: 40%;
}

.main__mockup-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
}

.main__mockup-card {
    height: 60px;
    border-radius: 8px;
    background: var(--color-bg-subtle, #f5f5f5);
    border: 1px solid var(--color-border, #e8e8e8);
}

/* ── Responsive ── */
@media (max-width: 900px) {
    .main {
        flex-direction: column;
        padding: 3rem 2rem;
        text-align: center;
        min-height: unset;
    }

    .main__content {
        max-width: 100%;
        align-items: center;
    }

    .main__subtitle {
        max-width: 100%;
    }

    .main__visual {
        width: 100%;
        justify-content: center;
    }

    .main__phone {
        max-height: 340px;
    }
}
</style>
