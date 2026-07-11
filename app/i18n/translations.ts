import type { Locale } from './config'

// Translation dictionary. One entry per UI string, with all supported languages.
// Add keys here as more of the app is internationalized. Keep Spanish (es) as the
// source of truth. Dynamic data (medication names, prices, pharmacies) is never
// translated — it comes from the sources.
type Entry = Record<Locale, string>

export const TRANSLATIONS: Record<string, Entry> = {
  // ── Barra superior / navegación ──
  'nav.cercanas': {
    es: '¡Busca tu droguería más cercana!',
    en: 'Find your nearest pharmacy!',
    fr: 'Trouvez la pharmacie la plus proche !',
    it: 'Trova la farmacia più vicina!',
    de: 'Finde deine nächste Apotheke!',
    pt: 'Encontre a farmácia mais próxima!',
  },
  'nav.cercanasShort': {
    es: 'Cercanas', en: 'Nearby', fr: 'À proximité', it: 'Vicine', de: 'In der Nähe', pt: 'Próximas',
  },
  'nav.login': {
    es: 'Ingresar', en: 'Sign in', fr: 'Se connecter', it: 'Accedi', de: 'Anmelden', pt: 'Entrar',
  },
  'nav.register': {
    es: 'Crear cuenta', en: 'Sign up', fr: 'Créer un compte', it: 'Crea account', de: 'Konto erstellen', pt: 'Criar conta',
  },
  'nav.hello': {
    es: 'Hola,', en: 'Hi,', fr: 'Salut,', it: 'Ciao,', de: 'Hallo,', pt: 'Olá,',
  },

  // ── Menú de usuario ──
  'menu.account': {
    es: 'Mi cuenta', en: 'My account', fr: 'Mon compte', it: 'Il mio account', de: 'Mein Konto', pt: 'Minha conta',
  },
  'menu.cart': {
    es: 'Carrito de compra', en: 'Shopping cart', fr: 'Panier', it: 'Carrello', de: 'Warenkorb', pt: 'Carrinho',
  },
  'menu.wishlist': {
    es: 'Lista de deseos', en: 'Wishlist', fr: 'Liste de souhaits', it: 'Lista dei desideri', de: 'Wunschliste', pt: 'Lista de desejos',
  },
  'menu.logout': {
    es: 'Cerrar sesión', en: 'Sign out', fr: 'Se déconnecter', it: 'Esci', de: 'Abmelden', pt: 'Sair',
  },

  // ── Buscador ──
  'search.placeholder': {
    es: 'Ej: acetaminofén, Dolex, ibuprofeno...',
    en: 'e.g. acetaminophen, Dolex, ibuprofen...',
    fr: 'ex : paracétamol, Dolex, ibuprofène...',
    it: 'es: paracetamolo, Dolex, ibuprofene...',
    de: 'z. B. Paracetamol, Dolex, Ibuprofen...',
    pt: 'ex: paracetamol, Dolex, ibuprofeno...',
  },
  'search.placeholderCompact': {
    es: 'Buscar medicamento...', en: 'Search medication...', fr: 'Rechercher un médicament...', it: 'Cerca un farmaco...', de: 'Medikament suchen...', pt: 'Buscar medicamento...',
  },
  'search.aria': {
    es: 'Buscar medicamento', en: 'Search medication', fr: 'Rechercher un médicament', it: 'Cerca un farmaco', de: 'Medikament suchen', pt: 'Buscar medicamento',
  },
  'search.button': {
    es: 'Buscar', en: 'Search', fr: 'Rechercher', it: 'Cerca', de: 'Suchen', pt: 'Buscar',
  },

  // ── Portada (hero) ──
  'home.heroLead': {
    es: 'Compara precios de ', en: 'Compare ', fr: 'Comparez les prix des ', it: 'Confronta i prezzi dei ', de: 'Vergleiche Preise für ', pt: 'Compare preços de ',
  },
  'home.heroKeyword': {
    es: 'medicamentos', en: 'medication', fr: 'médicaments', it: 'farmaci', de: 'Medikamente', pt: 'medicamentos',
  },
  'home.heroTail': {
    es: ' en Colombia', en: ' prices in Colombia', fr: ' en Colombie', it: ' in Colombia', de: ' in Kolumbien', pt: ' na Colômbia',
  },
  'home.heroSubtitle': {
    es: 'Busca por nombre genérico o de marca y encuentra, en segundos, el mejor precio entre las principales farmacias de Colombia.',
    en: 'Search by generic or brand name and find, in seconds, the best price among Colombia’s leading pharmacies.',
    fr: 'Cherchez par nom générique ou de marque et trouvez, en quelques secondes, le meilleur prix parmi les principales pharmacies de Colombie.',
    it: 'Cerca per nome generico o di marca e trova, in pochi secondi, il prezzo migliore tra le principali farmacie della Colombia.',
    de: 'Suche nach Generika- oder Markennamen und finde in Sekunden den besten Preis unter Kolumbiens führenden Apotheken.',
    pt: 'Busque pelo nome genérico ou de marca e encontre, em segundos, o melhor preço entre as principais farmácias da Colômbia.',
  },
  'home.searchNote': {
    es: 'Precios consultados en el momento de tu búsqueda.',
    en: 'Prices checked at the moment of your search.',
    fr: 'Prix vérifiés au moment de votre recherche.',
    it: 'Prezzi verificati al momento della tua ricerca.',
    de: 'Preise werden im Moment deiner Suche abgefragt.',
    pt: 'Preços consultados no momento da sua busca.',
  },

  // ── Pie de página ──
  'footer.tagline': {
    es: 'Comparador gratuito de precios de medicamentos en Colombia.',
    en: 'Free medication price comparison in Colombia.',
    fr: 'Comparateur gratuit de prix de médicaments en Colombie.',
    it: 'Comparatore gratuito di prezzi di farmaci in Colombia.',
    de: 'Kostenloser Medikamenten-Preisvergleich in Kolumbien.',
    pt: 'Comparador gratuito de preços de medicamentos na Colômbia.',
  },
  'footer.about': {
    es: 'Sobre nosotros', en: 'About us', fr: 'À propos', it: 'Chi siamo', de: 'Über uns', pt: 'Sobre nós',
  },
  'footer.contact': {
    es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatti', de: 'Kontakt', pt: 'Contato',
  },
  'footer.terms': {
    es: 'Condiciones', en: 'Terms', fr: 'Conditions', it: 'Termini', de: 'Bedingungen', pt: 'Termos',
  },
  'footer.privacy': {
    es: 'Privacidad', en: 'Privacy', fr: 'Confidentialité', it: 'Privacy', de: 'Datenschutz', pt: 'Privacidade',
  },
  'footer.language': {
    es: 'Idioma', en: 'Language', fr: 'Langue', it: 'Lingua', de: 'Sprache', pt: 'Idioma',
  },
}
