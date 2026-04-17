<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: [String, Number, Boolean, Object], default: null },
    options: {
        type: Array,
        default: () => [
            { label: 'Option 1' },
            { label: 'Option 2' }
        ]
    },
    name: { type: String, default: '' },
    expandRatio: { type: Number, default: 1.4 },
    maxExpandFraction: { type: Number, default: 0.6 }
})

const emit = defineEmits(['update:modelValue', 'change'])

const normalizedOptions = computed(() =>
    props.options.map(rawOption => {
        if (typeof rawOption === 'string') return { label: rawOption }
        const { value, ...rest } = rawOption
        return { ...rest, label: rest.label ?? String(value ?? '') }
    })
)

const widths = computed(() => {
    const optionsList = normalizedOptions.value
    let result = []

    if (optionsList.length === 0) {
        result = []
    } else {
        const weights = optionsList.map(optionItem => (optionItem.label === props.modelValue ? props.expandRatio : 1))
        const totalWeight = weights.reduce((acc, w) => acc + w, 0)
        const percentValues = weights.map(w => (w / totalWeight) * 100)

        const maxFrac = Math.max(0, Math.min(1, props.maxExpandFraction))
        const selectedIndex = optionsList.findIndex(optionItem => optionItem.label === props.modelValue)
        if (selectedIndex >= 0) {
            const cap = maxFrac * 100
            if (percentValues[selectedIndex] > cap) {
                const remaining = 100 - cap
                const otherTotal = percentValues.reduce((sum, p, i) => sum + (i === selectedIndex ? 0 : p), 0)
                if (otherTotal <= 0) {
                    const otherCount = Math.max(1, optionsList.length - 1)
                    const each = remaining / otherCount
                    result = optionsList.map((_, i) => (i === selectedIndex ? `${cap}%` : `${each}%`))
                } else {
                    result = percentValues.map((p, i) => (i === selectedIndex ? `${cap}%` : `${(p / otherTotal) * remaining}%`))
                }
            } else {
                result = percentValues.map(p => `${p}%`)
            }
        } else {
            result = percentValues.map(p => `${p}%`)
        }
    }

    return result
})

function widthFor(option) {
    const normalized = normalizedOptions.value
    const fallback = `${100 / Math.max(1, normalized.length)}%`
    const index = normalized.findIndex(candidateOption => candidateOption.label === option.label)
    let result = fallback
    if (index !== -1) {
        result = widths.value[index] ?? fallback
    }
    return result
}

function minWidthFor(option) {
    const label = String(option?.label ?? '')
    const approxCharPx = 8
    const paddingPx = 36
    const calculated = Math.max(84, label.length * approxCharPx + paddingPx)
    return `${calculated}px`
}

function select(option) {
    let didUpdate = false
    if (option.label !== props.modelValue) {
        emit('update:modelValue', option.label)
        emit('change', option.label)
        didUpdate = true
    }
    return didUpdate
}

function isActive(option) {
    return option.label === props.modelValue
}

function handlePress(event) {
    const element = event.currentTarget
    element.classList.remove('is-pressed')
    void element.offsetWidth
    element.classList.add('is-pressed')
}

function onAnimationEnd(event) {
    const element = (event && event.currentTarget) || (event && event.target) || null
    if (element && element.classList) element.classList.remove('is-pressed')
}
</script>

<template>
    <div class="segmented-buttons" role="tablist" :aria-label="name || 'Segmented buttons'">
        <button v-for="(option, index) in normalizedOptions" :key="option.label ?? index"
            :class="['seg-btn', { 'is-active': isActive(option) }]" type="button" :aria-pressed="isActive(option)"
            role="tab"
            :style="{ width: widthFor(option), minWidth: minWidthFor(option), '--seg-scale': (1 / props.expandRatio) }"
            @click="(e) => { select(option); handlePress(e) }" @animationend="onAnimationEnd">
            {{ option.label }}
        </button>
    </div>
</template>

<style scoped>
.segmented-buttons {
    display: flex;
    width: 100%;
    border-radius: 10px;
    overflow: visible;
    align-items: center;
}


.seg-btn {
    box-sizing: border-box;
    padding: 0.45rem 2rem;
    background-color: var(--color-surface, #fff);
    color: var(--color-text, #111);
    font-weight: 600;
    cursor: pointer;
    transition:
        width 280ms cubic-bezier(.2, .8, .2, 1),
        background-color 160ms ease,
        box-shadow 220ms cubic-bezier(.2, .8, .2, 1),
        transform 220ms cubic-bezier(.2, .8, .2, 1);
    user-select: none;
    will-change: width, box-shadow, transform;
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 54px;
    overflow: visible;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-radius: 10px;
    border: 1px solid rgba(33, 53, 71, 0.06);
    background-clip: padding-box;
    box-shadow: 0 12px 24px rgba(33, 53, 71, 0.06);
    transform: translateY(0) scaleX(1);
    transform-origin: center center;
}

.seg-btn+.seg-btn {
    margin-left: 10px;
}

.seg-btn:hover {
    background-color: rgba(0, 0, 0, 0.04);
}

.seg-btn.is-active {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    box-shadow: 0 28px 60px rgba(33, 53, 71, 0.18);
    z-index: 4;
    transform: translateY(-8px) scaleX(1);
    border-color: rgba(0, 0, 0, 0.0);
}

.seg-btn.is-pressed {
    animation: press 200ms cubic-bezier(.2, .8, .2, 1) both;
}
.seg-btn.is-active.is-pressed {
    animation: press-active 260ms cubic-bezier(.2, .8, .2, 1) both;
}

@keyframes press {

    0% {
        transform: translateY(0) scaleX(1);
    }

    50% {
        transform: translateY(2px) scaleX(1);
    }

    100% {
        transform: translateY(0) scaleX(1);
    }
}

@keyframes press-active {
  0% {
        transform: translateY(-8px) scaleX(1);
    }

    50% {
        transform: translateY(0) scaleX(1);
    }

    100% {
        transform: translateY(-8px) scaleX(1);
    }
}
</style>
