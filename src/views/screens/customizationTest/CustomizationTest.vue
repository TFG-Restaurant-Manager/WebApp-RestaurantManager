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
import { createSetupInteractFor } from './helpers/interactSetup'
/**
 * Prop `restaurantId` para identificar el restaurante al que pertenece el layout. Se incluye en el JSON exportado y se puede usar para cargar un layout específico al iniciar la vista (no implementado en este ejemplo).
 */
const props = defineProps({
  restaurantId: { type: String, default: 'default' }
})

/**
 * Tamaño de la cuadrícula para el snapping de posición y tamaño. Se puede ajustar para layouts más finos o gruesos.
 */
const grid = 16
/**
 * Estado de edición general. Si es `false`, el canvas solo permite interacción básica (sin arrastrar ni redimensionar) y oculta el drawer de edición. Si es `true`, se pueden editar items y se muestra el drawer al hacer hover en la franja lateral.
 */
const editing = ref(false)

/**
 * Estado de apertura del drawer lateral al pasar el ratón.
 * @type {import('vue').Ref<boolean>}
 */
const drawerOpen = ref(false)

/**
 * Referencia al elemento del canvas para cálculos de posición y para inicializar interact.js en los items. Se asigna al div con clase "canvas" en el template.
 * @type {import('vue').Ref<HTMLElement|null>}
 */
const canvasEl = ref(null)

/**
 * Lista de items colocados en el canvas (posiciones, tamaño y props por item).
 * @type {import('vue').Ref<Array<object>>}
 */
const items = ref([])

/**
 * Item actualmente abierto en el panel de edición (o null si no hay ninguno).
 * @type {import('vue').Ref<object|null>}
 */
const editingItem = ref(null)

/**
 * Referencia al input[type=file] oculto para importar JSON.
 * @type {import('vue').Ref<HTMLInputElement|null>}
 */
const fileInputRef = ref(null)

/**
 * Staging de props por item: los cambios se guardan cuando se cierra el modo editar.
 * @type {import('vue').Ref<Record<string, object>>}
 */
const stagedProps = ref({})

watch(editing, v => {
  if (!v) {
    for (const id in stagedProps.value) {
      const it = items.value.find(i => i.id === id)
      if (it) {
        it.props = { ...(it.props ?? {}), ...(stagedProps.value[id] ?? {}) }
      }
    }
    stagedProps.value = {}
    editingItem.value = null
    drawerOpen.value = false
  }
})

/**
 * Exporta el layout actual a un archivo JSON y descarga el archivo.
 * @returns {void}
 */
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

/**
 * Dispara el input oculto para importar un JSON.
 * @returns {void}
 */
function triggerImport() {
  fileInputRef.value?.click()
}

/**
 * Maneja la selección del archivo JSON de importación y reemplaza los items.
 * @param {Event} e Evento change del input[type=file]
 * @returns {void}
 */
function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!Array.isArray(data.items)) throw new Error('Formato inválido')
        items.value.forEach(it => {
          const el = canvasEl.value?.querySelector(`[data-id="${it.id}"]`)
          try { if (el) interact(el).unset() } catch (_) { }
        })
        items.value = data.items.map(it => ({ w: null, h: null, ...it, props: it.props ?? {} }))
        stagedProps.value = {}
        editingItem.value = null
        nextTick(() => items.value.forEach(it => setupInteractFor(it.id)))
      } catch (err) {
        alert(`Error al importar: ${err.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }
}

/**
 * Esquemas de propiedades editables por tipo de componente.
 * @type {Record<string, Array<{key:string,label:string,type:string}>>}
 */
const propSchemas = {
  TextBox: [
    { key: 'text', label: 'Texto', type: 'textarea' },
    { key: 'fontSize', label: 'Tamaño (px)', type: 'number' },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'bold', label: 'Negrita', type: 'checkbox' },
    { key: 'italic', label: 'Cursiva', type: 'checkbox' },
  ],
  ImageBox: [
    { key: 'src', label: 'Imagen', type: 'image' },
    { key: 'alt', label: 'Texto alt', type: 'text' },
    { key: 'width', label: 'Ancho (px)', type: 'number' },
    { key: 'height', label: 'Alto (px)', type: 'number' },
  ],
  BaseButton: [{ key: 'label', label: 'Texto del botón', type: 'text' }],
  BaseInput: [{ key: 'placeholder', label: 'Placeholder', type: 'text' }],
  BaseInput2: [{ key: 'placeholder', label: 'Placeholder', type: 'text' }],
  BaseInput3: [{ key: 'placeholder', label: 'Placeholder', type: 'text' }],
  BaseInput4: [{ key: 'placeholder', label: 'Placeholder', type: 'text' }],
  BaseInput5: [{ key: 'placeholder', label: 'Placeholder', type: 'text' }],
  SegmentedButtons: [],
  SocialButtons: [],
  SocialButton: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'icon', label: 'Clase icono (FA)', type: 'text' }
  ],
  Checkbox: [{ key: 'label', label: 'Label', type: 'text' }],
  Dropdown: [{ key: 'placeholder', label: 'Placeholder', type: 'text' }],
  LoadingIcon: []
}

/**
 * Valores por defecto de las props para cada tipo de componente.
 * Se usan al crear nuevos items y para las vistas previas en la paleta.
 * @type {Record<string, object>}
 */
const defaultPropsMap = {
  TextBox: { text: 'Cuadro de texto', fontSize: 16, color: '#213547', bold: false, italic: false },
  ImageBox: { src: '', alt: '', width: 120, height: 80 },
  BaseButton: { label: 'Button' },
  BaseInput: { placeholder: 'Escribe algo...' },
  BaseInput2: { placeholder: 'Escribe algo...' },
  BaseInput3: { placeholder: 'Escribe algo...' },
  BaseInput4: { placeholder: 'Escribe algo...' },
  BaseInput5: { placeholder: 'Escribe algo...' },
  SocialButton: { label: 'LABEL', icon: '' },
  Checkbox: { label: 'Opción' },
  Dropdown: { placeholder: 'Selecciona...' }
}

/**
 * Paleta de componentes disponibles para arrastrar al canvas.
 * Cada entrada tiene la forma `{ type: string, label: string }`.
 * @type {Array<{type:string,label:string}>}
 */
const palette = [
  { type: 'TextBox', label: 'Texto' },
  { type: 'ImageBox', label: 'Imagen' },
  { type: 'BaseButton', label: 'Button' },
  { type: 'BaseInput', label: 'Input' },
  { type: 'BaseInput2', label: 'Input2' },
  { type: 'BaseInput3', label: 'Input3' },
  { type: 'BaseInput4', label: 'Input4' },
  { type: 'BaseInput5', label: 'Input5' },
  { type: 'SegmentedButtons', label: 'Segmented' },
  { type: 'SocialButtons', label: 'Socials' },
  { type: 'SocialButton', label: 'SocialBtn' },
  { type: 'Checkbox', label: 'Checkbox' },
  { type: 'Dropdown', label: 'Dropdown' },
  { type: 'LoadingIcon', label: 'Loading' }
]

/**
 * Mapa de tipo de componente a la definición del componente Vue,
 * usado para renderizar dinámicamente el `component :is`.
 * @type {Record<string, any>}
 */
const componentMap = {
  BaseButton, BaseInput, BaseInput2, BaseInput3, BaseInput4, BaseInput5,
  SegmentedButtons, SocialButtons, SocialButton, Checkbox, Dropdown, LoadingIcon
}

/**
 * Calcula estilos inline para `TextBox` a partir de sus props.
 * @param {Object} p Props del TextBox
 * @returns {Object} Estilos inline
 */
function textboxStyle(p) {
  return {
    fontSize: (p.fontSize ?? 16) + 'px',
    color: p.color ?? '#213547',
    fontWeight: p.bold ? 'bold' : 'normal',
    fontStyle: p.italic ? 'italic' : 'normal',
    whiteSpace: 'pre-wrap',
    minWidth: '60px',
    minHeight: '1em',
    lineHeight: '1.4',
  }
}

/**
 * Estilos para `ImageBox`.
 * @returns {Object}
 */
function imageboxStyle() {
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }
}

/**
 * Lee un archivo de imagen y lo guarda en stagedProps del item activo como data URL.
 * @param {Event} e Evento change del input[type=file]
 * @returns {void}
 */
function onImagePropFile(e) {
  const file = e.target.files?.[0]
  if (file && editingItem.value) {
    const reader = new FileReader()
    reader.onload = ev => {
      const id = editingItem.value.id
      if (!stagedProps.value[id]) stagedProps.value[id] = {}
      stagedProps.value[id].src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }
}

/**
 * Ajusta un valor a la cuadricula configurada.
 * @param {number} v Valor a ajustar
 * @returns {number}
 */
function snap(v) { return Math.round(v / grid) * grid }

/**
 * Limita un valor entre `min` y `max`.
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

/**
 * Maneja el drop desde la paleta creando un nuevo item en la posición calculada.
 * @param {DragEvent} e
 * @returns {void}
 */
function onCanvasDrop(e) {
  e.preventDefault()
  if (editing.value) {
    const type = e.dataTransfer.getData('component')
    if (type) {
      const rect = canvasEl.value.getBoundingClientRect()
      const x = snap(e.clientX - rect.left)
      const y = snap(e.clientY - rect.top)
      const id = `c${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
      const sizeDefaults = { ImageBox: { w: 128, h: 80 }, TextBox: { w: 160, h: null } }
      const { w, h } = sizeDefaults[type] ?? { w: null, h: null }
      items.value.push({ id, type, x, y, w, h, props: { ...(defaultPropsMap[type] ?? {}) } })
      nextTick(() => setupInteractFor(id))
    }
  }
}

/**
 * Deselecciona el item en edición si se hace click fuera de un placed-item.
 * @param {MouseEvent} e
 * @returns {void}
 */
function onCanvasClick(e) {
  if (editingItem.value && !e.target.closest('.placed-item')) editingItem.value = null
}

/**
 * Abre el panel de edición para un item e inicializa staging.
 * @param {Object} item
 * @returns {void}
 */
function openEditPanel(item) {
  if (editing.value) {
    editingItem.value = item
    if (!stagedProps.value[item.id]) stagedProps.value[item.id] = JSON.parse(JSON.stringify(item.props ?? {}))
    drawerOpen.value = true
  }
}

/**
 * Elimina un item del canvas y elimina handle de interact si existe.
 * @param {string} id
 * @returns {void}
 */
function removeItem(id) {
  const idx = items.value.findIndex(i => i.id === id)
  if (idx !== -1) {
    if (editingItem.value?.id === id) editingItem.value = null
    const el = canvasEl.value?.querySelector(`[data-id="${id}"]`)
    try { interact(el).unset() } catch (_) { }
    items.value.splice(idx, 1)
  }
}

/**
 * Inicializa interact.js (draggable + resizable) para el elemento asociado al item `id`.
 * @param {string} id
 * @returns {void}
 */
const setupInteractFor = createSetupInteractFor({ items, canvasEl, editing, grid })

onMounted(() => items.value.forEach(it => setupInteractFor(it.id)))
</script>

<template>
  <!-- Canvas: ocupa todo el área de contenido. En modo editar permite arrastrar/redimensionar y muestra el drawer. -->
  <div class="canvas" :class="{ editing }" ref="canvasEl" @dragover.prevent @drop="onCanvasDrop" @click="onCanvasClick">
    <!-- Iteración: Items colocados en el canvas. Cada item tiene `data-id` usado por interact.js. Doble-clic abre el panel de props. -->
    <div v-for="item in items" :key="item.id" class="placed-item"
      :class="{ 'is-editing': editing, selected: editingItem?.id === item.id }" :data-id="item.id" :style="{
        left: item.x + 'px',
        top: item.y + 'px',
        width: item.w ? item.w + 'px' : undefined,
        height: item.h ? item.h + 'px' : undefined,
      }" @dblclick.stop="openEditPanel(item)">
      <!-- Wrapper que obliga al contenido a llenar el tamaño del placed-item -->
      <div class="item-content">
        <!-- Renderizado nativo para TextBox (texto simple con estilos calculados) -->
        <div v-if="item.type === 'TextBox'" class="textbox-el" :style="textboxStyle(item.props)">{{ item.props.text }}
        </div>
        <!-- Imagen: si existe `src` mostramos una etiqueta img; si no, mostramos un placeholder -->
        <img v-else-if="item.type === 'ImageBox' && item.props.src" class="imagebox-el" :src="item.props.src"
          :alt="item.props.alt" :style="imageboxStyle()" />
        <div v-else-if="item.type === 'ImageBox'" class="imagebox-empty">🖼</div>
        <!-- Componente dinámico: renderiza el componente correspondiente con `item.props` -->
        <component v-else :is="componentMap[item.type]" v-bind="item.props" />
      </div>
      <!-- Botón eliminar: visible solo en modo edición; usamos @click.stop para no propagar el evento al canvas -->
      <button v-if="editing" class="remove-btn" @click.stop="removeItem(item.id)" aria-label="Eliminar">✕</button>
    </div>

    <!-- Botón flotante para alternar el modo edición -->
    <button class="edit-fab" @click.stop="editing = !editing">
      {{ editing ? '✕ Cerrar' : '✏ Editar' }}
    </button>

    <!-- Franja invisible a la derecha: al hacer hover abre el drawer (solo en modo editar) -->
    <div v-if="editing" class="drawer-trigger" @mouseenter="drawerOpen = true" />

    <!-- Drawer lateral derecho: contiene el panel de props o la paleta según `editingItem` -->
    <aside v-if="editing" class="drawer" :class="{ open: drawerOpen }" @mouseleave="drawerOpen = false" @click.stop>
      <!-- Si hay un item seleccionado mostramos su panel de propiedades -->
      <template v-if="editingItem">
        <!-- Cabecera del panel con botón de volver y el tipo del item -->
        <div class="drawer-header">
          <button class="back-btn" @click="editingItem = null">← Volver</button>
          <span class="drawer-title">{{ editingItem.type }}</span>
        </div>

        <!-- Lista de propiedades editables basada en `propSchemas[item.type]`. -->
        <!-- Cada `field` tiene { key, label, type }. Los inputs se enlazan a `stagedProps[item.id][field.key]`. -->
        <div class="prop-list" v-if="stagedProps[editingItem.id]">
          <div v-for="field in (propSchemas[editingItem.type] ?? [])" :key="field.key" class="prop-field"
            :class="{ 'prop-field--inline': field.type === 'checkbox' }">
            <label>{{ field.label }}</label>
            <!-- textarea para textos largos -->
            <textarea v-if="field.type === 'textarea'" v-model="stagedProps[editingItem.id][field.key]" rows="3" />
            <!-- campo imagen: muestra preview si hay dataURL y permite subir archivo -->
            <div v-else-if="field.type === 'image'" class="image-upload-field">
              <img v-if="stagedProps[editingItem.id][field.key]" :src="stagedProps[editingItem.id][field.key]"
                class="image-field-preview" />
              <div v-else class="image-field-empty">Sin imagen</div>
              <input type="file" accept="image/*" @change="onImagePropFile" />
            </div>
            <!-- checkbox, number o input genérico según el schema -->
            <input v-else-if="field.type === 'checkbox'" type="checkbox"
              v-model="stagedProps[editingItem.id][field.key]" />
            <input v-else-if="field.type === 'number'" type="number"
              v-model.number="stagedProps[editingItem.id][field.key]" />
            <input v-else :type="field.type" v-model="stagedProps[editingItem.id][field.key]" />
          </div>
          <p v-if="!(propSchemas[editingItem.type] ?? []).length" class="no-props">Sin propiedades editables</p>
        </div>
        <div v-else class="prop-list">
          <p class="no-props">Cargando propiedades...</p>
        </div>
      </template>

      <!-- Si no hay item seleccionado mostramos la paleta de componentes -->
      <template v-else>
        <h3>Componentes</h3>
        <p class="drawer-hint">Arrastra al canvas · Doble clic para editar props</p>

        <!-- Export / Import: exportLayout descarga JSON; triggerImport abre el input oculto -->
        <div class="json-actions">
          <button class="json-btn" @click="exportLayout">⬇ Exportar JSON</button>
          <button class="json-btn" @click="triggerImport">⬆ Importar JSON</button>
          <input ref="fileInputRef" type="file" accept=".json" style="display:none" @change="onFileSelected" />
        </div>

        <!-- Paleta: cada elemento es arrastrable y establece `component` en dataTransfer -->
        <div class="palette">
          <div class="palette-item" v-for="c in palette" :key="c.type" draggable="true"
            @dragstart="e => e.dataTransfer.setData('component', c.type)">
            <span class="palette-label">{{ c.label }}</span>
            <!-- Vista previa reducida del componente usando defaultPropsMap -->
            <div class="palette-preview">
              <div v-if="c.type === 'TextBox'" class="textbox-el" :style="textboxStyle(defaultPropsMap.TextBox)">Texto
              </div>
              <div v-else-if="c.type === 'ImageBox'" class="imagebox-palette-icon">🖼</div>
              <component v-else :is="componentMap[c.type]" v-bind="defaultPropsMap[c.type] ?? {}" />
            </div>
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<style scoped>
/* Canvas: superficie principal donde se colocan los items.
   - Referenciado desde el script como `canvasEl`.
   - Ocupa todo el área disponible (`inset: 0`) y recorta el contenido fuera del área.
   - Las variables CSS (`--color-*`) permiten adaptar el tema desde fuera.
*/
.canvas {
  position: relative;
  min-height: 100vh; /* Al menos la altura del viewport; crecerá si los items requieren más espacio */
  background: var(--color-bg, #fff);
  overflow: visible;
}

/* Cuadrícula visible solo en modo edición.
   - Generada con dos gradientes; `background-size: 16px` debe coincidir
     con la constante `grid = 16` definida en el script para snap.
*/
.canvas.editing {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Items colocados: posicionamiento absoluto dentro del canvas.
   - Cada `.placed-item` se posiciona por `left/top` controlados en JS.
   - `data-id` es usado por interact.js para enlazar eventos drag/resize.
*/
.placed-item {
  position: absolute;
  display: block;
  padding: 4px;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
}

/* Contenedor interno que fuerza al contenido a ocupar todo el cuadro.
   - Útil para componentes renderizados dinamicamente via `:is`.
*/
.item-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
}

/* Forzamos que el elemento raíz del componente hijo llene el área.
   - Se usa `:deep(> *)` para alcanzar al node renderizado dentro del shadow.
*/
.item-content :deep(> *) {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

/* TextBox: estilo base. Los estilos específicos (tamaño, color) se aplican inline. */
.textbox-el {
  display: block;
  width: 100%;
}

/* Estados visuales relacionados con la interacción/edición. */
.placed-item.is-editing {
  cursor: grab;
  outline: 1px dashed rgba(0, 0, 0, 0.15);
}

.placed-item.is-editing:hover {
  outline: 1px dashed var(--color-primary, #4a90e2);
}

.placed-item.selected {
  outline: 2px solid var(--color-primary, #4a90e2) !important;
}

.placed-item.dragging {
  cursor: grabbing !important;
  opacity: 0.85;
}

/* Indicador de resize (esquina inferior derecha). Visual only. */
.placed-item.is-editing::after {
  content: '';
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--color-primary, #4a90e2);
  border-bottom: 2px solid var(--color-primary, #4a90e2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms;
}

.placed-item.is-editing:hover::after,
.placed-item.selected::after {
  opacity: 1;
}

/* Botón eliminar: pequeño circulo fuera del borde superior derecho del item. */
.remove-btn {
  position: absolute;
  right: -8px;
  top: -8px;
  background: #ff5e5e;
  color: #fff;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.7rem;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  padding: 0;
  z-index: 5;
}

/* Botón flotante para alternar el modo edición (corner FAB). */
.edit-fab {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.15));
  background: var(--color-surface, #fff);
  cursor: pointer;
  font-size: 0.85rem;
  z-index: 60;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Franja invisible para activar el drawer al hover en modo editar. */
.drawer-trigger {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  z-index: 50;
}

/* Drawer lateral: panel que se oculta con translateX y se muestra con `.open`. */
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 270px;
  background: var(--color-surface, #fafafa);
  border-left: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 200ms ease;
  z-index: 45;
  overflow-y: auto;
  padding: 0.75rem;
  box-sizing: border-box;
}

.drawer.open {
  transform: translateX(0);
}

.drawer h3 {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
}

.drawer-hint {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  color: var(--color-muted, #999);
}

/* Export / Import: botones y contenedor para acciones JSON. */
.json-actions {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.json-btn {
  padding: 0.35rem 0.6rem;
  border-radius: 5px;
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.15));
  background: var(--color-bg, #f0f0f0);
  color: var(--color-text, #333);
  font-size: 0.78rem;
  cursor: pointer;
  text-align: left;
}

.json-btn:hover {
  background: var(--color-surface, #e8e8e8);
}

/* Paleta: lista vertical de componentes arrastrables (drag sources). */
.palette {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

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

.palette-item:active {
  cursor: grabbing;
}

.palette-label {
  font-size: 0.78rem;
  min-width: 64px;
  color: var(--color-text, #333);
}

.palette-preview {
  pointer-events: none;
  transform: scale(0.72);
  transform-origin: left center;
  overflow: hidden;
  max-width: 120px;
}

/* Props panel: cabecera, campos y layout. */
.drawer-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary, #4a90e2);
  padding: 0;
  font-size: 0.85rem;
}

.drawer-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #333);
}

.prop-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prop-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.prop-field label {
  font-size: 0.75rem;
  color: var(--color-muted, #888);
}

.prop-field input {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.15));
  border-radius: 4px;
  font-size: 0.85rem;
  background: var(--color-bg, #fff);
  color: var(--color-text, #333);
  outline: none;
}

.prop-field input:focus {
  border-color: var(--color-primary, #4a90e2);
}

.no-props {
  font-size: 0.8rem;
  color: var(--color-muted, #888);
  margin: 0;
}

/* TextBox / ImageBox: estilos básicos dentro del canvas. */
.textbox-el {
  display: block;
  width: 100%;
  word-break: break-word;
}

.imagebox-el {
  display: block;
  border-radius: 3px;
}

.imagebox-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 3px;
  font-size: 1.8rem;
  color: rgba(0, 0, 0, 0.3);
}

.imagebox-palette-icon {
  font-size: 1.2rem;
  line-height: 1;
  color: rgba(0, 0, 0, 0.4);
}

/* Variantes del panel de props: textarea y campos inline */
.prop-field textarea {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.15));
  border-radius: 4px;
  font-size: 0.85rem;
  background: var(--color-bg, #fff);
  color: var(--color-text, #333);
  outline: none;
  resize: vertical;
  font-family: inherit;
}

.prop-field textarea:focus {
  border-color: var(--color-primary, #4a90e2);
}

.prop-field--inline {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.prop-field--inline label {
  margin: 0;
}

/* Image upload field: preview + estado vacío dashed */
.image-upload-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.image-field-preview {
  width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.15));
}

.image-field-empty {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-size: 0.78rem;
  color: var(--color-muted, #999);
  border: 1px dashed rgba(0, 0, 0, 0.15);
}

.image-upload-field input[type="file"] {
  font-size: 0.75rem;
  cursor: pointer;
}
</style>
