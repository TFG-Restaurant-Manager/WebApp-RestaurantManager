<template>
  <main class="home-view">
    <h1>Bienvenido</h1>
    <p>Accede a tu restaurante escribiendo su slug en la URL.</p>
    <p>Ejemplo: <code>/pizzeria-luigi</code></p>
    <button> <a href="/pizzeria-luigi">Ir a Pizzería Luigi</a> </button>
    <p>Ejemplo: <code>/restaurante-pepe</code></p>
    <button> <a href="/restaurante-pepe">Ir a Restaurante Pepe</a> </button>
  </main>
</template>

<style scoped>
.home-view {
  padding: 3rem;
  text-align: center;
}
</style>
