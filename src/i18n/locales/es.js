export default {
  nav: {
    inicio: 'Inicio',
    caracteristicas: 'Características',
    precios: 'Precios',
    contacto: 'Contacto',
    login: 'Iniciar sesión',
  },

  main: {
    badge: 'Software de gestión para restaurantes',
    title: 'Gestiona tu restaurante',
    titleAccent: 'de forma inteligente',
    subtitle: 'RestaurantManager centraliza tu menú, pedidos y cocina en una sola plataforma. Diseñada para que tú te enfoques en lo que importa: la experiencia del cliente.',
    ctaPrimary: 'Empieza gratis',
    ctaSecondary: 'Ver demo →',
    mockupAlt: 'RestaurantManager en iPhone',
  },

  features: {
    label: 'Características',
    title: 'Todo lo que necesitas, nada de lo que no',
    subtitle: 'Una herramienta completa pensada desde el primer día para restaurantes reales.',
    items: [
      {
        title: 'Gestión de menú',
        description: 'Crea y organiza platos por categorías, gestiona precios, disponibilidad e ingredientes desde un panel centralizado.',
      },
      {
        title: 'Pedidos en tiempo real',
        description: 'Los pedidos llegan directamente a cocina. Sin papel, sin intermediarios. Seguimiento de estado en cada pantalla.',
      },
      {
        title: 'Editor visual',
        description: 'Personaliza la disposición de mesas y la carta visual con un editor drag & drop adaptado a tu local.',
      },
      {
        title: 'Horarios de empleados',
        description: 'Organiza los turnos de tu equipo, controla horas trabajadas y gestiona ausencias desde un calendario centralizado.',
      },
      {
        title: 'Estadísticas y ventas',
        description: 'Consulta los platos más vendidos, ingresos por día y rendimiento de tu equipo con informes claros.',
      },
      {
        title: 'Roles y permisos',
        description: 'Asigna roles a tu equipo: camarero, cocinero o administrador. Cada rol accede solo a lo que necesita.',
      },
    ],
  },

  pricing: {
    label: 'Precios',
    title: 'Simple y transparente',
    subtitle: 'Sin sorpresas. Cancela cuando quieras.',
    plans: [
      {
        name: 'Free',
        price: '0€',
        period: 'para siempre',
        description: 'Perfecto para empezar a perder tu tiempo.',
        features: [
          '0 restaurantes',
          'Hasta ningún plato',
          'Gestión de pedidos nula',
          'Soporte por email',
        ],
        cta: 'Empieza gratis',
      },
      {
        name: 'Pro',
        price: '29€',
        period: 'al mes',
        description: 'Para restaurantes en crecimiento que necesitan más control y datos.',
        features: [
          '1 restaurante',
          'Platos ilimitados',
          'Estadísticas y ventas',
          'Editor visual',
          'Roles y permisos',
          'Soporte prioritario',
        ],
        cta: 'Empezar con Pro',
      },
      {
        name: 'Enterprise',
        price: 'A medida',
        period: '',
        description: 'Para grupos de restauración con necesidades específicas.',
        features: [
          'Integraciones personalizadas',
          'SLA garantizado',
          'Soporte dedicado 24/7',
          'Onboarding y formación',
        ],
        cta: 'Contactar ventas',
      },
    ],
    popular: 'Más popular',
  },

  auth: {
    tabLogin: 'Iniciar sesión',
    tabRegister: 'Registrarse',
    fieldName: 'Nombre',
    fieldNamePlaceholder: 'Tu nombre',
    fieldEmail: 'Email',
    fieldEmailPlaceholder: "tu{'@'}email.com",
    fieldPassword: 'Contraseña',
    fieldPasswordPlaceholder: '••••••••',
    fieldPasswordConfirm: 'Confirmar contraseña',
    fieldPasswordConfirmPlaceholder: '••••••••',
    submitLogin: 'Iniciar sesión',
    submitRegister: 'Crear cuenta',
    switchToRegisterText: '¿No tienes cuenta?',
    switchToRegisterLink: 'Regístrate',
    switchToLoginText: '¿Ya tienes cuenta?',
    switchToLoginLink: 'Inicia sesión',
    errorPasswordMismatch: 'Las contraseñas no coinciden.',
  },

  contact: {
    label: 'Contacto',
    title: '¿Tienes alguna pregunta?',
    subtitle: 'Escríbenos y te respondemos en menos de 24 horas. También puedes contactarnos directamente por email.',
    fields: {
      name: 'Nombre',
      namePlaceholder: 'Tu nombre',
      email: 'Email',
      emailPlaceholder: "tu{'@'}email.com",
      message: 'Mensaje',
      messagePlaceholder: 'Cuéntanos en qué podemos ayudarte',
    },
    submit: 'Enviar mensaje',
    sent: 'Mensaje enviado. Te contestamos pronto.',
    footer: '© {year} RestaurantManager. Todos los derechos reservados.',
  },
}
