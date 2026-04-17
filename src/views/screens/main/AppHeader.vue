<script setup>
const emit = defineEmits(['toggle'])
</script>

<template>
  <header class="app-header">
    <button class="app-header__menu" @click="emit('toggle')" aria-label="Abrir menú" type="button">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <span class="app-header__title">Restaurant Manager</span>
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
</style>
