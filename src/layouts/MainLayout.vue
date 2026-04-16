<script setup>
import { ref, computed } from 'vue'
import AppHeader from '../screens/main/AppHeader.vue'
import AppNavbar from '../screens/main/AppNavbar.vue'
import TestView from '../screens/test/TestView.vue'


const props = defineProps({ config: { type: Object, default: null } })

// ORIGINAL
const screens = [
  { id: 'test', label: 'Test', component: TestView },
]

const currentId = ref('test')
const sidebarOpen = ref(false)

const currentComponent = computed(
  () => screens.find(s => s.id === currentId.value)?.component ?? null
)

//ORIGINAL


function hexToRgb(hex) {
  if (!hex) return null
  let h = String(hex).replace('#', '').trim()
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (h.length !== 6) return null
  const int = parseInt(h, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

function rgbToHex(r, g, b) {
  const toHex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function darkenHex(hex, amount = 0.12) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = rgb.r * (1 - amount)
  const g = rgb.g * (1 - amount)
  const b = rgb.b * (1 - amount)
  return rgbToHex(r, g, b)
}

function luminance(rgb) {
  if (!rgb) return 0
  const srgb = [rgb.r, rgb.g, rgb.b].map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

const themeVars = computed(() => {
  const defs = {}
  const colors = props.config?.colors ?? null
  if (!colors || !colors.primary) return defs
  const primary = String(colors.primary).trim()
  const rgb = hexToRgb(primary) || { r: 66, g: 184, b: 131 }
  defs['--color-primary'] = primary
  defs['--color-primary-dark'] = darkenHex(primary, 0.12)
  defs['--color-primary-shadow'] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`
  defs['--color-text-on-primary'] = luminance(rgb) > 0.6 ? '#111' : '#ffffff'
  return defs
})
</script>

<template>
  <div class="main-layout" :style="themeVars">
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
