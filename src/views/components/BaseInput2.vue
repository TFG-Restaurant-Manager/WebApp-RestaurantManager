<script setup>
import { ref } from 'vue'

// Keep only placeholder as prop; component manages its own text internally.
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Escribe algo...',
  },
})

const text = ref('')
const inputRef = ref(null)
const focused = ref(false)

function onInput(e) {
  text.value = e.target.value
}

function onFocus() { focused.value = true }
function onBlur() { focused.value = false }
function focus() { inputRef.value && inputRef.value.focus() }
function getValue() { return text.value }

// Expose internal state and helpers to parent via ref (defineExpose)
defineExpose({ text, getValue, focus })
</script>

<template>
  <div class="chat-input" :class="{ 'is-focused': focused, 'is-filled': text && text.length > 0 }">
    <div class="chat-input__inner">
      <input
        ref="inputRef"
        class="chat-input__control"
        v-model="text"
        :placeholder="props.placeholder"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  width: 100%;
  display: block;
}

.chat-input__inner {
  display: flex;
  align-items: center;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 6px 18px var(--color-primary-shadow);
  transition: background 180ms ease, box-shadow 220ms ease, transform 180ms ease;
}

.chat-input__control {
  background: transparent;
  border: none;
  color: inherit;
  width: 100%;
  font-size: 1rem;
  outline: none;
  padding: 6px 0;
}

.chat-input__control::placeholder {
  color: rgba(255,255,255,0.85);
}

.chat-input__inner:focus-within,
.chat-input.is-focused .chat-input__inner {
  background: var(--color-primary-dark);
  box-shadow: 0 10px 30px var(--color-primary-shadow);
  transform: translateY(-1px);
}

.chat-input.is-filled .chat-input__control::placeholder {
  opacity: 0.6;
}

.chat-input__control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

