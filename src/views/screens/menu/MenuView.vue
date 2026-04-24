<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SegmentedButtonsUnderline from '../../components/SegmentedButtonsUnderline.vue'
import { dishService } from '../../../services/dishService'
import { getRestaurantId } from '../../../stores/restaurantStore'

const route = useRoute()

const dishes = ref([])
const loading = ref(false)
const error = ref(null)
const selectedCategory = ref(null)

/** Categorías derivadas de los platos cargados, en orden de aparición */
const categories = computed(() => {
  const seen = new Set()
  const result = []
  for (const d of dishes.value) {
    if (d.categoryName && !seen.has(d.categoryName)) {
      seen.add(d.categoryName)
      result.push(d.categoryName)
    }
  }
  return result
})

/** Platos filtrados por la categoría activa */
const filteredDishes = computed(() =>
  selectedCategory.value
    ? dishes.value.filter(d => d.categoryName === selectedCategory.value)
    : dishes.value
)

async function loadDishes() {
  loading.value = true
  error.value = null
  try {
    const restaurantId = getRestaurantId(route.params.slug)
    if (!restaurantId) throw new Error('Restaurante no encontrado')

    dishes.value = await dishService.getDishes(restaurantId)
    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0]
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadDishes)
</script>

<template>
  <div class="menu-view">
    <header class="menu-view__header">
      <h1 class="menu-view__title">{{ route.params.slug }}</h1>
    </header>

    <!-- Estado de carga / error -->
    <div v-if="loading" class="menu-view__state">Cargando platos…</div>
    <div v-else-if="error" class="menu-view__state menu-view__state--error">{{ error }}</div>

    <div v-else>
      <!-- Pestañas de categoría -->
      <div class="menu-view__categories">
        <SegmentedButtonsUnderline
          v-model="selectedCategory"
          :options="categories"
        />
      </div>

      <!-- Grid de platos -->
      <div v-if="filteredDishes.length" class="menu-view__grid">
        <article
          v-for="dish in filteredDishes"
          :key="dish.id"
          class="dish-card"
          :class="{ 'dish-card--unavailable': dish.available === false }"
        >
          <div class="dish-card__info">
            <span class="dish-card__name">{{ dish.name }}</span>
            <span v-if="dish.description" class="dish-card__description">{{ dish.description }}</span>
          </div>
          <div class="dish-card__footer">
            <span class="dish-card__price">{{ Number(dish.price).toFixed(2) }} €</span>
            <button
              class="dish-card__add"
              type="button"
              :disabled="dish.available === false"
              aria-label="`Añadir ${dish.name}`"
            >
              +
            </button>
          </div>
        </article>
      </div>

      <p v-else class="menu-view__state">No hay platos en esta categoría.</p>
    </div>
  </div>
</template>

<style scoped>
.menu-view {
  min-height: 100vh;
  background: var(--color-bg, #f5f5f5);
  font-family: inherit;
}

/* ── Header ── */
.menu-view__header {
  padding: 1.25rem 1.5rem 0.75rem;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.menu-view__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: capitalize;
  color: #111;
}

/* ── Pestañas ── */
.menu-view__categories {
  padding: 0 1.5rem;
  background: #fff;
  overflow-x: auto;
}

/* ── Estados ── */
.menu-view__state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #666;
}
.menu-view__state--error {
  color: #c0392b;
}

/* ── Grid ── */
.menu-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

/* ── Tarjeta ── */
.dish-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s;
}
.dish-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
.dish-card--unavailable {
  opacity: 0.5;
}

.dish-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}
.dish-card__name {
  font-weight: 600;
  font-size: 1rem;
  color: #111;
}
.dish-card__description {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.dish-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dish-card__price {
  font-weight: 700;
  font-size: 1.05rem;
  color: #111;
}
.dish-card__add {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary, #2980b9);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.1s;
}
.dish-card__add:hover:not(:disabled) {
  background: var(--color-primary-dark, #1f6697);
}
.dish-card__add:active:not(:disabled) {
  transform: scale(0.92);
}
.dish-card__add:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
