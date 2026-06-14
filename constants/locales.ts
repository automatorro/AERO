export const translations = {
  en: {
    landing_tagline: "Subscriptions · Fair prices",
    landing_headline_1: "Negotiate the ride.",
    landing_headline_2: "Subscribe and\nride.",
    landing_subtext: "A driver–passenger marketplace where you propose\nthe price and choose the plan that suits you.",
    landing_passenger_btn: "I'm a passenger",
    landing_driver_btn: "I'm a driver",
    landing_login_q: "Already have an account? ",
    landing_login_link: "Log in",
  },
  ro: {
    landing_tagline: "Abonamente · Prețuri corecte",
    landing_headline_1: "Negociază prețul cursei.",
    landing_headline_2: "Abonează-te și\ncălătorește.",
    landing_subtext: "Un marketplace șofer–pasager unde tu propui\nprețul și alegi planul care ți se potrivește.",
    landing_passenger_btn: "Sunt pasager",
    landing_driver_btn: "Sunt șofer",
    landing_login_q: "Ai deja cont? ",
    landing_login_link: "Conectează-te",
  },
  es: {
    landing_tagline: "Suscripciones · Precios justos",
    landing_headline_1: "Negocia tu viaje.",
    landing_headline_2: "Suscríbete y\nviaja.",
    landing_subtext: "Un marketplace conductor-pasajero donde tú propones\nel precio y eliges el plan que te conviene.",
    landing_passenger_btn: "Soy pasajero",
    landing_driver_btn: "Soy conductor",
    landing_login_q: "¿Ya tienes cuenta? ",
    landing_login_link: "Iniciar sesión",
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
