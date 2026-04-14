<script setup>
import { ref } from 'vue'
import BaseButton from '../../components/BaseButton.vue'
import BaseInput from '../../components/BaseInput.vue'

const inputRef = ref(null)
const resultado = ref('')

function handleClick() {
  resultado.value = inputRef.value?.getValue() ?? ''
  console.log('Texto:', resultado.value)
}
</script>

<template>
  <section class="test-view">
    <h2>Vista de prueba</h2>

    <div class="demo">
      <BaseInput ref="inputRef" placeholder="Escribe algo..." />
      <BaseButton label="Enviar" @click="handleClick" />
    </div>

    <p v-if="resultado">Valor actual: <strong>{{ resultado }}</strong></p>
  </section>
</template>

<style scoped>
.test-view {
  padding: 2rem;
}

.demo {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.5rem;
}
</style>
