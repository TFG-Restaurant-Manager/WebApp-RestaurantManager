import interact from 'interactjs'

/**
 * Crea una función `setupInteractFor(id)` ligada a los refs y opciones pasadas.
 * Esto permite extraer la lógica de interact.js fuera del componente.
 * @param {{items: import('vue').Ref, canvasEl: import('vue').Ref, editing: import('vue').Ref, grid:number}} opts
 */
export function createSetupInteractFor({ items, canvasEl, editing, grid }) {
  function snap(v) { return Math.round(v / grid) * grid }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

  /**
   * Recalcula y ajusta la altura del canvas para que cubra todos los placed-items.
   * Esto permite que la página haga scroll cuando los items se colocan fuera
   * del viewport (los items siguen siendo position:absolute dentro del canvas).
   */
  function recalcCanvasSize() {
    const c = canvasEl.value
    if (!c) return
    const placed = c.querySelectorAll('.placed-item')
    let maxBottom = 0
    for (const el of placed) {
      const top = parseFloat(el.style.top) || el.offsetTop || 0
      const h = el.offsetHeight || 0
      maxBottom = Math.max(maxBottom, top + h)
    }
    const desired = Math.max(window.innerHeight, Math.ceil(maxBottom + 24))
    c.style.height = desired + 'px'
  }

  return function setupInteractFor(id) {
    const el = canvasEl.value?.querySelector(`[data-id="${id}"]`)
    const item = items.value.find(i => i.id === id)
    if (el && item) {
      el.style.left = item.x + 'px'
      el.style.top = item.y + 'px'
      if (item.w) el.style.width = item.w + 'px'
      if (item.h) el.style.height = item.h + 'px'
      // Aseguramos que el canvas cubra este item (evita recorte cuando crece el contenido)
      recalcCanvasSize()

      let active = false
      let startX = 0, startY = 0, startPageX = 0, startPageY = 0

      interact(el)
        .draggable({
          inertia: false,
          listeners: {
            start(event) {
              if (editing.value) {
                active = true
                el.classList.add('dragging')
                const it = items.value.find(i => i.id === id)
                startX = it?.x ?? 0; startY = it?.y ?? 0
                startPageX = event.page.x; startPageY = event.page.y
              }
            },
            move(event) {
              if (active) {
                const it = items.value.find(i => i.id === id)
                if (it) {
                  // Clamp usando las dimensiones reales del canvas (offsetWidth/offsetHeight)
                  const maxX = Math.max(0, canvasEl.value.offsetWidth - el.offsetWidth)
                  const maxY = Math.max(0, canvasEl.value.offsetHeight - el.offsetHeight)
                  const nx = snap(clamp(startX + (event.page.x - startPageX), 0, maxX))
                  const ny = snap(clamp(startY + (event.page.y - startPageY), 0, maxY))
                  it.x = nx; it.y = ny
                  el.style.left = nx + 'px'; el.style.top = ny + 'px'
                  // Ajustamos la altura del canvas si el elemento empuja hacia abajo
                  recalcCanvasSize()
                }
              }
            },
            end() { active = false; el.classList.remove('dragging') }
          }
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          margin: 6,
          modifiers: [
            interact.modifiers.snapSize({
              targets: [interact.snappers.grid({ width: grid, height: grid })]
            }),
            interact.modifiers.restrictSize({ minWidth: 32, minHeight: 24 })
          ],
          listeners: {
            start() { if (editing.value) { /* noop */ } },
            move(event) {
              if (editing.value) {
                const it = items.value.find(i => i.id === id)
                if (it) {
                  const { width, height } = event.rect
                  const dl = event.deltaRect.left
                  const dt = event.deltaRect.top
                  const nx = snap(it.x + dl)
                  const ny = snap(it.y + dt)
                  it.x = nx; it.y = ny
                  it.w = snap(width)
                  it.h = snap(height)
                  el.style.left = nx + 'px'
                  el.style.top = ny + 'px'
                  el.style.width = it.w + 'px'
                  el.style.height = it.h + 'px'
                  // La nueva altura/posición puede requerir que el canvas crezca
                  recalcCanvasSize()
                }
              }
            }
          }
        })
    }
  }
}
