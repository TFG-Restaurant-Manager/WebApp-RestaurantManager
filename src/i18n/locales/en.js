export default {
  nav: {
    inicio: 'Home',
    caracteristicas: 'Features',
    precios: 'Pricing',
    contacto: 'Contact',
    login: 'Log in',
  },

  main: {
    badge: 'Restaurant management software',
    title: 'Manage your restaurant',
    titleAccent: 'the smart way',
    subtitle: 'RestaurantManager centralizes your menu, orders and kitchen in a single platform. Built so you can focus on what matters: the customer experience.',
    ctaPrimary: 'Get started free',
    ctaSecondary: 'View demo →',
    mockupAlt: 'RestaurantManager on iPhone',
  },

  features: {
    label: 'Features',
    title: 'Everything you need, nothing you don\'t',
    subtitle: 'A complete tool built from day one for real restaurants.',
    items: [
      {
        title: 'Menu management',
        description: 'Create and organize dishes by category, manage prices, availability and ingredients from a centralized panel.',
      },
      {
        title: 'Real-time orders',
        description: 'Orders go straight to the kitchen. No paper, no middlemen. Track status on every screen.',
      },
      {
        title: 'Visual editor',
        description: 'Customize your table layout and menu visuals with a drag & drop editor tailored to your venue.',
      },
      {
        title: 'Employee scheduling',
        description: 'Organize your team\'s shifts, track hours worked and manage absences from a centralized calendar.',
      },
      {
        title: 'Analytics & sales',
        description: 'Check your best-selling dishes, daily revenue and team performance with clear reports.',
      },
      {
        title: 'Roles & permissions',
        description: 'Assign roles to your team: waiter, chef or admin. Each role only accesses what they need.',
      },
    ],
  },

  pricing: {
    label: 'Pricing',
    title: 'Simple and transparent',
    subtitle: 'No surprises. Cancel anytime.',
    plans: [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started.',
        features: [
          '0 restaurants',
          'Up to no dishes',
          'No order management',
          'Email support',
        ],
        cta: 'Get started free',
      },
      {
        name: 'Pro',
        price: '$29',
        period: 'per month',
        description: 'For growing restaurants that need more control and data.',
        features: [
          '1 restaurant',
          'Unlimited dishes',
          'Analytics & sales',
          'Visual editor',
          'Roles & permissions',
          'Priority support',
        ],
        cta: 'Start with Pro',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For restaurant groups with specific needs.',
        features: [
          'Custom integrations',
          'Guaranteed SLA',
          'Dedicated 24/7 support',
          'Onboarding & training',
        ],
        cta: 'Contact sales',
      },
    ],
    popular: 'Most popular',
  },

  auth: {
    tabLogin: 'Log in',
    tabRegister: 'Register',
    fieldName: 'Name',
    fieldNamePlaceholder: 'Your name',
    fieldCode: 'Employee code',
    fieldCodePlaceholder: 'e.g. REST001',
    fieldEmail: 'Email',
    fieldEmailPlaceholder: "you{'@'}email.com",
    fieldPassword: 'Password',
    fieldPasswordPlaceholder: '••••••••',
    fieldPasswordConfirm: 'Confirm password',
    fieldPasswordConfirmPlaceholder: '••••••••',
    submitLogin: 'Log in',
    submitRegister: 'Create account',
    switchToRegisterText: "Don't have an account?",
    switchToRegisterLink: 'Sign up',
    switchToLoginText: 'Already have an account?',
    switchToLoginLink: 'Log in',
    errorPasswordMismatch: 'Passwords do not match.',
  },

  contact: {
    label: 'Contact',
    title: 'Have a question?',
    subtitle: 'Write to us and we\'ll get back to you within 24 hours. You can also reach us directly by email.',
    fields: {
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: "you{'@'}email.com",
      message: 'Message',
      messagePlaceholder: 'Tell us how we can help',
    },
    submit: 'Send message',
    sent: 'Message sent. We\'ll get back to you soon.',
    footer: '© {year} RestaurantManager. All rights reserved.',
  },
}
