<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './screens/MainLayout.vue'

const route = useRoute()


const MOCK_DB = {
  'pizzeria-luigi': {
    name: 'Pizzería Luigi',
    colors: { primary: '#e74c3c' },
    logo: null
  },
  'restaurante-pepe': {
    name: 'Restaurante Pepe',
    colors: { primary: '#2980b9' },
    logo: null
  }
}

const config = ref(null)
const loading = ref(true)
const error = ref(null)

async function fetchConfig(slug) {
  loading.value = true
  error.value = null
  config.value = null
  try {

    const data = MOCK_DB[slug]
    if (!data) throw new Error(`Restaurante "${slug}" no encontrado`)
    config.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchConfig(route.params.slug))
watch(() => route.params.slug, (slug) => { if (slug) fetchConfig(slug) })
</script>

<template>
  <div>
    <div v-if="loading" class="state-msg">Cargando...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <MainLayout v-else-if="config" :config="config" />
  </div>
</template>

<style scoped>
.state-msg {
  padding: 3rem;
  text-align: center;
  font-size: 1.1rem;
}
.state-msg.error {
  color: #c0392b;
}
</style>
