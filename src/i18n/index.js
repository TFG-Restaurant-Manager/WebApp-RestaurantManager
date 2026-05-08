import { createI18n } from 'vue-i18n'
import es from './locales/es.js'
import en from './locales/en.js'

/** Idioma guardado por el usuario, o el del navegador si no hay preferencia. */
const stored = localStorage.getItem('lang')
const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
const locale = stored ?? browserLang

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'es',
  messages: { es, en },
})

export default i18n
