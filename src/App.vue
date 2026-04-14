<script setup>
import { ref } from 'vue'
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'

const texto = ref('')

function handleClick() {
  console.log(texto.value)
}
</script>

<template>
  <main class="container">
    <h1>Restaurant Manager</h1>

    <div class="demo">
      <BaseInput v-model="texto" placeholder="Escribe algo..." />
      <BaseButton label="Enviar" @click="handleClick" />
    </div>

    <p v-if="texto">Valor actual: <strong>{{ texto }}</strong></p>
  </main>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
}

.demo {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.5rem;
}
</style>
