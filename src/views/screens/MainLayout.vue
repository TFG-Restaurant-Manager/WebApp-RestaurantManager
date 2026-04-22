<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './main/AppHeader.vue'
import AppNavbar from './main/AppNavbar.vue'
import TestView from './test/TestView.vue'
import CustomizationTest from './customizationTest/CustomizationTest.vue'


const props = defineProps({ config: { type: Object, default: null } })
const route = useRoute()

// ORIGINAL
const screens = [
  { id: 'test', label: 'Test', component: TestView, props: {} },
  { id: 'customizationTest', label: 'Customization', component: CustomizationTest, props: { restaurantId: props.config?.id ?? 'default' } },
]

const currentId = ref('test')
const sidebarOpen = ref(false)

const currentScreen = computed(
  () => screens.find(s => s.id === currentId.value) ?? null
)
const currentComponent = computed(() => currentScreen.value?.component ?? null)
const currentProps = computed(() => currentScreen.value?.props ?? {})


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
    <!-- restaurantId viene de config; el slug es el ID del restaurante en la URL -->
    <AppHeader :restaurant-id="props.config?.id ?? route.params?.slug ?? 'default'" @toggle="sidebarOpen = !sidebarOpen" />
    <AppNavbar
      :screens="screens"
      :current="currentId"
      :open="sidebarOpen"
      @change="(id) => { currentId = id; sidebarOpen = false }"
      @close="sidebarOpen = false"
    />

    <main class="main-layout__content">
      <component :is="currentComponent" v-bind="currentProps" />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-layout__content {
  flex: 1;
  min-height: 0;
  /* Permitimos scroll interno en el contenido principal para que se pueda
     desplazar cuando el editor (canvas) crece verticalmente. Mantener el
     header fijado y el resto con scroll interno evita afectar el layout global. */
  overflow: auto;
  position: relative;
}
</style>
