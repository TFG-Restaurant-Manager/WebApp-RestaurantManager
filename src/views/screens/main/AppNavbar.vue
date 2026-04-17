<script setup>
defineProps({
  screens: {
    type: Array,
    default: () => [],
  },
  current: {
    type: String,
    default: '',
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change', 'close'])
</script>

<template>
  <div class="app-sidebar-wrapper">
    <div class="sidebar-overlay" v-show="open" @click="emit('close')" />

    <aside class="app-sidebar" :class="{ 'is-open': open }" role="navigation" aria-hidden="!open">
      <nav class="app-navbar-vertical">
        <button
          v-for="screen in screens"
          :key="screen.id"
          class="app-navbar-vertical__item"
          :class="{ 'is-active': current === screen.id }"
          @click="() => { emit('change', screen.id); emit('close') }"
        >
          {{ screen.label }}
        </button>
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.app-sidebar-wrapper {
  position: relative;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.32);
  z-index: 998;
  transition: opacity 220ms ease;
}
.sidebar-overlay[v-cloak] { display: none }

.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: var(--color-bg);
  box-shadow: 2px 0 12px rgba(0,0,0,0.08);
  transform: translateX(-110%);
  transition: transform 320ms cubic-bezier(.2,.8,.2,1);
  z-index: 999;
  display: flex;
  flex-direction: column;
}
.app-sidebar.is-open {
  transform: translateX(0);
}

.app-navbar-vertical {
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  gap: 0.25rem;
}

.app-navbar-vertical__item {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  color: var(--color-text);
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
}

.app-navbar-vertical__item:hover {
  background: rgba(0,0,0,0.03);
}

.app-navbar-vertical__item.is-active {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  background: rgba(66,184,131,0.06);
}
</style>
