<script setup>

</script>

<template>
    <svg viewBox="0 0 50 50" class="spinner">
        <path class="path" d="M 25 5 A 20 20 0 1 1 24.99 5" fill="none" stroke="#000000" stroke-width="4"
            pathLength="100" />
    </svg>
</template>

<style scoped>
.spinner {
    width: 50px;
    animation: girar 2s linear infinite;

}

.path {
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
    animation: progreso 2s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes girar {
    to {
        transform: rotate(360deg);
    }
}

@keyframes progreso {
    0% {
        stroke-dashoffset: 100;
    }

    50% {
        stroke-dashoffset: 0;
    }
    100% {
        stroke-dashoffset: -100;
    }
}
</style>