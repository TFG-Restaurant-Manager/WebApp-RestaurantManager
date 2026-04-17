<script setup>
import SocialButton from './SocialButton.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  buttons: {
    type: Array,
    default: () => [
      { label: 'FACEBOOK', value: 'facebook', icon: 'fa-brands fa-facebook', bg: '#3b5998', width: '6rem' },
      { label: 'TWITTER', value: 'twitter', icon: 'fa-brands fa-twitter', bg: '#1da1f2', width: '5rem' },
      { label: 'INSTAGRAM', value: 'instagram', icon: 'fa-brands fa-instagram', bg: 'linear-gradient(90deg,#fdf497 0%,#fd5949 35%,#d6249f 60%,#8328eb 90%)', width: '6rem' },
      { label: 'WEIBO', value: 'weibo', icon: 'fa-brands fa-weibo', bg: '#e6162d', width: '4.5rem' }
    ]
  }
})

const emit = defineEmits(['click'])

function handle(btn, e) {
  emit('click', btn.value ?? btn.label)
}
</script>

<template>
  <div class="socials-wrap">
    <SocialButton
      v-for="btn in buttons"
      :key="btn.value ?? btn.label"
      :label="btn.label"
      :icon="btn.icon"
      :hoverBg="btn.bg"
      :hoverWidth="btn.width"
      @click="(e) => handle(btn, e)"
    />
  </div>
</template>

<style scoped>
.socials-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
