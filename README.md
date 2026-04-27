# WebApp — RestaurantManager

Landing page de marketing para el software **RestaurantManager**, construida con Vue 3 + Vite.

---

## Requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 20.19.0 / 22.12.0+ |
| npm         | 10+           |

---

## Instalación

```bash
npm install
```

---

## Variables de entorno

Crea un archivo **`.env`** en la raíz del proyecto (cópialo desde `.env.example`).  
**Nunca lo subas al repositorio** — está incluido en `.gitignore`.

```env
# URL base de la API REST del backend
VITE_API_BASE_URL=https://api.restaurantmanager.example.com
```

> Accede a las variables en el código con `import.meta.env.VITE_NOMBRE_VARIABLE`.

| Archivo              | Cuándo se carga              |
|----------------------|------------------------------|
| `.env`               | Siempre                      |
| `.env.local`         | Siempre, ignorado por git    |
| `.env.development`   | Solo en `npm run dev`        |
| `.env.production`    | Solo en `npm run build`      |

---

## Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

---

## Generar distribución (build)

```bash
npm run build
```

Los archivos de producción se generan en **`dist/`**.  
Para previsualizar el build antes de desplegar:

```bash
npm run preview
```

---

## Estructura del proyecto

```
src/
├── main.js                        # Entrada: crea la app, registra router, i18n y Font Awesome
├── App.vue                        # Componente raíz (RouterView)
│
├── assets/
│   └── styles/
│       └── variables.css          # Variables CSS globales (paleta light/dark, transiciones)
│
├── router/
│   └── index.js                   # Rutas de la SPA (actualmente solo /)
│
├── i18n/
│   ├── index.js                   # Instancia vue-i18n (legacy: false, detección de idioma)
│   └── locales/
│       ├── es.js                  # Traducciones en español
│       └── en.js                  # Traducciones en inglés
│
├── api/
│   └── apiClient.js                   # Cliente HTTP base (fetch + VITE_API_BASE_URL)
│
├── repository/
│   └── authRepository.js              # Llamadas crudas a /auth/* (login, register, logout, me)
│
├── services/
│   └── authService.js             # Lógica de negocio de autenticación (token en localStorage)
│
├── composables/
│   ├── useAuth.js                 # Estado reactivo de auth (user, loading, error, login…)
│   └── useTheme.js                # Estado reactivo del tema light/dark (persiste en localStorage)
│
└── views/
    ├── home/
    │   ├── HomeView.vue           # Ensambla todas las secciones de la landing
    │   ├── header/
    │   │   └── AppHeader.vue      # Header sticky: logo, nav, ThemeToggle, LangToggle, login
    │   ├── main/
    │   │   └── MainSection.vue    # Hero / sección principal (id="inicio")
    │   ├── features/
    │   │   └── FeaturesSection.vue # Características del producto (id="caracteristicas")
    │   ├── pricing/
    │   │   └── PricingSection.vue  # Planes y precios (id="precios")
    │   └── contact/
    │       └── ContactSection.vue  # Formulario de contacto + footer (id="contacto")
    └── components/                # Componentes reutilizables
        ├── AuthCard.vue           # Card de login/registro (dropdown en el header)
        ├── BaseButton.vue         # Botón base (variant: primary | outline)
        ├── BaseInput.vue          # Input base
        ├── LangToggle.vue         # Toggle ES/EN (persiste en localStorage)
        ├── SegmentedButtons.vue   # Botones segmentados con animación de ancho
        └── ThemeToggle.vue        # Toggle dark/light mode con animación SVG
```

---

## Autenticación

El flujo de auth sigue el patrón **Repository → Service → Composable**:

1. `apiClient.js` — realiza las peticiones HTTP al backend.
2. `authRepository.js` — encapsula los endpoints (`/auth/login`, `/auth/register`, etc.).
3. `authService.js` — lógica de negocio: guarda/lee el JWT en `localStorage`.
4. `useAuth.js` — composable con estado reactivo; úsalo en cualquier componente.

El formulario de login/registro se muestra como **dropdown** desde el header (componente `AuthCard`), sin navegar a otra ruta.

---

## Internacionalización (i18n)

- Librería: **vue-i18n v11** (`legacy: false`, Composition API).
- Idiomas disponibles: **español** (`es`) e **inglés** (`en`).
- Detección automática: `localStorage.getItem('lang')` → `navigator.language` → fallback `es`.
- El usuario puede cambiar el idioma con el botón **LangToggle** en el header; la preferencia se persiste en `localStorage`.


---

## Dependencias principales

| Paquete | Uso |
|---------|-----|
| `vue` | Framework principal |
| `vue-router` | Navegación SPA |
| `@fortawesome/vue-fontawesome` | Iconos SVG |
| `@fortawesome/free-solid-svg-icons` | Pack de iconos solid |

---

## IDE recomendado

[VS Code](https://code.visualstudio.com/) con la extensión [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

---

## Despliegue

El contenido de `dist/` es estático y puede alojarse en cualquier CDN o servidor:

- **Netlify / Vercel**: conecta el repositorio y configura `npm run build` como comando de build y `dist` como directorio de publicación.
- **Servidor propio (nginx)**: sirve `dist/` y redirige todas las rutas a `index.html` (necesario para el history mode del router).

Ejemplo de configuración nginx:

```nginx
location / {
    root /var/www/dist;
    try_files $uri $uri/ /index.html;
}
```

---

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
