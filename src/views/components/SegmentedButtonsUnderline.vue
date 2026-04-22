<script setup>
import { ref, computed, watch, nextTick } from 'vue'


const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  options: {
    type: Array,
    default: () => ['Opción 1', 'Opción 2', 'Opción 3']
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

/** Normaliza las opciones a objetos `{ label, value }` */
const normalizedOptions = computed(() =>
  props.options.map(o =>
    typeof o === 'string' ? { label: o, value: o } : { value: o.value ?? o.label, label: o.label }
  )
)

/** Índice de la opción activa */
const activeIndex = computed(() =>
  normalizedOptions.value.findIndex(o => o.value === props.modelValue)
)

/** Referencias a los botones individuales para calcular posición y ancho de la barra */
const buttonRefs = ref([])

/** Posición y ancho de la barra deslizante */
const barStyle = computed(() => {
  const idx = activeIndex.value
  if (idx < 0 || !buttonRefs.value[idx]) return { width: '0px', transform: 'translateX(0px)' }
  const btn = buttonRefs.value[idx]
  return {
    width: btn.offsetWidth + 'px',
    transform: `translateX(${btn.offsetLeft}px)`,
  }
})

function select(option) {
  if (option.value !== props.modelValue) {
    emit('update:modelValue', option.value)
    emit('change', option.value)
  }
}

/** Recalcula cuando cambian las opciones (por si cambia el DOM) */
watch(() => props.options, () => nextTick(), { flush: 'post' })
</script>

<template>
  <div class="seg-ul">
    <!-- Botones de texto -->
    <button
      v-for="(option, i) in normalizedOptions"
      :key="option.value"
      :ref="el => { if (el) buttonRefs[i] = el }"
      class="seg-ul__btn"
      :class="{ 'seg-ul__btn--active': option.value === modelValue }"
      type="button"
      @click="select(option)"
    >
      {{ option.label }}
    </button>

    <!-- Barra deslizante inferior -->
    <span class="seg-ul__bar" :style="barStyle" />
  </div>
</template>

<style scoped>
.seg-ul {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-bottom: 2px solid var(--color-border, rgba(0, 0, 0, 0.1));
  gap: 0;
}

.seg-ul__btn {
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-muted, #888);
  letter-spacing: 0.02em;
  transition: color 200ms;
  white-space: nowrap;
  outline: none;
}

.seg-ul__btn:hover {
  color: var(--color-text, #333);
}

.seg-ul__btn--active {
  color: var(--color-primary, #4a90e2);
  font-weight: 700;
}

/* Barra deslizante: se posiciona en la parte inferior del contenedor */
.seg-ul__bar {
  position: absolute;
  bottom: -2px;     /* se superpone al borde inferior del contenedor */
  left: 0;
  height: 2px;
  background: var(--color-primary, #4a90e2);
  border-radius: 2px 2px 0 0;
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), width 250ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
</style>
