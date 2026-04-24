<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './screens/MainLayout.vue'
import { getRestaurantId } from '../stores/restaurantStore'

const route = useRoute()

const config = computed(() => {
  const id = getRestaurantId(route.params.slug)
  return id !== null ? { id } : null
})
</script>

<template>
  <div>
    <div v-if="!config" class="state-msg error">Restaurante no encontrado</div>
    <MainLayout v-else :config="config" />
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
