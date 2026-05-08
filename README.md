# WebApp — RestaurantManager

Landing page de marketing para el software **RestaurantManager**, construida con Vue 3 + Vite.

---

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 20.19.0 / ≥ 22.12.0 |
| npm         | 10+            |
| Docker      | Opcional, para desarrollo en contenedor |

---

## Variables de entorno

Crea un archivo **`.env`** en la raíz del proyecto. **Nunca lo subas al repositorio.**

```env
# URL base de la API REST del backend (debe terminar en /)
VITE_API_BASE_URL=https://api.restaurantmanager.example.com/

# Client ID de PayPal (sandbox o producción)
VITE_PAYPAL_CLIENT_ID=tu_client_id_de_paypal
```

| Archivo              | Cuándo se carga           |
|----------------------|---------------------------|
| `.env`               | Siempre                   |
| `.env.local`         | Siempre, ignorado por git |
| `.env.development`   | Solo en `npm run dev`     |
| `.env.production`    | Solo en `npm run build`   |

> Las variables deben empezar por `VITE_` para ser accesibles en el cliente con `import.meta.env.VITE_*`.

---

## Instalación y desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

---

## Build de producción

```bash
npm run build      # Genera dist/
npm run preview    # Previsualiza el build en local
```

---

## Estructura del proyecto

```
src/
├── main.js                         # Entrada: crea la app, registra i18n y Font Awesome
├── App.vue                         # Componente raíz
│
├── assets/
│   └── styles/
│       └── variables.css           # Variables CSS globales (paleta light/dark)
│
├── i18n/
│   ├── index.js                    # Instancia vue-i18n (detección de idioma)
│   └── locales/
│       ├── es.js                   # Traducciones en español
│       └── en.js                   # Traducciones en inglés
│
├── api/
│   └── apiClient.js                # Cliente HTTP (axios). Inyecta JWT automáticamente.
│
├── repository/
│   ├── authRepository.js           # Endpoints de auth (POST /auth/employeeLogin)
│   └── restaurantRepository.js     # Endpoints de restaurante (POST/DELETE /restaurant)
│
├── services/
│   ├── authService.js              # Lógica de autenticación
│   └── restaurantService.js        # Lógica de gestión del restaurante
│
├── composables/
│   ├── useAuth.js                  # Estado reactivo global: user, token, login, logout…
│   └── useTheme.js                 # Estado reactivo del tema light/dark
│
└── views/
    ├── home/
    │   ├── HomeView.vue            # Ensambla todas las secciones de la landing
    │   ├── header/
    │   │   └── AppHeader.vue       # Header sticky: logo, nav, toggles, menú de usuario
    │   ├── main/
    │   │   └── MainSection.vue     # Hero (id="inicio")
    │   ├── features/
    │   │   └── FeaturesSection.vue # Características del producto (id="caracteristicas")
    │   ├── pricing/
    │   │   └── PricingSection.vue  # Planes y precios (id="precios")
    │   └── contact/
    │       └── ContactSection.vue  # Formulario de contacto + footer (id="contacto")
    └── components/
        ├── AuthCard.vue            # Dropdown de login en el header
        ├── RestaurantRegisterModal.vue  # Modal de registro (datos + pago PayPal)
        ├── BaseButton.vue          # Botón base (variant: primary | outline)
        ├── LangToggle.vue          # Toggle ES/EN
        ├── SegmentedButtons.vue    # Nav con animación de ancho activo
        └── ThemeToggle.vue         # Toggle dark/light
```

---

## Autenticación

El flujo sigue el patrón **Repository → Service → Composable**:

1. **`apiClient.js`** — cliente axios. Un interceptor de request añade `Authorization: Bearer <token>` automáticamente en todas las peticiones cuando hay sesión activa.
2. **`authRepository.js`** — encapsula el endpoint de login (`POST /auth/employeeLogin`).
3. **`authService.js`** — lógica de negocio.
4. **`useAuth.js`** — composable singleton con estado reactivo (`user`, `token`, `loading`, `error`). Compartido por todos los componentes.

### Flujo de registro

El registro de un nuevo restaurante se hace a través del modal `RestaurantRegisterModal`:

1. El usuario rellena los datos del restaurante y del gerente (empleado admin).
2. Se muestra el botón de PayPal para completar el pago.
3. Al aprobar el pago, se llama a `POST /api/restaurant` con todos los datos.
4. La respuesta incluye un JWT con el que se inicia sesión automáticamente.

### Flujo de login

El login se hace desde el dropdown `AuthCard` en el header:

- Endpoint: `POST /api/auth/employeeLogin`
- Body: `{ code: string, password: string }`
- Respuesta esperada: `{ token: string, role: string }`

### Baja de cuenta

Desde el menú de usuario (icono en el header) → *Borrar datos y darse de baja*:

- Muestra un diálogo de confirmación.
- Llama a `DELETE /api/restaurant` con el JWT en la cabecera.
- Si tiene éxito, cierra la sesión y muestra un toast de confirmación.

---

## Internacionalización (i18n)

- Librería: **vue-i18n v11** (`legacy: false`, Composition API).
- Idiomas: **español** (`es`) e **inglés** (`en`).
- Detección: `localStorage.getItem('lang')` → `navigator.language` → fallback `es`.
- El usuario cambia el idioma con **LangToggle**; la preferencia se persiste en `localStorage`.

---

## Tema (dark / light)

- Gestionado por el composable `useTheme.js`.
- Persiste en `localStorage`.
- Se alterna con el botón **ThemeToggle** en el header.
- Las variables de color se definen en `variables.css` y cambian según el atributo `data-theme` en `<html>`.

---

## Dependencias principales

| Paquete | Uso |
|---------|-----|
| `vue` | Framework principal |
| `vue-i18n` | Internacionalización |
| `axios` | Cliente HTTP |
| `@paypal/paypal-js` | SDK de PayPal para el pago del registro |
| `@fortawesome/vue-fontawesome` | Iconos SVG |
| `vite` | Bundler y servidor de desarrollo |

---

## Entorno de desarrollo simulado

En modo `development`, `main.js` inyecta automáticamente una sesión falsa para poder desarrollar sin levantar el backend:

```js
if (import.meta.env.DEV) {
  const { setUser } = useAuth()
  setUser({ code: '00001', name: 'Dev User' })
}
```

Esto simula un usuario logueado y permite probar el menú de usuario, la baja de cuenta, etc.

---

## IDE recomendado

[VS Code](https://code.visualstudio.com/) con la extensión [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar).
