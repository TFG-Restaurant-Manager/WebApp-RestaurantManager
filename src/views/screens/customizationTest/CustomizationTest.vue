<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import interact from 'interactjs'

import BaseButton from '../../components/BaseButton.vue'
import BaseInput from '../../components/BaseInput.vue'
import BaseInput2 from '../../components/BaseInput2.vue'
import BaseInput3 from '../../components/BaseInput3.vue'
import BaseInput4 from '../../components/BaseInput4.vue'
import BaseInput5 from '../../components/BaseInput5.vue'
import SegmentedButtons from '../../components/SegmentedButtons.vue'
import SocialButtons from '../../components/SocialButtons.vue'
import SocialButton from '../../components/SocialButton.vue'
import Checkbox from '../../components/Checkbox.vue'
import Dropdown from '../../components/Dropdown.vue'
import LoadingIcon from '../../components/LoadingIcon.vue'

const props = defineProps({
  restaurantId: { type: String, default: 'default' }
})

const grid = 16
const editing = ref(false)
const drawerOpen = ref(false)
const canvasEl = ref(null)
const items = ref([])
const editingItem = ref(null)
const fileInputRef = ref(null)

watch(editing, v => { if (!v) { editingItem.value = null; drawerOpen.value = false } })

// ── Exportar / Importar JSON ──────────────────────────────────────────────
function exportLayout() {
  const data = {
    restaurantId: props.restaurantId,
    version: 1,
    items: items.value.map(({ id, type, x, y, props: p }) => ({ id, type, x, y, props: p }))
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `layout-${props.restaurantId}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function triggerImport() {
  fileInputRef.value?.click()
}

function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      if (!Array.isArray(data.items)) throw new Error('Formato inválido')
      // Limpiar interact de items existentes
      items.value.forEach(it => {
        const el = canvasEl.value?.querySelector(`[data-id="${it.id}"]`)
        try { if (el) interact(el).unset() } catch (_) {}
      })
      items.value = data.items.map(it => ({ ...it, props: it.props ?? {} }))
      editingItem.value = null
      nextTick(() => items.value.forEach(it => setupInteractFor(it.id)))
    } catch (err) {
      alert(`Error al importar: ${err.message}`)
    }
  }
  reader.readAsText(file)
  // Limpiar el input para permitir reimportar el mismo archivo
  e.target.value = ''
}

// ── Props editables por tipo ──────────────────────────────────────────────
const propSchemas = {
  BaseButton:       [{ key: 'label',       label: 'Texto del botón',  type: 'text' }],
  BaseInput:        [{ key: 'placeholder', label: 'Placeholder',      type: 'text' }],
  BaseInput2:       [{ key: 'placeholder', label: 'Placeholder',      type: 'text' }],
  BaseInput3:       [],
  BaseInput4:       [],
  BaseInput5:       [],
  SegmentedButtons: [],
  SocialButtons:    [],
  SocialButton:     [
    { key: 'label', label: 'Label',            type: 'text' },
    { key: 'icon',  label: 'Clase icono (FA)', type: 'text' }
  ],
  Checkbox:         [{ key: 'label',       label: 'Label',            type: 'text' }],
  Dropdown:         [{ key: 'placeholder', label: 'Placeholder',      type: 'text' }],
  LoadingIcon:      []
}

const defaultPropsMap = {
  BaseButton:   { label: 'Button' },
  BaseInput:    { placeholder: 'Escribe algo...' },
  BaseInput2:   { placeholder: 'Escribe algo...' },
  SocialButton: { label: 'LABEL', icon: '' },
  Checkbox:     { label: 'Opción' },
  Dropdown:     { placeholder: 'Selecciona...' }
}

const palette = [
  { type: 'BaseButton',       label: 'Button' },
  { type: 'BaseInput',        label: 'Input' },
  { type: 'BaseInput2',       label: 'Input2' },
  { type: 'BaseInput3',       label: 'Input3' },
  { type: 'BaseInput4',       label: 'Input4' },
  { type: 'BaseInput5',       label: 'Input5' },
  { type: 'SegmentedButtons', label: 'Segmented' },
  { type: 'SocialButtons',    label: 'Socials' },
  { type: 'SocialButton',     label: 'SocialBtn' },
  { type: 'Checkbox',         label: 'Checkbox' },
  { type: 'Dropdown',         label: 'Dropdown' },
  { type: 'LoadingIcon',      label: 'Loading' }
]

const componentMap = {
  BaseButton, BaseInput, BaseInput2, BaseInput3, BaseInput4, BaseInput5,
  SegmentedButtons, SocialButtons, SocialButton, Checkbox, Dropdown, LoadingIcon
}

// ── Utils ─────────────────────────────────────────────────────────────────
function snap(v) { return Math.round(v / grid) * grid }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

// ── Drop desde palette ────────────────────────────────────────────────────
function onCanvasDrop(e) {
  e.preventDefault()
  if (!editing.value) return
  const type = e.dataTransfer.getData('component')
  if (!type) return
  const rect = canvasEl.value.getBoundingClientRect()
  const x = snap(e.clientX - rect.left)
  const y = snap(e.clientY - rect.top)
  const id = `c${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
  items.value.push({ id, type, x, y, props: { ...(defaultPropsMap[type] ?? {}) } })
  nextTick(() => setupInteractFor(id))
}

// ── Clic en canvas vacío ──────────────────────────────────────────────────
function onCanvasClick(e) {
  if (editingItem.value && !e.target.closest('.placed-item')) editingItem.value = null
}

// ── Panel de props (doble clic) ───────────────────────────────────────────
function openEditPanel(item) {
  if (!editing.value) return
  editingItem.value = item
  drawerOpen.value = true
}

// ── Eliminar item ─────────────────────────────────────────────────────────
function removeItem(id) {
  const idx = items.value.findIndex(i => i.id === id)
  if (idx === -1) return
  if (editingItem.value?.id === id) editingItem.value = null
  const el = canvasEl.value?.querySelector(`[data-id="${id}"]`)
  try { interact(el).unset() } catch (_) {}
  items.value.splice(idx, 1)
}

// ── Drag con interactjs ───────────────────────────────────────────────────
function setupInteractFor(id) {
  const el = canvasEl.value?.querySelector(`[data-id="${id}"]`)
  if (!el) return
  const item = items.value.find(i => i.id === id)
  if (!item) return

  el.style.left = item.x + 'px'
  el.style.top  = item.y + 'px'

  let active = false
  let startX = 0, startY = 0, startPageX = 0, startPageY = 0

  interact(el).draggable({
    inertia: false,
    listeners: {
      start(event) {
        if (!editing.value) return
        active = true
        el.classList.add('dragging')
        const it = items.value.find(i => i.id === id)
        startX = it?.x ?? 0; startY = it?.y ?? 0
        startPageX = event.page.x; startPageY = event.page.y
      },
      move(event) {
        if (!active) return
        const it = items.value.find(i => i.id === id)
        if (!it) return
        const rect = canvasEl.value.getBoundingClientRect()
        const nx = snap(clamp(startX + (event.page.x - startPageX), 0, Math.max(0, rect.width  - el.offsetWidth)))
        const ny = snap(clamp(startY + (event.page.y - startPageY), 0, Math.max(0, rect.height - el.offsetHeight)))
        it.x = nx; it.y = ny
        el.style.left = nx + 'px'; el.style.top = ny + 'px'
      },
      end() { active = false; el.classList.remove('dragging') }
    }
  })
}

onMounted(() => items.value.forEach(it => setupInteractFor(it.id)))
</script>

<template>
  <!-- El canvas ocupa todo el área de contenido -->
  <div
    class="canvas"
    :class="{ editing }"
    ref="canvasEl"
    @dragover.prevent
    @drop="onCanvasDrop"
    @click="onCanvasClick"
  >
    <!-- Items colocados -->
    <div
      v-for="item in items"
      :key="item.id"
      class="placed-item"
      :class="{ 'is-editing': editing, selected: editingItem?.id === item.id }"
      :data-id="item.id"
      :style="{ left: item.x + 'px', top: item.y + 'px' }"
      @dblclick.stop="openEditPanel(item)"
    >
      <component :is="componentMap[item.type]" v-bind="item.props" />
      <button v-if="editing" class="remove-btn" @click.stop="removeItem(item.id)" aria-label="Eliminar">✕</button>
    </div>

    <!-- Botón editar (esquina superior izquierda) -->
    <button class="edit-fab" @click.stop="editing = !editing">
      {{ editing ? '✕ Cerrar' : '✏ Editar' }}
    </button>

    <!-- Franja invisible que activa el drawer al hover (solo en modo editar) -->
    <div v-if="editing" class="drawer-trigger" @mouseenter="drawerOpen = true" />

    <!-- Drawer lateral derecho -->
    <aside
      v-if="editing"
      class="drawer"
      :class="{ open: drawerOpen }"
      @mouseleave="drawerOpen = false"
    >
      <!-- Panel de props -->
      <template v-if="editingItem">
        <div class="drawer-header">
          <button class="back-btn" @click="editingItem = null">← Volver</button>
          <span class="drawer-title">{{ editingItem.type }}</span>
        </div>
        <div class="prop-list">
          <div v-for="field in (propSchemas[editingItem.type] ?? [])" :key="field.key" class="prop-field">
            <label>{{ field.label }}</label>
            <input :type="field.type" v-model="editingItem.props[field.key]" />
          </div>
          <p v-if="!(propSchemas[editingItem.type] ?? []).length" class="no-props">Sin propiedades editables</p>
        </div>
      </template>

      <!-- Palette -->
      <template v-else>
        <h3>Componentes</h3>
        <p class="drawer-hint">Arrastra al canvas · Doble clic para editar props</p>

        <!-- Export / Import -->
        <div class="json-actions">
          <button class="json-btn" @click="exportLayout">⬇ Exportar JSON</button>
          <button class="json-btn" @click="triggerImport">⬆ Importar JSON</button>
          <input ref="fileInputRef" type="file" accept=".json" style="display:none" @change="onFileSelected" />
        </div>

        <div class="palette">
          <div
            class="palette-item"
            v-for="c in palette"
            :key="c.type"
            draggable="true"
            @dragstart="e => e.dataTransfer.setData('component', c.type)"
          >
            <span class="palette-label">{{ c.label }}</span>
            <div class="palette-preview">
              <component :is="componentMap[c.type]" v-bind="defaultPropsMap[c.type] ?? {}" />
            </div>
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<style scoped>
/* ── Canvas: ocupa todo el área de contenido ─────────────────────────────── */
.canvas {
  position: absolute;
  inset: 0;
  background: var(--color-bg, #fff);
  overflow: hidden;
}

/* Grid solo en modo editar */
.canvas.editing {
  background-image:
    linear-gradient(to right,  rgba(0,0,0,0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* ── Items colocados ─────────────────────────────────────────────────────── */
.placed-item {
  position: absolute;
  display: inline-block;
  padding: 4px;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;
}
.placed-item.is-editing { cursor: grab; outline: 1px dashed rgba(0,0,0,0.15); }
.placed-item.is-editing:hover { outline: 1px dashed var(--color-primary, #4a90e2); }
.placed-item.selected { outline: 2px solid var(--color-primary, #4a90e2) !important; }
.placed-item.dragging { cursor: grabbing !important; opacity: 0.85; }

.remove-btn {
  position: absolute;
  right: -8px; top: -8px;
  background: #ff5e5e;
  color: #fff;
  border: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  font-size: 0.7rem;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  padding: 0;
  z-index: 5;
}

/* ── Botón editar ────────────────────────────────────────────────────────── */
.edit-fab {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, rgba(0,0,0,0.15));
  background: var(--color-surface, #fff);
  cursor: pointer;
  font-size: 0.85rem;
  z-index: 60;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ── Franja de activación del drawer ─────────────────────────────────────── */
.drawer-trigger {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 20px;
  z-index: 50;
}

/* ── Drawer ──────────────────────────────────────────────────────────────── */
.drawer {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 270px;
  background: var(--color-surface, #fafafa);
  border-left: 1px solid var(--color-border, rgba(0,0,0,0.1));
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
  transform: translateX(100%);
  transition: transform 200ms ease;
  z-index: 45;
  overflow-y: auto;
  padding: 0.75rem;
  box-sizing: border-box;
}
.drawer.open { transform: translateX(0); }
.drawer h3 { margin: 0 0 0.2rem; font-size: 0.95rem; }
.drawer-hint { margin: 0 0 0.5rem; font-size: 0.72rem; color: var(--color-muted, #999); }

/* Export / Import */
.json-actions {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}
.json-btn {
  padding: 0.35rem 0.6rem;
  border-radius: 5px;
  border: 1px solid var(--color-border, rgba(0,0,0,0.15));
  background: var(--color-bg, #f0f0f0);
  color: var(--color-text, #333);
  font-size: 0.78rem;
  cursor: pointer;
  text-align: left;
}
.json-btn:hover { background: var(--color-surface, #e8e8e8); }

/* Palette */
.palette { display: flex; flex-direction: column; gap: 0.35rem; }
.palette-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  background: var(--color-bg, #f0f0f0);
  cursor: grab;
  user-select: none;
}
.palette-item:active { cursor: grabbing; }
.palette-label { font-size: 0.78rem; min-width: 64px; color: var(--color-text, #333); }
.palette-preview { pointer-events: none; transform: scale(0.72); transform-origin: left center; overflow: hidden; max-width: 120px; }

/* Props panel */
.drawer-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
.back-btn { background: none; border: none; cursor: pointer; color: var(--color-primary, #4a90e2); padding: 0; font-size: 0.85rem; }
.drawer-title { font-size: 0.85rem; font-weight: 600; color: var(--color-text, #333); }
.prop-list { display: flex; flex-direction: column; gap: 0.75rem; }
.prop-field { display: flex; flex-direction: column; gap: 0.25rem; }
.prop-field label { font-size: 0.75rem; color: var(--color-muted, #888); }
.prop-field input {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--color-border, rgba(0,0,0,0.15));
  border-radius: 4px;
  font-size: 0.85rem;
  background: var(--color-bg, #fff);
  color: var(--color-text, #333);
  outline: none;
}
.prop-field input:focus { border-color: var(--color-primary, #4a90e2); }
.no-props { font-size: 0.8rem; color: var(--color-muted, #888); margin: 0; }
</style>
