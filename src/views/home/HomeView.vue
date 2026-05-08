<script setup>
import AppHeader from './header/AppHeader.vue'
import MainSection from './main/MainSection.vue'
import FeaturesSection from './features/FeaturesSection.vue'
import PricingSection from './pricing/PricingSection.vue'
import ContactSection from './contact/ContactSection.vue'
</script>

<template>
  <div class="home">
    <AppHeader />
    <main>
      <MainSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
    </main>
  </div>
</template>

<style scoped>
.home {
  background: var(--color-bg, #fff);
  color: var(--color-text, #111);
}
</style>
