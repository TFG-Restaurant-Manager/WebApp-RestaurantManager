<script setup>
import { ref, computed } from 'vue'
import AppHeader from '../screens/main/AppHeader.vue'
import AppNavbar from '../screens/main/AppNavbar.vue'
import TestView from '../screens/test/TestView.vue'

// Añade aquí nuevas pantallas: { id, label, component }
const screens = [
  { id: 'test', label: 'Test', component: TestView },
]

const currentId = ref('test')
const sidebarOpen = ref(false)

const currentComponent = computed(
  () => screens.find(s => s.id === currentId.value)?.component ?? null
)
</script>

<template>
  <div class="main-layout">
    <AppHeader @toggle="sidebarOpen = !sidebarOpen" />
    <AppNavbar
      :screens="screens"
      :current="currentId"
      :open="sidebarOpen"
      @change="(id) => { currentId = id; sidebarOpen = false }"
      @close="sidebarOpen = false"
    />

    <main class="main-layout__content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-layout__content {
  flex: 1;
  overflow-y: auto;
}
</style>
