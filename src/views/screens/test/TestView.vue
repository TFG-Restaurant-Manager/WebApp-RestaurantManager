<script setup>
import { ref } from 'vue'
import BaseButton from '../../components/BaseButton.vue'
import BaseInput from '../../components/BaseInput.vue'
import SegmentedButtons from '../../components/SegmentedButtons.vue'
import SocialButtons from '../../components/SocialButtons.vue'
import Checkbox from '../../components/Checkbox.vue'
import BaseInput2 from '../../components/BaseInput2.vue'
import BaseInput3 from '../../components/BaseInput3.vue'
import BaseInput4 from '../../components/BaseInput4.vue'
import LoadingIcon from '../../components/LoadingIcon.vue'
import Dropdown from '../../components/Dropdown.vue'
import BaseInput5 from '../../components/BaseInput5.vue'

const inputRef = ref(null)
const resultado = ref('')
const selected = ref('Comida')
const socialChoice = ref(null)

const socialOptions = [
  { label: 'FACEBOOK', value: 'facebook', icon: 'fa-brands fa-facebook', bg: '#3b5998', width: '6rem' },
  { label: 'TWITTER', value: 'twitter', icon: 'fa-brands fa-twitter', bg: '#1da1f2', width: '5rem' },
  { label: 'INSTAGRAM', value: 'instagram', icon: 'fa-brands fa-instagram', bg: 'linear-gradient(90deg,#fdf497 0%,#fd5949 35%,#d6249f 60%,#8328eb 90%)', width: '6rem' },
  { label: 'WEIBO', value: 'weibo', icon: 'fa-brands fa-weibo', bg: '#e6162d', width: '4.5rem' }
]

const agree = ref(false)

function handleClick() {
  resultado.value = inputRef.value?.getValue() ?? ''
  console.log('Texto:', resultado.value)
  console.log('Segmented selection:', selected.value)
}


</script>

<template>
  <section class="test-view">
    <h2>Vista de prueba</h2>

    <div class="demo">

      <div id="input-demo">
        <BaseInput ref="inputRef" placeholder="Escribe algo..." />
        <BaseButton label="Enviar" @click="handleClick" />
      </div>
      <div id="segmented-demo">
        <SegmentedButtons v-model="selected"
          :options="[{ label: 'Desayuno' }, { label: 'Comida' }, { label: 'Cena' }]" />

      </div>
      <div id="socials-demo" style="margin-top: 1.25rem;">
        <SocialButtons :buttons="socialOptions" @click="(v) => { socialChoice.value = v }" />
      </div>
      <div id="checkbox-demo" style="margin-top: 1.25rem; display:flex; gap:1rem; align-items:center;">
        <Checkbox v-model="agree" label="Acepto políticas" />
        <Checkbox v-model="agree" label="Recibir novedades" />
      </div>
      <BaseInput2 placeholder="Otro input para comparar estilos..." />
      <BaseInput3></BaseInput3>
      <BaseInput4></BaseInput4>
      <BaseInput5></BaseInput5>
      <LoadingIcon></LoadingIcon>
      <div id="dropdown-demo" style="margin-top: 1.25rem;">
        <Dropdown :options="['Sopa','Pizza','Ensalada']" placeholder="Elige plato..." />
      </div>
      
        <br><br><br><br><br><br><br><br><br><br>
    </div>

    <p v-if="resultado">Valor actual: <strong>{{ resultado }}</strong></p>
    <p v-if="selected">Selección actual: <strong>{{ selected }}</strong></p>
    <p v-if="socialChoice">Red social clicada: <strong>{{ socialChoice }}</strong></p>
  </section>
</template>

<style scoped>
#input-demo {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  flex-direction: row;
}

#segmented-demo {
  margin-top: 1.5rem;
}

.test-view {
  padding: 2rem;
}

.demo {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.5rem;
  flex-direction: column;
}
 
</style>
