import type { Locale } from './config'

// Translation dictionary. One entry per UI string, with all supported languages.
// Add keys here as more of the app is internationalized. Keep Spanish (es) as the
// source of truth. Dynamic data (medication names, prices, pharmacies) is never
// translated — it comes from the sources.
export type TranslationEntry = Record<Locale, string>

export const TRANSLATIONS: Record<string, TranslationEntry> = {
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
    es: 'Crear cuenta', en: 'Sign up', fr: 'Créer un compte', it: 'Crea un account', de: 'Konto erstellen', pt: 'Criar conta',
  },
  'nav.hello': {
    es: 'Hola,', en: 'Hi,', fr: 'Salut,', it: 'Ciao,', de: 'Hallo,', pt: 'Olá,',
  },
  'options.title': {
    es: 'Opciones', en: 'Options', fr: 'Options', it: 'Opzioni', de: 'Optionen', pt: 'Opções',
  },
  'options.appearance': {
    es: 'Apariencia', en: 'Appearance', fr: 'Apparence', it: 'Aspetto', de: 'Erscheinungsbild', pt: 'Aparência',
  },
  'options.language': {
    es: 'Idioma', en: 'Language', fr: 'Langue', it: 'Lingua', de: 'Sprache', pt: 'Idioma',
  },
  'options.hint': {
    es: 'Aquí puedes cambiar el idioma y el tema (claro/noche).',
    en: 'You can change the language and the theme (light/dark) here.',
    fr: 'Vous pouvez changer la langue et le thème (clair/sombre) ici.',
    it: 'Qui puoi cambiare la lingua e il tema (chiaro/scuro).',
    de: 'Hier kannst du die Sprache und das Design (hell/dunkel) ändern.',
    pt: 'Aqui você pode mudar o idioma e o tema (claro/escuro).',
  },
  'options.hintClose': {
    es: 'Cerrar aviso', en: 'Close hint', fr: 'Fermer l’astuce', it: 'Chiudi suggerimento', de: 'Hinweis schließen', pt: 'Fechar aviso',
  },

  // ── Barra de navegación inferior (móvil) ──
  'bottomNav.search': {
    es: 'Buscar', en: 'Search', fr: 'Rechercher', it: 'Cerca', de: 'Suchen', pt: 'Buscar',
  },
  'bottomNav.list': {
    es: 'Lista', en: 'List', fr: 'Liste', it: 'Lista', de: 'Liste', pt: 'Lista',
  },
  'bottomNav.cart': {
    es: 'Carrito', en: 'Cart', fr: 'Panier', it: 'Carrello', de: 'Warenkorb', pt: 'Carrinho',
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
  'menu.appearance': {
    es: 'Apariencia', en: 'Appearance', fr: 'Apparence', it: 'Aspetto', de: 'Erscheinungsbild', pt: 'Aparência',
  },

  // ── Buscador ──
  'search.placeholder': {
    es: 'Ej.: acetaminofén, Dolex, ibuprofeno...',
    en: 'e.g., acetaminophen, Dolex, ibuprofen...',
    fr: 'Ex. : paracétamol, Dolex, ibuprofène...',
    it: 'Es.: paracetamolo, Dolex, ibuprofene...',
    de: 'z. B. Paracetamol, Dolex, Ibuprofen...',
    pt: 'Ex.: paracetamol, Dolex, ibuprofeno...',
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
  'footer.cheap': {
    es: 'Medicamentos baratos', en: 'Cheap medications', fr: 'Médicaments pas chers', it: 'Farmaci economici', de: 'Günstige Medikamente', pt: 'Medicamentos baratos',
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

  // ── Portada: franja de confianza ──
  'home.trust1': {
    es: 'Precios en tiempo real', en: 'Real-time prices', fr: 'Prix en temps réel', it: 'Prezzi in tempo reale', de: 'Preise in Echtzeit', pt: 'Preços em tempo real',
  },
  'home.trust2': {
    es: '8 farmacias en una búsqueda', en: '8 pharmacies in one search', fr: '8 pharmacies en une seule recherche', it: '8 farmacie in una ricerca', de: '8 Apotheken mit einer Suche', pt: '8 farmácias em uma busca',
  },
  'home.trust3': {
    es: '100% gratis, sin registro', en: '100% free, no sign-up', fr: '100% gratuit, sans inscription', it: '100% gratis, senza registrazione', de: '100% kostenlos, ohne Anmeldung', pt: '100% grátis, sem cadastro',
  },

  // ── Por qué Farmi (ValueProps) ──
  'value1.title': { es: '100% gratis', en: '100% free', fr: '100% gratuit', it: '100% gratis', de: '100% kostenlos', pt: '100% grátis' },
  'value1.desc': {
    es: 'Sin registro ni costos. Solo busca y compara.', en: 'No sign-up, no cost. Just search and compare.', fr: 'Sans inscription ni frais. Cherchez et comparez.', it: 'Senza registrazione né costi. Cerca e confronta.', de: 'Ohne Anmeldung, ohne Kosten. Einfach suchen und vergleichen.', pt: 'Sem cadastro nem custos. Só buscar e comparar.',
  },
  'value2.title': { es: 'Precios en tiempo real', en: 'Real-time prices', fr: 'Prix en temps réel', it: 'Prezzi in tempo reale', de: 'Preise in Echtzeit', pt: 'Preços em tempo real' },
  'value2.desc': {
    es: 'Consultamos cada farmacia en el momento de tu búsqueda.', en: 'We check each pharmacy the moment you search.', fr: 'Nous interrogeons chaque pharmacie au moment de votre recherche.', it: 'Controlliamo ogni farmacia nel momento della tua ricerca.', de: 'Wir prüfen jede Apotheke im Moment deiner Suche.', pt: 'Consultamos cada farmácia no momento da sua busca.',
  },
  'value3.title': { es: '8 farmacias a la vez', en: '8 pharmacies at once', fr: '8 pharmacies à la fois', it: '8 farmacie insieme', de: '8 Apotheken auf einmal', pt: '8 farmácias de uma vez' },
  'value3.desc': {
    es: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Pasteur y Farmacenter.', en: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Pasteur and Farmacenter.', fr: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Pasteur et Farmacenter.', it: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Pasteur e Farmacenter.', de: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Pasteur und Farmacenter.', pt: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Pasteur e Farmacenter.',
  },
  'value4.title': { es: 'Genérico o de marca', en: 'Generic or brand', fr: 'Générique ou de marque', it: 'Generico o di marca', de: 'Generikum oder Marke', pt: 'Genérico ou de marca' },
  'value4.desc': {
    es: 'Compara equivalentes y elige según tu presupuesto.', en: 'Compare equivalents and choose to fit your budget.', fr: 'Comparez les équivalents et choisissez selon votre budget.', it: 'Confronta gli equivalenti e scegli in base al tuo budget.', de: 'Vergleiche Äquivalente und wähle nach deinem Budget.', pt: 'Compare equivalentes e escolha conforme seu orçamento.',
  },

  // ── Cómo funciona ──
  'howItWorks.title': { es: 'Cómo funciona', en: 'How it works', fr: 'Comment ça marche', it: 'Come funziona', de: 'So funktioniert es', pt: 'Como funciona' },
  'howItWorks.subtitle': {
    es: 'Encuentra el mejor precio en tres pasos.', en: 'Find the best price in three steps.', fr: 'Trouvez le meilleur prix en trois étapes.', it: 'Trova il prezzo migliore in tre passaggi.', de: 'Finde den besten Preis in drei Schritten.', pt: 'Encontre o melhor preço em três passos.',
  },
  'step1.title': { es: 'Entra a Farmi', en: 'Open Farmi', fr: 'Ouvrez Farmi', it: 'Apri Farmi', de: 'Öffne Farmi', pt: 'Acesse a Farmi' },
  'step1.desc': {
    es: 'Abre farmi.com.co desde tu celular o computador. Gratis y sin registro.', en: 'Open farmi.com.co on your phone or computer. Free and no sign-up.', fr: 'Ouvrez farmi.com.co sur votre téléphone ou ordinateur. Gratuit et sans inscription.', it: 'Apri farmi.com.co dal telefono o dal computer. Gratis e senza registrazione.', de: 'Öffne farmi.com.co auf Handy oder Computer. Kostenlos und ohne Anmeldung.', pt: 'Abra farmi.com.co no seu celular ou computador. Grátis e sem cadastro.',
  },
  'step2.title': { es: 'Busca tu medicamento', en: 'Search your medication', fr: 'Cherchez votre médicament', it: 'Cerca il tuo farmaco', de: 'Suche dein Medikament', pt: 'Busque seu medicamento' },
  'step2.desc': {
    es: 'Escribe el nombre o el principio activo que necesitas: ibuprofeno, Advil, acetaminofén...', en: 'Type the name or active ingredient you need: ibuprofen, Advil, acetaminophen...', fr: 'Saisissez le nom ou le principe actif dont vous avez besoin : ibuprofène, Advil, paracétamol...', it: 'Scrivi il nome o il principio attivo che ti serve: ibuprofene, Advil, paracetamolo...', de: 'Gib den Namen oder Wirkstoff ein: Ibuprofen, Advil, Paracetamol...', pt: 'Digite o nome ou o princípio ativo: ibuprofeno, Advil, paracetamol...',
  },
  'step3.title': { es: 'Compara y toma tu decisión', en: 'Compare and decide', fr: 'Comparez et décidez', it: 'Confronta e decidi', de: 'Vergleiche und entscheide', pt: 'Compare e decida' },
  'step3.desc': {
    es: 'Revisa precios, disponibilidad y farmacias cercanas. Tú eliges dónde comprar.', en: 'Check prices, availability and nearby pharmacies. You choose where to buy.', fr: 'Consultez les prix, la disponibilité et les pharmacies proches. Vous choisissez où acheter.', it: 'Controlla prezzi, disponibilità e farmacie vicine. Scegli tu dove comprare.', de: 'Prüfe Preise, Verfügbarkeit und Apotheken in der Nähe. Du entscheidest, wo du kaufst.', pt: 'Veja preços, disponibilidade e farmácias próximas. Você escolhe onde comprar.',
  },

  // ── Farmacias ──
  'heroPharmacies.label': {
    es: 'Precios en tiempo real de', en: 'Real-time prices from', fr: 'Prix en temps réel de', it: 'Prezzi in tempo reale di', de: 'Preise in Echtzeit von', pt: 'Preços em tempo real de',
  },
  'pharmacyStrip.title': { es: 'Comparamos estas farmacias', en: 'We compare these pharmacies', fr: 'Nous comparons ces pharmacies', it: 'Confrontiamo queste farmacie', de: 'Wir vergleichen diese Apotheken', pt: 'Comparamos estas farmácias' },
  'pharmacyStrip.subtitle': {
    es: 'Precios en tiempo real de las cadenas más grandes de Colombia.', en: 'Real-time prices from Colombia’s largest chains.', fr: 'Prix en temps réel des plus grandes chaînes de Colombie.', it: 'Prezzi in tempo reale delle maggiori catene della Colombia.', de: 'Preise in Echtzeit von Kolumbiens größten Ketten.', pt: 'Preços em tempo real das maiores redes da Colômbia.',
  },
  'pharmacyStrip.disclaimer': {
    es: 'Logos y marcas pertenecen a sus respectivos titulares. Farmi es un comparador independiente, no afiliado ni patrocinado por estas farmacias.',
    en: 'Logos and trademarks belong to their respective owners. Farmi is an independent comparison tool, not affiliated with or sponsored by these pharmacies.',
    fr: 'Les logos et marques appartiennent à leurs propriétaires respectifs. Farmi est un comparateur indépendant, ni affilié ni sponsorisé par ces pharmacies.',
    it: 'Loghi e marchi appartengono ai rispettivi proprietari. Farmi è un comparatore indipendente, non affiliato né sponsorizzato da queste farmacie.',
    de: 'Logos und Marken gehören ihren jeweiligen Eigentümern. Farmi ist ein unabhängiger Preisvergleich, weder mit diesen Apotheken verbunden noch von ihnen gesponsert.',
    pt: 'Logos e marcas pertencem aos seus respectivos titulares. Farmi é um comparador independente, não afiliado nem patrocinado por estas farmácias.',
  },

  // ── Medicamentos populares ──
  'popular.title': { es: 'Precios de medicamentos populares', en: 'Prices of popular medications', fr: 'Prix des médicaments populaires', it: 'Prezzi dei farmaci più cercati', de: 'Preise beliebter Medikamente', pt: 'Preços de medicamentos populares' },
  'popular.subtitle': {
    es: 'Consulta información, usos y precios de los medicamentos más buscados en las farmacias de Colombia.', en: 'See information, uses and prices of the most searched medications in Colombia’s pharmacies.', fr: 'Consultez informations, usages et prix des médicaments les plus recherchés dans les pharmacies de Colombie.', it: 'Consulta informazioni, usi e prezzi dei farmaci più cercati nelle farmacie della Colombia.', de: 'Sieh dir Infos, Anwendungen und Preise der meistgesuchten Medikamente in Kolumbiens Apotheken an.', pt: 'Veja informações, usos e preços dos medicamentos mais buscados nas farmácias da Colômbia.',
  },
  'popular.cta': { es: 'Ver precio', en: 'See price', fr: 'Voir le prix', it: 'Vedi prezzo', de: 'Preis ansehen', pt: 'Ver preço' },

  // ── Genérico vs marca ──
  'generic.title': { es: '¿Genérico o de marca?', en: 'Generic or brand?', fr: 'Générique ou de marque ?', it: 'Generico o di marca?', de: 'Generikum oder Marke?', pt: 'Genérico ou de marca?' },
  'generic.subtitle': { es: 'Mismo efecto, distinto precio. Tú decides.', en: 'Same effect, different price. You decide.', fr: 'Même effet, prix différent. À vous de choisir.', it: 'Stesso effetto, prezzo diverso. Decidi tu.', de: 'Gleiche Wirkung, anderer Preis. Du entscheidest.', pt: 'Mesmo efeito, preço diferente. Você decide.' },
  'badge.generic': { es: 'Genérico', en: 'Generic', fr: 'Générique', it: 'Generico', de: 'Generikum', pt: 'Genérico' },
  'badge.brand': { es: 'Marca', en: 'Brand', fr: 'Marque', it: 'Marca', de: 'Marke', pt: 'Marca' },
  'generic.card1Title': { es: 'El mismo principio activo, más barato', en: 'The same active ingredient, cheaper', fr: 'Le même principe actif, moins cher', it: 'Lo stesso principio attivo, più economico', de: 'Der gleiche Wirkstoff, günstiger', pt: 'O mesmo princípio ativo, mais barato' },
  'generic.card1Desc': {
    es: 'Tiene el mismo principio activo, dosis y forma que el de marca, y está regulado por el INVIMA. Suele costar entre 30% y 80% menos.',
    en: 'It has the same active ingredient, dose and form as the brand, and is regulated by INVIMA. It usually costs 30% to 80% less.',
    fr: 'Il a le même principe actif, la même dose et la même forme que la marque, et est réglementé par l’INVIMA. Il coûte généralement 30% à 80% de moins.',
    it: 'Ha lo stesso principio attivo, dose e forma del prodotto di marca ed è regolato dall’INVIMA. Di solito costa dal 30% all’80% in meno.',
    de: 'Es hat denselben Wirkstoff, dieselbe Dosis und Form wie das Markenprodukt und wird von INVIMA reguliert. Es kostet meist 30% bis 80% weniger.',
    pt: 'Tem o mesmo princípio ativo, dose e forma que o de marca, e é regulado pela INVIMA. Costuma custar de 30% a 80% menos.',
  },
  'generic.card2Title': { es: 'El laboratorio que ya conoces', en: 'The lab you already know', fr: 'Le laboratoire que vous connaissez', it: 'Il laboratorio che già conosci', de: 'Der Hersteller, den du kennst', pt: 'O laboratório que você já conhece' },
  'generic.card2Desc': {
    es: 'Es el producto original de un laboratorio reconocido. Cuesta más, pero algunas personas prefieren la marca de confianza. Farmi te muestra ambos para que compares.',
    en: 'It’s the original product from a well-known lab. It costs more, but some people prefer the brand they trust. Farmi shows you both so you can compare.',
    fr: 'C’est le produit d’origine d’un laboratoire reconnu. Il coûte plus cher, mais certains préfèrent la marque de confiance. Farmi vous montre les deux pour comparer.',
    it: 'È il prodotto originale di un laboratorio noto. Costa di più, ma alcuni preferiscono la marca di fiducia. Farmi ti mostra entrambi così puoi confrontare.',
    de: 'Es ist das Originalprodukt eines bekannten Herstellers. Es kostet mehr, aber manche bevorzugen die vertraute Marke. Farmi zeigt dir beide zum Vergleich.',
    pt: 'É o produto original de um laboratório reconhecido. Custa mais, mas algumas pessoas preferem a marca de confiança. A Farmi mostra os dois para você comparar.',
  },

  // ── App showcase ──
  'showcase.title': { es: 'Así se ve Farmi', en: 'This is what Farmi looks like', fr: 'Voici Farmi', it: 'Ecco com’è Farmi', de: 'So sieht Farmi aus', pt: 'Assim é a Farmi' },
  'showcase.subtitle': {
    es: 'Búsquedas reales: escribe el producto y compara el precio en las farmacias, en segundos.', en: 'Real searches: type the product and compare prices across pharmacies in seconds.', fr: 'Recherches réelles : saisissez le produit et comparez les prix des pharmacies en quelques secondes.', it: 'Ricerche reali: scrivi il prodotto e confronta i prezzi tra le farmacie in pochi secondi.', de: 'Echte Suchen: Produkt eingeben und Preise der Apotheken in Sekunden vergleichen.', pt: 'Buscas reais: digite o produto e compare o preço nas farmácias em segundos.',
  },
  'showcase.suero': { es: 'Suero rehidratante', en: 'Oral rehydration solution', fr: 'Solution de réhydratation orale', it: 'Soluzione reidratante orale', de: 'Orale Rehydratationslösung', pt: 'Soro de reidratação oral' },
  'showcase.condones': { es: 'Condones', en: 'Condoms', fr: 'Préservatifs', it: 'Preservativi', de: 'Kondome', pt: 'Preservativos' },

  // ── Cercanas promo ──
  'cercanasPromo.title': { es: 'Farmi va contigo a donde estés', en: 'Farmi goes with you wherever you are', fr: 'Farmi vous accompagne où que vous soyez', it: 'Farmi è con te ovunque tu sia', de: 'Farmi begleitet dich, wo immer du bist', pt: 'A Farmi está com você onde estiver' },
  'cercanasPromo.desc': {
    es: '¿No sabes cuál farmacia te queda más cerca? Abre el mapa, mira cuáles están abiertas a tu alrededor y llega con indicaciones paso a paso.',
    en: 'Not sure which pharmacy is closest? Open the map, see which are open around you and get there with step-by-step directions.',
    fr: 'Vous ne savez pas quelle pharmacie est la plus proche ? Ouvrez la carte, voyez celles ouvertes autour de vous et rendez-vous-y avec un itinéraire.',
    it: 'Non sai quale farmacia è più vicina? Apri la mappa, guarda quali sono aperte intorno a te e arrivaci con indicazioni passo passo.',
    de: 'Du weißt nicht, welche Apotheke am nächsten ist? Öffne die Karte, sieh, welche geöffnet sind, und finde mit Schritt-für-Schritt-Route hin.',
    pt: 'Não sabe qual farmácia está mais perto? Abra o mapa, veja quais estão abertas ao seu redor e chegue com indicações passo a passo.',
  },
  'cercanasPromo.cta': { es: 'Ver farmacias cercanas', en: 'See nearby pharmacies', fr: 'Voir les pharmacies proches', it: 'Vedi farmacie vicine', de: 'Apotheken in der Nähe ansehen', pt: 'Ver farmácias próximas' },

  // ── Hecho en Colombia ──
  'madeIn.title': { es: 'Hecho en Colombia, para los colombianos', en: 'Made in Colombia, for Colombians', fr: 'Fait en Colombie, pour les Colombiens', it: 'Fatto in Colombia, per i colombiani', de: 'Gemacht in Kolumbien, für Kolumbianer', pt: 'Feito na Colômbia, para os colombianos' },
  'madeIn.desc': {
    es: 'Farmi es una plataforma colombiana e independiente. Comparamos los precios reales de las farmacias del país para que pagues menos por tus medicamentos.',
    en: 'Farmi is a Colombian, independent platform. We compare real pharmacy prices across the country so you pay less for your medications.',
    fr: 'Farmi est une plateforme colombienne et indépendante. Nous comparons les prix réels des pharmacies du pays pour que vous payiez moins vos médicaments.',
    it: 'Farmi è una piattaforma colombiana e indipendente. Confrontiamo i prezzi reali delle farmacie del paese così paghi meno i tuoi farmaci.',
    de: 'Farmi ist eine kolumbianische, unabhängige Plattform. Wir vergleichen echte Apothekenpreise im ganzen Land, damit du weniger für deine Medikamente zahlst.',
    pt: 'A Farmi é uma plataforma colombiana e independente. Comparamos os preços reais das farmácias do país para você pagar menos pelos seus medicamentos.',
  },

  // ── FAQ ──
  'faq.title': { es: 'Preguntas frecuentes', en: 'Frequently asked questions', fr: 'Questions fréquentes', it: 'Domande frequenti', de: 'Häufige Fragen', pt: 'Perguntas frequentes' },
  'faq1.q': { es: '¿Farmi vende medicamentos?', en: 'Does Farmi sell medications?', fr: 'Farmi vend-il des médicaments ?', it: 'Farmi vende farmaci?', de: 'Verkauft Farmi Medikamente?', pt: 'A Farmi vende medicamentos?' },
  'faq1.a': {
    es: 'No. Farmi compara precios y te lleva a la página de la farmacia para que compres directamente con ella. No vendemos ni intervenimos en la compra.',
    en: 'No. Farmi compares prices and takes you to the pharmacy’s page to buy directly from them. We don’t sell or take part in the purchase.',
    fr: 'Non. Farmi compare les prix et vous dirige vers la page de la pharmacie pour acheter directement chez elle. Nous ne vendons pas et n’intervenons pas dans l’achat.',
    it: 'No. Farmi confronta i prezzi e ti porta alla pagina della farmacia per acquistare direttamente da loro. Non vendiamo né interveniamo nell’acquisto.',
    de: 'Nein. Farmi vergleicht Preise und leitet dich zur Seite der Apotheke, um direkt dort zu kaufen. Wir verkaufen nicht und sind am Kauf nicht beteiligt.',
    pt: 'Não. A Farmi compara preços e leva você à página da farmácia para comprar diretamente com ela. Não vendemos nem intervimos na compra.',
  },
  'faq2.q': { es: '¿Los precios son exactos?', en: 'Are the prices exact?', fr: 'Les prix sont-ils exacts ?', it: 'I prezzi sono esatti?', de: 'Sind die Preise aktuell?', pt: 'Os preços são exatos?' },
  'faq2.a': {
    es: 'Son referenciales y se obtienen en tiempo real de cada farmacia. Pueden variar por sede, disponibilidad o promociones. Confirma siempre el precio final en la farmacia.',
    en: 'They are for reference and pulled in real time from each pharmacy. They may vary by location, availability or promotions. Always confirm the final price at the pharmacy.',
    fr: 'Ils sont indicatifs et obtenus en temps réel auprès de chaque pharmacie. Ils peuvent varier selon le point de vente, la disponibilité ou les promotions. Confirmez toujours le prix final en pharmacie.',
    it: 'Sono indicativi e ottenuti in tempo reale da ogni farmacia. Possono variare per sede, disponibilità o promozioni. Conferma sempre il prezzo finale in farmacia.',
    de: 'Sie sind Richtwerte und werden in Echtzeit von jeder Apotheke abgerufen. Sie können je nach Filiale, Verfügbarkeit oder Aktionen variieren. Bestätige den Endpreis immer in der Apotheke.',
    pt: 'São referenciais e obtidos em tempo real de cada farmácia. Podem variar por unidade, disponibilidade ou promoções. Confirme sempre o preço final na farmácia.',
  },
  'faq3.q': { es: '¿Necesito registrarme?', en: 'Do I need to sign up?', fr: 'Dois-je m’inscrire ?', it: 'Devo registrarmi?', de: 'Muss ich mich anmelden?', pt: 'Preciso me cadastrar?' },
  'faq3.a': {
    es: 'No. Puedes buscar y comparar sin crear cuenta. El registro solo sirve para guardar tu lista de favoritos.',
    en: 'No. You can search and compare without an account. Signing up is only to save your favorites list.',
    fr: 'Non. Vous pouvez chercher et comparer sans compte. L’inscription sert uniquement à enregistrer vos favoris.',
    it: 'No. Puoi cercare e confrontare senza account. La registrazione serve solo a salvare la tua lista dei preferiti.',
    de: 'Nein. Du kannst ohne Konto suchen und vergleichen. Die Anmeldung dient nur zum Speichern deiner Favoritenliste.',
    pt: 'Não. Você pode buscar e comparar sem criar conta. O cadastro serve apenas para salvar sua lista de favoritos.',
  },
  'faq4.q': { es: '¿Qué farmacias comparan?', en: 'Which pharmacies do you compare?', fr: 'Quelles pharmacies comparez-vous ?', it: 'Quali farmacie confrontate?', de: 'Welche Apotheken vergleicht ihr?', pt: 'Quais farmácias vocês comparam?' },
  'faq4.a': {
    es: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Farmacia Pasteur y Farmacenter. Consultamos sus precios cuando haces una búsqueda.',
    en: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Farmacia Pasteur and Farmacenter. We check their prices when you search.',
    fr: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Farmacia Pasteur et Farmacenter. Nous consultons leurs prix lors de votre recherche.',
    it: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Farmacia Pasteur e Farmacenter. Controlliamo i loro prezzi quando fai una ricerca.',
    de: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Farmacia Pasteur und Farmacenter. Wir prüfen ihre Preise, wenn du suchst.',
    pt: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica, Farmacia Pasteur e Farmacenter. Consultamos os preços deles quando você busca.',
  },
  'faq5.q': { es: '¿Tiene algún costo?', en: 'Is there any cost?', fr: 'Y a-t-il un coût ?', it: 'Ha qualche costo?', de: 'Gibt es Kosten?', pt: 'Tem algum custo?' },
  'faq5.a': {
    es: 'No. Farmi es 100% gratis para los usuarios.', en: 'No. Farmi is 100% free for users.', fr: 'Non. Farmi est 100% gratuit pour les utilisateurs.', it: 'No. Farmi è 100% gratis per gli utenti.', de: 'Nein. Farmi ist für Nutzer 100% kostenlos.', pt: 'Não. A Farmi é 100% grátis para os usuários.',
  },

  // ── CTA final ──
  'cta.title': { es: 'Deja de pagar de más por tus medicamentos', en: 'Stop overpaying for your medications', fr: 'Arrêtez de payer trop cher vos médicaments', it: 'Smetti di pagare troppo i tuoi farmaci', de: 'Zahle nicht mehr zu viel für deine Medikamente', pt: 'Pare de pagar a mais pelos seus medicamentos' },
  'cta.desc': {
    es: 'Compara en segundos y encuentra el precio más bajo entre las principales farmacias de Colombia.', en: 'Compare in seconds and find the lowest price among Colombia’s leading pharmacies.', fr: 'Comparez en quelques secondes et trouvez le prix le plus bas parmi les principales pharmacies de Colombie.', it: 'Confronta in pochi secondi e trova il prezzo più basso tra le principali farmacie della Colombia.', de: 'Vergleiche in Sekunden und finde den niedrigsten Preis unter Kolumbiens führenden Apotheken.', pt: 'Compare em segundos e encontre o menor preço entre as principais farmácias da Colômbia.',
  },
  'cta.button': { es: 'Buscar un medicamento', en: 'Search a medication', fr: 'Rechercher un médicament', it: 'Cerca un farmaco', de: 'Medikament suchen', pt: 'Buscar um medicamento' },

  // ── Resultados de búsqueda (/buscar) ──
  'buscar.loading': { es: 'Buscando precios...', en: 'Searching prices...', fr: 'Recherche des prix...', it: 'Ricerca dei prezzi...', de: 'Preise werden gesucht...', pt: 'Buscando preços...' },
  'buscar.typeToSearch': { es: 'Escribe un medicamento para buscar', en: 'Type a medication to search', fr: 'Saisissez un médicament à rechercher', it: 'Scrivi un farmaco da cercare', de: 'Gib ein Medikament ein, um zu suchen', pt: 'Digite um medicamento para buscar' },
  'buscar.errorTitle': { es: 'No pudimos cargar los precios', en: 'We couldn’t load the prices', fr: 'Impossible de charger les prix', it: 'Non siamo riusciti a caricare i prezzi', de: 'Preise konnten nicht geladen werden', pt: 'Não conseguimos carregar os preços' },
  'buscar.errorDesc': { es: 'Hubo un problema al consultar las farmacias. Revisa tu conexion e intenta de nuevo.', en: 'There was a problem checking the pharmacies. Check your connection and try again.', fr: 'Un problème est survenu lors de la consultation des pharmacies. Vérifiez votre connexion et réessayez.', it: 'C’è stato un problema nel consultare le farmacie. Controlla la connessione e riprova.', de: 'Beim Abfragen der Apotheken gab es ein Problem. Prüfe deine Verbindung und versuche es erneut.', pt: 'Houve um problema ao consultar as farmácias. Verifique sua conexão e tente novamente.' },
  'buscar.retry': { es: 'Reintentar', en: 'Try again', fr: 'Réessayer', it: 'Riprova', de: 'Erneut versuchen', pt: 'Tentar novamente' },
  'buscar.noResultsFor': { es: 'Sin resultados para', en: 'No results for', fr: 'Aucun résultat pour', it: 'Nessun risultato per', de: 'Keine Ergebnisse für', pt: 'Sem resultados para' },
  'buscar.didYouMean': { es: '¿Quisiste decir', en: 'Did you mean', fr: 'Vouliez-vous dire', it: 'Intendevi', de: 'Meintest du', pt: 'Você quis dizer' },
  'buscar.tryGeneric': { es: 'Intenta con el nombre genérico o el principio activo del medicamento', en: 'Try the generic name or the active ingredient of the medication', fr: 'Essayez le nom générique ou le principe actif du médicament', it: 'Prova con il nome generico o il principio attivo del farmaco', de: 'Versuche es mit dem Generikanamen oder dem Wirkstoff des Medikaments', pt: 'Tente com o nome genérico ou o princípio ativo do medicamento' },
  'buscar.filterAll': { es: 'Todos', en: 'All', fr: 'Tous', it: 'Tutti', de: 'Alle', pt: 'Todos' },
  'buscar.genericSavings': {
    es: 'El genérico puede ser hasta {pct}% más barato con el mismo principio activo.',
    en: 'The generic can be up to {pct}% cheaper with the same active ingredient.',
    fr: 'Le générique peut être jusqu’à {pct}% moins cher avec le même principe actif.',
    it: 'Il generico può costare fino al {pct}% in meno con lo stesso principio attivo.',
    de: 'Das Generikum kann mit demselben Wirkstoff bis zu {pct}% günstiger sein.',
    pt: 'O genérico pode ser até {pct}% mais barato com o mesmo princípio ativo.',
  },

  // ── Ubicación en resultados ──
  'loc.whereTitle': { es: '¿Dónde estás?', en: 'Where are you?', fr: 'Où êtes-vous ?', it: 'Dove sei?', de: 'Wo bist du?', pt: 'Onde você está?' },
  'loc.whereDesc': {
    es: 'Detecta tu ubicación o escribe tu dirección para ver qué farmacias tienen sede cerca y filtrar por cercanía.',
    en: 'Detect your location or type your address to see which pharmacies have a branch nearby and filter by distance.',
    fr: 'Détectez votre position ou saisissez votre adresse pour voir quelles pharmacies ont une agence proche et filtrer par proximité.',
    it: 'Rileva la tua posizione o scrivi il tuo indirizzo per vedere quali farmacie hanno una sede vicina e filtrare per vicinanza.',
    de: 'Erkenne deinen Standort oder gib deine Adresse ein, um zu sehen, welche Apotheken eine Filiale in der Nähe haben, und nach Nähe zu filtern.',
    pt: 'Detecte sua localização ou digite seu endereço para ver quais farmácias têm unidade perto e filtrar por proximidade.',
  },
  'loc.useMyLocation': { es: 'Usar mi ubicación', en: 'Use my location', fr: 'Utiliser ma position', it: 'Usa la mia posizione', de: 'Meinen Standort verwenden', pt: 'Usar minha localização' },
  'loc.searching': { es: 'Buscando...', en: 'Searching...', fr: 'Recherche...', it: 'Ricerca...', de: 'Suche läuft...', pt: 'Buscando...' },
  'loc.addressPlaceholder': { es: 'o escribe tu dirección o barrio', en: 'or type your address or neighborhood', fr: 'ou saisissez votre adresse ou quartier', it: 'o scrivi il tuo indirizzo o quartiere', de: 'oder gib deine Adresse oder dein Viertel ein', pt: 'ou digite seu endereço ou bairro' },
  'loc.nearYou': { es: 'Farmacias cerca de ti', en: 'Pharmacies near you', fr: 'Pharmacies près de vous', it: 'Farmacie vicino a te', de: 'Apotheken in deiner Nähe', pt: 'Farmácias perto de você' },
  'loc.change': { es: 'Cambiar', en: 'Change', fr: 'Modifier', it: 'Cambia', de: 'Ändern', pt: 'Alterar' },
  'loc.onlyNearby': { es: 'Mostrar solo farmacias cerca de mí', en: 'Show only pharmacies near me', fr: 'Afficher uniquement les pharmacies proches', it: 'Mostra solo le farmacie vicino a me', de: 'Nur Apotheken in meiner Nähe zeigen', pt: 'Mostrar só farmácias perto de mim' },
  'loc.nearbyCount': { es: '{x} de {y} con sede a menos de 2 km', en: '{x} of {y} with a branch within 2 km', fr: '{x} sur {y} avec une agence à moins de 2 km', it: '{x} su {y} con una sede entro 2 km', de: '{x} von {y} mit Filiale innerhalb von 2 km', pt: '{x} de {y} com unidade a menos de 2 km' },
  'loc.noneNearby': { es: 'No hay sedes de estas cadenas a menos de 2 km de ti', en: 'No branches of these chains within 2 km of you', fr: 'Aucune agence de ces chaînes à moins de 2 km de vous', it: 'Nessuna sede di queste catene entro 2 km da te', de: 'Keine Filialen dieser Ketten innerhalb von 2 km', pt: 'Não há unidades dessas redes a menos de 2 km de você' },
  'loc.stockNote': {
    es: 'La cercanía es la sede más próxima de cada cadena. Aún no reflejamos el inventario real de cada droguería física: estamos en ese proceso. Confirma la disponibilidad en la sede antes de ir.',
    en: 'Distance refers to each chain’s closest branch. We don’t yet reflect the real inventory of each physical store: we’re working on it. Confirm availability at the branch before going.',
    fr: 'La proximité correspond à l’agence la plus proche de chaque chaîne. Nous ne reflétons pas encore le stock réel de chaque pharmacie physique : nous y travaillons. Confirmez la disponibilité avant de vous déplacer.',
    it: 'La vicinanza è la sede più prossima di ogni catena. Non riflettiamo ancora l’inventario reale di ogni farmacia fisica: ci stiamo lavorando. Conferma la disponibilità prima di andare.',
    de: 'Die Nähe bezieht sich auf die nächste Filiale jeder Kette. Wir zeigen noch nicht den realen Bestand jeder Filiale: daran arbeiten wir. Bestätige die Verfügbarkeit, bevor du hingehst.',
    pt: 'A proximidade é a unidade mais próxima de cada rede. Ainda não refletimos o estoque real de cada drogaria física: estamos nesse processo. Confirme a disponibilidade na unidade antes de ir.',
  },

  // ── Filtros ──
  'filters.title': { es: 'Filtros', en: 'Filters', fr: 'Filtres', it: 'Filtri', de: 'Filter', pt: 'Filtros' },
  'filters.allOptions': { es: 'Todas las opciones', en: 'All options', fr: 'Toutes les options', it: 'Tutte le opzioni', de: 'Alle Optionen', pt: 'Todas as opções' },
  'filters.presentation': { es: 'Presentación', en: 'Form', fr: 'Présentation', it: 'Formato', de: 'Darreichungsform', pt: 'Apresentação' },
  'filters.concentration': { es: 'Concentracion', en: 'Strength', fr: 'Dosage', it: 'Concentrazione', de: 'Wirkstärke', pt: 'Concentração' },
  'filters.allF': { es: 'Todas', en: 'All', fr: 'Toutes', it: 'Tutte', de: 'Alle', pt: 'Todas' },
  'filters.quantity': { es: 'Cantidad', en: 'Quantity', fr: 'Quantité', it: 'Quantità', de: 'Menge', pt: 'Quantidade' },
  'filters.volume': { es: 'Volumen', en: 'Volume', fr: 'Volume', it: 'Volume', de: 'Volumen', pt: 'Volume' },
  'filters.mostCommon': { es: 'Más común', en: 'Most common', fr: 'Le plus courant', it: 'Più comune', de: 'Am häufigsten', pt: 'Mais comum' },
  'filters.clear': { es: 'Limpiar', en: 'Clear', fr: 'Effacer', it: 'Pulisci', de: 'Zurücksetzen', pt: 'Limpar' },
  'filters.less': { es: 'Menos cantidad', en: 'Less quantity', fr: 'Moins', it: 'Meno quantità', de: 'Weniger', pt: 'Menos quantidade' },
  'filters.more': { es: 'Más cantidad', en: 'More quantity', fr: 'Plus', it: 'Più quantità', de: 'Mehr', pt: 'Mais quantidade' },
  'filters.perPack': { es: 'por empaque', en: 'per pack', fr: 'par boîte', it: 'per confezione', de: 'pro Packung', pt: 'por embalagem' },

  // ── Encabezado de resultados ──
  'results.singular': { es: 'resultado', en: 'result', fr: 'résultat', it: 'risultato', de: 'Ergebnis', pt: 'resultado' },
  'results.plural': { es: 'resultados', en: 'results', fr: 'résultats', it: 'risultati', de: 'Ergebnisse', pt: 'resultados' },
  'results.comparison': { es: 'comparación', en: 'comparison', fr: 'comparaison', it: 'confronto', de: 'Vergleich', pt: 'comparação' },
  'results.comparisons': { es: 'comparaciones', en: 'comparisons', fr: 'comparaisons', it: 'confronti', de: 'Vergleiche', pt: 'comparações' },
  'results.updated': { es: 'Actualizado', en: 'Updated', fr: 'Mis à jour', it: 'Aggiornato', de: 'Aktualisiert', pt: 'Atualizado' },
  'results.liveTitle': { es: 'Precios consultados en tiempo real a las', en: 'Prices checked in real time at', fr: 'Prix consultés en temps réel à', it: 'Prezzi consultati in tempo reale alle', de: 'Preise in Echtzeit abgefragt um', pt: 'Preços consultados em tempo real às' },
  'results.bestPriceLabel': { es: 'Mejor precio:', en: 'Best price:', fr: 'Meilleur prix :', it: 'Miglior prezzo:', de: 'Bester Preis:', pt: 'Melhor preço:' },
  'results.total': { es: 'Total', en: 'Total', fr: 'Total', it: 'Totale', de: 'Gesamt', pt: 'Total' },
  'results.perUnit': { es: 'Por unidad', en: 'Per unit', fr: 'Par unité', it: 'Per unità', de: 'Pro Einheit', pt: 'Por unidade' },
  'results.totalTip': { es: 'El más barato por el precio total del empaque', en: 'Cheapest by total pack price', fr: 'Le moins cher au prix total de la boîte', it: 'Il più economico per prezzo totale della confezione', de: 'Am günstigsten nach Gesamtpreis der Packung', pt: 'O mais barato pelo preço total da embalagem' },
  'results.unitTip': { es: 'El más barato por unidad (tableta, ml, etc.)', en: 'Cheapest per unit (tablet, ml, etc.)', fr: 'Le moins cher par unité (comprimé, ml, etc.)', it: 'Il più economico per unità (compressa, ml, ecc.)', de: 'Am günstigsten pro Einheit (Tablette, ml usw.)', pt: 'O mais barato por unidade (comprimido, ml, etc.)' },
  'sort.label': { es: 'Ordenar', en: 'Sort', fr: 'Trier', it: 'Ordina', de: 'Sortieren', pt: 'Ordenar' },
  'sort.price-asc': { es: 'Menor precio', en: 'Lowest price', fr: 'Prix croissant', it: 'Prezzo più basso', de: 'Niedrigster Preis', pt: 'Menor preço' },
  'sort.price-desc': { es: 'Mayor precio', en: 'Highest price', fr: 'Prix décroissant', it: 'Prezzo più alto', de: 'Höchster Preis', pt: 'Maior preço' },
  'sort.unit-asc': { es: 'Precio/unidad', en: 'Price/unit', fr: 'Prix/unité', it: 'Prezzo/unità', de: 'Preis/Einheit', pt: 'Preço/unidade' },
  'sort.pharmacy-asc': { es: 'Farmacia A-Z', en: 'Pharmacy A-Z', fr: 'Pharmacie A-Z', it: 'Farmacia A-Z', de: 'Apotheke A-Z', pt: 'Farmácia A-Z' },
  'sort.nearest': { es: 'Mas cercano', en: 'Nearest', fr: 'Le plus proche', it: 'Più vicino', de: 'Am nächsten', pt: 'Mais próximo' },

  // ── Ahorro y chips ──
  'savings.youSaveUpTo': { es: 'Ahorras hasta', en: 'You save up to', fr: 'Vous économisez jusqu’à', it: 'Risparmi fino a', de: 'Du sparst bis zu', pt: 'Você economiza até' },
  'savings.buyingAt': { es: 'comprando en', en: 'buying at', fr: 'en achetant chez', it: 'comprando da', de: 'beim Kauf bei', pt: 'comprando na' },
  'savings.insteadOf': { es: 'en vez de', en: 'instead of', fr: 'au lieu de', it: 'invece di', de: 'statt bei', pt: 'em vez de' },
  'savings.sameProduct': { es: 'Mismo producto:', en: 'Same product:', fr: 'Même produit :', it: 'Stesso prodotto:', de: 'Gleiches Produkt:', pt: 'Mesmo produto:' },
  'results.min': { es: 'Min', en: 'Min', fr: 'Min', it: 'Min', de: 'Min', pt: 'Mín' },
  'results.minUnit': { es: 'Min/und', en: 'Min/unit', fr: 'Min/unité', it: 'Min/unità', de: 'Min/Einheit', pt: 'Mín/unid' },
  'results.max': { es: 'Max', en: 'Max', fr: 'Max', it: 'Max', de: 'Max', pt: 'Máx' },
  'results.maxUnit': { es: 'Max/und', en: 'Max/unit', fr: 'Max/unité', it: 'Max/unità', de: 'Max/Einheit', pt: 'Máx/unid' },
  'results.pharmaciesAvailable': { es: '{n} farmacias disponibles', en: '{n} pharmacies available', fr: '{n} pharmacies disponibles', it: '{n} farmacie disponibili', de: '{n} Apotheken verfügbar', pt: '{n} farmácias disponíveis' },
  'groups.sameProduct': { es: 'Mismo producto, distintas farmacias', en: 'Same product, different pharmacies', fr: 'Même produit, pharmacies différentes', it: 'Stesso prodotto, farmacie diverse', de: 'Gleiches Produkt, verschiedene Apotheken', pt: 'Mesmo produto, farmácias diferentes' },
  'groups.onlyOne': { es: 'Solo en una farmacia', en: 'Only in one pharmacy', fr: 'Dans une seule pharmacie', it: 'Solo in una farmacia', de: 'Nur in einer Apotheke', pt: 'Só em uma farmácia' },
  'results.noFilterResults': { es: 'Sin resultados para los filtros seleccionados', en: 'No results for the selected filters', fr: 'Aucun résultat pour les filtres sélectionnés', it: 'Nessun risultato per i filtri selezionati', de: 'Keine Ergebnisse für die gewählten Filter', pt: 'Sem resultados para os filtros selecionados' },
  'results.clearFilters': { es: 'Limpiar filtros', en: 'Clear filters', fr: 'Effacer les filtres', it: 'Pulisci filtri', de: 'Filter zurücksetzen', pt: 'Limpar filtros' },

  // ── Compartir ──
  'share.prompt': { es: '¿Le sirve a alguien más? Comparte esta comparación.', en: 'Useful for someone else? Share this comparison.', fr: 'Utile pour quelqu’un d’autre ? Partagez cette comparaison.', it: 'Può servire a qualcun altro? Condividi questo confronto.', de: 'Nützlich für jemand anderen? Teile diesen Vergleich.', pt: 'Serve para outra pessoa? Compartilhe esta comparação.' },
  'share.button': { es: 'Compartir esta comparación', en: 'Share this comparison', fr: 'Partager cette comparaison', it: 'Condividi questo confronto', de: 'Diesen Vergleich teilen', pt: 'Compartilhar esta comparação' },
  'share.copied': { es: 'Enlace copiado', en: 'Link copied', fr: 'Lien copié', it: 'Link copiato', de: 'Link kopiert', pt: 'Link copiado' },
  'share.copyPrompt': { es: 'Copia este enlace para compartir:', en: 'Copy this link to share:', fr: 'Copiez ce lien pour partager :', it: 'Copia questo link per condividere:', de: 'Kopiere diesen Link zum Teilen:', pt: 'Copie este link para compartilhar:' },
  'share.titlePrefix': { es: 'Precios de', en: 'Prices of', fr: 'Prix de', it: 'Prezzi di', de: 'Preise für', pt: 'Preços de' },
  'share.titleSuffix': { es: 'en farmacias de Colombia', en: 'at pharmacies in Colombia', fr: 'dans les pharmacies de Colombie', it: 'nelle farmacie della Colombia', de: 'in Apotheken in Kolumbien', pt: 'em farmácias da Colômbia' },

  // ── Tarjetas de resultado ──
  'card.bestPrice': { es: 'Mejor precio', en: 'Best price', fr: 'Meilleur prix', it: 'Miglior prezzo', de: 'Bester Preis', pt: 'Melhor preço' },
  'card.bestPerUnit': { es: 'Mejor x unidad', en: 'Best per unit', fr: 'Meilleur par unité', it: 'Migliore per unità', de: 'Bester pro Einheit', pt: 'Melhor por unidade' },
  'card.available': { es: 'Disponible', en: 'Available', fr: 'Disponible', it: 'Disponibile', de: 'Verfügbar', pt: 'Disponível' },
  'card.limited': { es: 'Stock limitado', en: 'Limited stock', fr: 'Stock limité', it: 'Scorte limitate', de: 'Begrenzter Vorrat', pt: 'Estoque limitado' },
  'card.unavailable': { es: 'Agotado', en: 'Out of stock', fr: 'Épuisé', it: 'Esaurito', de: 'Ausverkauft', pt: 'Esgotado' },
  'card.price': { es: 'Precio', en: 'Price', fr: 'Prix', it: 'Prezzo', de: 'Preis', pt: 'Preço' },
  'card.from': { es: 'Desde', en: 'From', fr: 'À partir de', it: 'Da', de: 'Ab', pt: 'A partir de' },
  'card.upTo': { es: 'hasta', en: 'up to', fr: 'jusqu’à', it: 'fino a', de: 'bis', pt: 'até' },
  'card.go': { es: 'Ir', en: 'Go', fr: 'Voir', it: 'Vai', de: 'Los', pt: 'Ir' },
  'card.pharmacies': { es: 'farmacias', en: 'pharmacies', fr: 'pharmacies', it: 'farmacie', de: 'Apotheken', pt: 'farmácias' },
  'card.youSave': { es: 'Ahorras', en: 'You save', fr: 'Vous économisez', it: 'Risparmi', de: 'Du sparst', pt: 'Você economiza' },
  'card.directions': { es: 'Cómo llegar', en: 'Directions', fr: 'Itinéraire', it: 'Indicazioni', de: 'Route', pt: 'Como chegar' },
  'card.history': { es: 'Historial', en: 'History', fr: 'Historique', it: 'Cronologia', de: 'Verlauf', pt: 'Histórico' },
  'card.info': { es: 'Info', en: 'Info', fr: 'Infos', it: 'Info', de: 'Info', pt: 'Info' },
  'card.buyAt': { es: 'Comprar en', en: 'Buy at', fr: 'Acheter chez', it: 'Compra da', de: 'Kaufen bei', pt: 'Comprar na' },
  'card.nearestBranch': { es: 'Sede más cercana', en: 'Nearest branch', fr: 'Agence la plus proche', it: 'Sede più vicina', de: 'Nächste Filiale', pt: 'Unidade mais próxima' },

  // ── Alerta de precio ──
  'alert.title': { es: 'Avísame si baja de precio', en: 'Alert me if the price drops', fr: 'Prévenez-moi si le prix baisse', it: 'Avvisami se il prezzo scende', de: 'Benachrichtige mich, wenn der Preis fällt', pt: 'Me avise se o preço baixar' },
  'alert.currentPrice': { es: 'Hoy lo más barato está en {price}. Te avisamos si baja.', en: 'Today the cheapest is {price}. We’ll let you know if it drops.', fr: 'Aujourd’hui le moins cher est à {price}. Nous vous préviendrons s’il baisse.', it: 'Oggi il più economico è a {price}. Ti avvisiamo se scende.', de: 'Heute liegt der günstigste Preis bei {price}. Wir sagen dir Bescheid, wenn er fällt.', pt: 'Hoje o mais barato está em {price}. Avisamos se baixar.' },
  'alert.noPrice': { es: 'Te avisamos cuando encontremos un precio más bajo.', en: 'We’ll let you know when we find a lower price.', fr: 'Nous vous préviendrons quand nous trouverons un prix plus bas.', it: 'Ti avvisiamo quando troviamo un prezzo più basso.', de: 'Wir benachrichtigen dich, wenn wir einen niedrigeren Preis finden.', pt: 'Avisamos quando encontrarmos um preço mais baixo.' },
  'alert.activate': { es: 'Activar', en: 'Turn on', fr: 'Activer', it: 'Attiva', de: 'Aktivieren', pt: 'Ativar' },
  'alert.email': { es: 'Correo', en: 'Email', fr: 'E-mail', it: 'Email', de: 'E-Mail', pt: 'E-mail' },
  'alert.emailPh': { es: 'tu@correo.com', en: 'you@email.com', fr: 'vous@email.com', it: 'tu@email.com', de: 'du@email.com', pt: 'voce@email.com' },
  'alert.phonePh': { es: 'Ej: 300 123 4567', en: 'e.g. 300 123 4567', fr: 'Ex : 300 123 4567', it: 'Es: 300 123 4567', de: 'z. B. 300 123 4567', pt: 'Ex: 300 123 4567' },
  'alert.emailAria': { es: 'Tu correo', en: 'Your email', fr: 'Votre e-mail', it: 'La tua email', de: 'Deine E-Mail', pt: 'Seu e-mail' },
  'alert.phoneAria': { es: 'Tu número de WhatsApp', en: 'Your WhatsApp number', fr: 'Votre numéro WhatsApp', it: 'Il tuo numero WhatsApp', de: 'Deine WhatsApp-Nummer', pt: 'Seu número de WhatsApp' },
  'alert.saving': { es: 'Guardando...', en: 'Saving...', fr: 'Enregistrement...', it: 'Salvataggio...', de: 'Wird gespeichert...', pt: 'Salvando...' },
  'alert.notify': { es: 'Avisarme', en: 'Notify me', fr: 'Me prévenir', it: 'Avvisami', de: 'Benachrichtigen', pt: 'Me avisar' },
  'alert.noSpam': { es: 'Sin spam. Solo te escribimos cuando el precio baje.', en: 'No spam. We only write when the price drops.', fr: 'Pas de spam. Nous n’écrivons que lorsque le prix baisse.', it: 'Niente spam. Ti scriviamo solo quando il prezzo scende.', de: 'Kein Spam. Wir schreiben nur, wenn der Preis fällt.', pt: 'Sem spam. Só escrevemos quando o preço baixar.' },
  'alert.error': { es: 'No pudimos guardar tu alerta. Revisa el dato e intenta de nuevo.', en: 'We couldn’t save your alert. Check the info and try again.', fr: 'Impossible d’enregistrer votre alerte. Vérifiez la donnée et réessayez.', it: 'Non siamo riusciti a salvare l’avviso. Controlla il dato e riprova.', de: 'Wir konnten deine Benachrichtigung nicht speichern. Prüfe die Angabe und versuche es erneut.', pt: 'Não conseguimos salvar seu alerta. Verifique o dado e tente novamente.' },
  'alert.doneTitle': { es: 'Listo, te avisaremos', en: 'Done, we’ll let you know', fr: 'C’est fait, nous vous préviendrons', it: 'Fatto, ti avviseremo', de: 'Fertig, wir benachrichtigen dich', pt: 'Pronto, vamos avisar você' },
  'alert.doneDesc': { es: 'Te escribiremos por {channel} solo cuando el precio de {label} baje. Sin spam.', en: 'We’ll write via {channel} only when the price of {label} drops. No spam.', fr: 'Nous vous écrirons par {channel} uniquement quand le prix de {label} baissera. Pas de spam.', it: 'Ti scriveremo via {channel} solo quando il prezzo di {label} scenderà. Niente spam.', de: 'Wir schreiben dir per {channel} nur, wenn der Preis von {label} fällt. Kein Spam.', pt: 'Escreveremos por {channel} só quando o preço de {label} baixar. Sem spam.' },
  'alert.channelEmail': { es: 'correo', en: 'email', fr: 'e-mail', it: 'email', de: 'E-Mail', pt: 'e-mail' },

  // ── Farmacias cercanas (/cercanas) ──
  'cerc.title': { es: 'Farmacias cercanas', en: 'Nearby pharmacies', fr: 'Pharmacies à proximité', it: 'Farmacie vicine', de: 'Apotheken in der Nähe', pt: 'Farmácias próximas' },
  'cerc.desc': {
    es: 'Farmacias a 2 km a la redonda, en tiempo real desde OpenStreetMap. Usa tu ubicación o escribe tu dirección. Los precios, cuando existen, vienen de las farmacias en línea que comparamos.',
    en: 'Pharmacies within 2 km, in real time from OpenStreetMap. Use your location or type your address. Prices, when available, come from the online pharmacies we compare.',
    fr: 'Pharmacies dans un rayon de 2 km, en temps réel via OpenStreetMap. Utilisez votre position ou saisissez votre adresse. Les prix, quand ils existent, proviennent des pharmacies en ligne que nous comparons.',
    it: 'Farmacie entro 2 km, in tempo reale da OpenStreetMap. Usa la tua posizione o scrivi il tuo indirizzo. I prezzi, quando esistono, vengono dalle farmacie online che confrontiamo.',
    de: 'Apotheken im Umkreis von 2 km, in Echtzeit von OpenStreetMap. Nutze deinen Standort oder gib deine Adresse ein. Preise stammen, wenn vorhanden, von den Online-Apotheken, die wir vergleichen.',
    pt: 'Farmácias em um raio de 2 km, em tempo real do OpenStreetMap. Use sua localização ou digite seu endereço. Os preços, quando existem, vêm das farmácias online que comparamos.',
  },
  'cerc.locating': { es: 'Ubicando...', en: 'Locating...', fr: 'Localisation...', it: 'Localizzazione...', de: 'Standort wird ermittelt...', pt: 'Localizando...' },
  'cerc.searchingPharmacies': { es: 'Buscando farmacias...', en: 'Searching pharmacies...', fr: 'Recherche de pharmacies...', it: 'Ricerca farmacie...', de: 'Apotheken werden gesucht...', pt: 'Buscando farmácias...' },
  'cerc.orAddress': { es: 'o ingresa tu dirección', en: 'or enter your address', fr: 'ou saisissez votre adresse', it: 'o inserisci il tuo indirizzo', de: 'oder gib deine Adresse ein', pt: 'ou informe seu endereço' },
  'cerc.addressPh': { es: 'Dirección, barrio o ciudad (ej: Calle 53 # 25-10, Bogotá)', en: 'Address, neighborhood or city (e.g. Calle 53 # 25-10, Bogotá)', fr: 'Adresse, quartier ou ville (ex : Calle 53 # 25-10, Bogotá)', it: 'Indirizzo, quartiere o città (es: Calle 53 # 25-10, Bogotá)', de: 'Adresse, Viertel oder Stadt (z. B. Calle 53 # 25-10, Bogotá)', pt: 'Endereço, bairro ou cidade (ex: Calle 53 # 25-10, Bogotá)' },
  'cerc.addressHint': { es: 'Escribe y elige una sugerencia. Luego puedes arrastrar el punto azul del mapa para afinar tu dirección.', en: 'Type and pick a suggestion. Then you can drag the blue dot on the map to fine-tune your address.', fr: 'Saisissez et choisissez une suggestion. Vous pourrez ensuite déplacer le point bleu sur la carte pour affiner votre adresse.', it: 'Scrivi e scegli un suggerimento. Poi puoi trascinare il punto blu sulla mappa per affinare l’indirizzo.', de: 'Tippe und wähle einen Vorschlag. Danach kannst du den blauen Punkt auf der Karte verschieben, um die Adresse zu verfeinern.', pt: 'Digite e escolha uma sugestão. Depois você pode arrastar o ponto azul do mapa para ajustar seu endereço.' },
  'cerc.idleCaption': { es: 'Encuentra la farmacia más cercana y llega con indicaciones paso a paso', en: 'Find the nearest pharmacy and get there with step-by-step directions', fr: 'Trouvez la pharmacie la plus proche et rendez-vous-y avec un itinéraire détaillé', it: 'Trova la farmacia più vicina e arrivaci con indicazioni passo passo', de: 'Finde die nächste Apotheke und komm mit Schritt-für-Schritt-Anweisungen hin', pt: 'Encontre a farmácia mais próxima e chegue com indicações passo a passo' },
  'cerc.medPh': { es: 'Ver precio de un medicamento en estas farmacias', en: 'See a medication’s price at these pharmacies', fr: 'Voir le prix d’un médicament dans ces pharmacies', it: 'Vedi il prezzo di un farmaco in queste farmacie', de: 'Preis eines Medikaments in diesen Apotheken ansehen', pt: 'Ver o preço de um medicamento nestas farmácias' },
  'cerc.medAria': { es: 'Medicamento', en: 'Medication', fr: 'Médicament', it: 'Farmaco', de: 'Medikament', pt: 'Medicamento' },
  'cerc.seePrices': { es: 'Ver precios', en: 'See prices', fr: 'Voir les prix', it: 'Vedi prezzi', de: 'Preise ansehen', pt: 'Ver preços' },
  'cerc.loadingMap': { es: 'Cargando mapa...', en: 'Loading map...', fr: 'Chargement de la carte...', it: 'Caricamento mappa...', de: 'Karte wird geladen...', pt: 'Carregando mapa...' },
  'cerc.consulting': { es: 'Consultando farmacias cercanas...', en: 'Checking nearby pharmacies...', fr: 'Consultation des pharmacies proches...', it: 'Consultazione delle farmacie vicine...', de: 'Apotheken in der Nähe werden abgefragt...', pt: 'Consultando farmácias próximas...' },
  'cerc.noReliable': { es: 'Sin resultados confiables', en: 'No reliable results', fr: 'Pas de résultats fiables', it: 'Nessun risultato affidabile', de: 'Keine verlässlichen Ergebnisse', pt: 'Sem resultados confiáveis' },
  'cerc.noReliableDesc': { es: 'No encontramos farmacias en OpenStreetMap dentro de 2 km. Prueba con otra dirección.', en: 'We found no pharmacies on OpenStreetMap within 2 km. Try another address.', fr: 'Aucune pharmacie trouvée sur OpenStreetMap dans un rayon de 2 km. Essayez une autre adresse.', it: 'Non abbiamo trovato farmacie su OpenStreetMap entro 2 km. Prova un altro indirizzo.', de: 'Keine Apotheken auf OpenStreetMap innerhalb von 2 km gefunden. Versuche eine andere Adresse.', pt: 'Não encontramos farmácias no OpenStreetMap em 2 km. Tente outro endereço.' },
  'cerc.allTab': { es: 'Todas', en: 'All', fr: 'Toutes', it: 'Tutte', de: 'Alle', pt: 'Todas' },
  'cerc.withPrices': { es: 'Con precios', en: 'With prices', fr: 'Avec prix', it: 'Con prezzi', de: 'Mit Preisen', pt: 'Com preços' },
  'cerc.other': { es: 'Otra', en: 'Other', fr: 'Autre', it: 'Altra', de: 'Andere', pt: 'Outra' },
  'cerc.dragPin': { es: 'Arrastra el punto azul para fijar tu dirección', en: 'Drag the blue dot to set your address', fr: 'Déplacez le point bleu pour fixer votre adresse', it: 'Trascina il punto blu per fissare il tuo indirizzo', de: 'Ziehe den blauen Punkt, um deine Adresse festzulegen', pt: 'Arraste o ponto azul para fixar seu endereço' },
  'cerc.searchHere': { es: 'Buscar farmacias aquí', en: 'Search pharmacies here', fr: 'Chercher des pharmacies ici', it: 'Cerca farmacie qui', de: 'Hier Apotheken suchen', pt: 'Buscar farmácias aqui' },
  'cerc.noPricedNearby': { es: 'No hay farmacias con precios cerca', en: 'No pharmacies with prices nearby', fr: 'Pas de pharmacies avec prix à proximité', it: 'Nessuna farmacia con prezzi nelle vicinanze', de: 'Keine Apotheken mit Preisen in der Nähe', pt: 'Não há farmácias com preços por perto' },
  'cerc.noPricedNearbyDesc': { es: 'No encontramos sedes de las cadenas que comparamos en este radio. Prueba con “Todas”.', en: 'We found no branches of the chains we compare in this radius. Try “All”.', fr: 'Aucune agence des chaînes que nous comparons dans ce rayon. Essayez « Toutes ».', it: 'Nessuna sede delle catene che confrontiamo in questo raggio. Prova con “Tutte”.', de: 'Keine Filialen der von uns verglichenen Ketten in diesem Umkreis. Versuche „Alle“.', pt: 'Não encontramos unidades das redes que comparamos neste raio. Tente “Todas”.' },
  'cerc.osmNote': {
    es: 'Datos de ubicación: OpenStreetMap (colaboradores de OSM). “Con precios” son sedes de las cadenas cuyos precios comparamos. Farmi es independiente y no está afiliado a estas farmacias; sus marcas pertenecen a sus titulares. La disponibilidad real de cada medicamento puede variar; confirma en la farmacia.',
    en: 'Location data: OpenStreetMap (OSM contributors). “With prices” are branches of the chains whose prices we compare. Farmi is independent and not affiliated with these pharmacies; their trademarks belong to their owners. Actual availability of each medication may vary; confirm at the pharmacy.',
    fr: 'Données de localisation : OpenStreetMap (contributeurs OSM). « Avec prix » sont des agences des chaînes dont nous comparons les prix. Farmi est indépendant et non affilié à ces pharmacies ; leurs marques appartiennent à leurs propriétaires. La disponibilité réelle peut varier ; confirmez en pharmacie.',
    it: 'Dati di posizione: OpenStreetMap (collaboratori OSM). “Con prezzi” sono sedi delle catene di cui confrontiamo i prezzi. Farmi è indipendente e non affiliato a queste farmacie; i marchi appartengono ai titolari. La disponibilità reale può variare; conferma in farmacia.',
    de: 'Standortdaten: OpenStreetMap (OSM-Mitwirkende). „Mit Preisen“ sind Filialen der Ketten, deren Preise wir vergleichen. Farmi ist unabhängig und nicht mit diesen Apotheken verbunden; die Marken gehören ihren Eigentümern. Die tatsächliche Verfügbarkeit kann variieren; bestätige sie in der Apotheke.',
    pt: 'Dados de localização: OpenStreetMap (colaboradores do OSM). “Com preços” são unidades das redes cujos preços comparamos. A Farmi é independente e não é afiliada a essas farmácias; suas marcas pertencem aos titulares. A disponibilidade real pode variar; confirme na farmácia.',
  },
  'cerc.openNow': { es: 'Abierta ahora', en: 'Open now', fr: 'Ouverte maintenant', it: 'Aperta ora', de: 'Jetzt geöffnet', pt: 'Aberta agora' },
  'cerc.closedNow': { es: 'Cerrada ahora', en: 'Closed now', fr: 'Fermée maintenant', it: 'Chiusa ora', de: 'Jetzt geschlossen', pt: 'Fechada agora' },
  'cerc.hoursUnknown': { es: 'Horario no verificado', en: 'Hours not verified', fr: 'Horaires non vérifiés', it: 'Orari non verificati', de: 'Öffnungszeiten nicht bestätigt', pt: 'Horário não verificado' },
  'cerc.otherPharmacy': { es: 'Otra farmacia', en: 'Other pharmacy', fr: 'Autre pharmacie', it: 'Altra farmacia', de: 'Andere Apotheke', pt: 'Outra farmácia' },
  'cerc.fromPrice': { es: 'desde', en: 'from', fr: 'à partir de', it: 'da', de: 'ab', pt: 'a partir de' },
  'cerc.noResultsForIn': { es: 'Sin resultados para “{q}” en {chain}', en: 'No results for “{q}” at {chain}', fr: 'Aucun résultat pour « {q} » chez {chain}', it: 'Nessun risultato per “{q}” da {chain}', de: 'Keine Ergebnisse für „{q}“ bei {chain}', pt: 'Sem resultados para “{q}” na {chain}' },
  'cerc.noPriceData': { es: 'Sin datos de precios para esta farmacia', en: 'No price data for this pharmacy', fr: 'Pas de données de prix pour cette pharmacie', it: 'Nessun dato sui prezzi per questa farmacia', de: 'Keine Preisdaten für diese Apotheke', pt: 'Sem dados de preços para esta farmácia' },
  // Fragmentos exactos para el AutomaticTranslator (textos partidos por spans dinámicos)
  'cerc.weCompare1': { es: 'Comparamos precios en línea de', en: 'We compare the online prices of', fr: 'Nous comparons les prix en ligne de', it: 'Confrontiamo i prezzi online di', de: 'Wir vergleichen die Online-Preise von', pt: 'Comparamos os preços online da' },
  'cerc.weCompare2': { es: '. Escribe un medicamento arriba para verlos.', en: '. Type a medication above to see them.', fr: '. Saisissez un médicament ci-dessus pour les voir.', it: '. Scrivi un farmaco sopra per vederli.', de: '. Gib oben ein Medikament ein, um sie zu sehen.', pt: '. Digite um medicamento acima para vê-los.' },
  'frag.allParen': { es: 'Todas (', en: 'All (', fr: 'Toutes (', it: 'Tutte (', de: 'Alle (', pt: 'Todas (' },
  'frag.withPricesParen': { es: 'Con precios (', en: 'With prices (', fr: 'Avec prix (', it: 'Con prezzi (', de: 'Mit Preisen (', pt: 'Com preços (' },
  'frag.noResultsQuote': { es: 'Sin resultados para “', en: 'No results for “', fr: 'Aucun résultat pour « ', it: 'Nessun risultato per “', de: 'Keine Ergebnisse für „', pt: 'Sem resultados para “' },
  'frag.quoteIn': { es: '” en', en: '” at', fr: ' » chez', it: '” da', de: '“ bei', pt: '” na' },
  'frag.genericSavings1': { es: 'El genérico puede ser hasta', en: 'The generic can be up to', fr: 'Le générique peut être jusqu’à', it: 'Il generico può costare fino al', de: 'Das Generikum kann bis zu', pt: 'O genérico pode ser até' },
  'frag.genericSavings2': { es: '% más barato con el mismo principio activo.', en: '% cheaper with the same active ingredient.', fr: '% moins cher avec le même principe actif.', it: '% in meno con lo stesso principio attivo.', de: '% günstiger sein, mit demselben Wirkstoff.', pt: '% mais barato com o mesmo princípio ativo.' },
  'frag.pharmaciesAvailable': { es: 'farmacias disponibles', en: 'pharmacies available', fr: 'pharmacies disponibles', it: 'farmacie disponibili', de: 'Apotheken verfügbar', pt: 'farmácias disponíveis' },
  'frag.deleteConfirm1': { es: 'Para confirmar, escribe', en: 'To confirm, type', fr: 'Pour confirmer, écrivez', it: 'Per confermare, scrivi', de: 'Zum Bestätigen tippe', pt: 'Para confirmar, escreva' },
  'frag.deleteConfirm2': { es: 'y toca el botón.', en: 'and tap the button.', fr: 'et touchez le bouton.', it: 'e tocca il pulsante.', de: 'ein und drücke den Button.', pt: 'e toque no botão.' },
  'frag.unidades': { es: 'unidades', en: 'units', fr: 'unités', it: 'unità', de: 'Stück', pt: 'unidades' },

  // ── Cuenta / carrito / lista ──
  'acct.needAccount': { es: 'Necesitas una cuenta', en: 'You need an account', fr: 'Vous avez besoin d’un compte', it: 'Ti serve un account', de: 'Du brauchst ein Konto', pt: 'Você precisa de uma conta' },
  'acct.login': { es: 'Iniciar sesión', en: 'Sign in', fr: 'Se connecter', it: 'Accedi', de: 'Anmelden', pt: 'Entrar' },
  'cart.needDesc': { es: 'Crea una cuenta gratuita para guardar tu carrito y acceder a el desde cualquier dispositivo.', en: 'Create a free account to save your cart and access it from any device.', fr: 'Créez un compte gratuit pour enregistrer votre panier et y accéder depuis n’importe quel appareil.', it: 'Crea un account gratuito per salvare il carrello e accedervi da qualsiasi dispositivo.', de: 'Erstelle ein kostenloses Konto, um deinen Warenkorb zu speichern und von jedem Gerät darauf zuzugreifen.', pt: 'Crie uma conta gratuita para salvar seu carrinho e acessá-lo de qualquer dispositivo.' },
  'list.needDesc': { es: 'Crea una cuenta gratuita para guardar medicamentos y acceder a tu lista desde cualquier dispositivo.', en: 'Create a free account to save medications and access your list from any device.', fr: 'Créez un compte gratuit pour enregistrer des médicaments et accéder à votre liste depuis n’importe quel appareil.', it: 'Crea un account gratuito per salvare farmaci e accedere alla tua lista da qualsiasi dispositivo.', de: 'Erstelle ein kostenloses Konto, um Medikamente zu speichern und von jedem Gerät auf deine Liste zuzugreifen.', pt: 'Crie uma conta gratuita para salvar medicamentos e acessar sua lista de qualquer dispositivo.' },
  'saved.one': { es: '1 medicamento guardado', en: '1 medication saved', fr: '1 médicament enregistré', it: '1 farmaco salvato', de: '1 Medikament gespeichert', pt: '1 medicamento salvo' },
  'saved.many': { es: '{n} medicamentos guardados', en: '{n} medications saved', fr: '{n} médicaments enregistrés', it: '{n} farmaci salvati', de: '{n} Medikamente gespeichert', pt: '{n} medicamentos salvos' },
  'cart.addPrompt': { es: 'Agrega medicamentos que quieras comprar', en: 'Add medications you want to buy', fr: 'Ajoutez les médicaments que vous voulez acheter', it: 'Aggiungi i farmaci che vuoi comprare', de: 'Füge Medikamente hinzu, die du kaufen möchtest', pt: 'Adicione medicamentos que você quer comprar' },
  'cart.addMore': { es: '+ Agregar más', en: '+ Add more', fr: '+ Ajouter plus', it: '+ Aggiungi altro', de: '+ Mehr hinzufügen', pt: '+ Adicionar mais' },
  'cart.emptyTitle': { es: 'Tu carrito esta vacio', en: 'Your cart is empty', fr: 'Votre panier est vide', it: 'Il tuo carrello è vuoto', de: 'Dein Warenkorb ist leer', pt: 'Seu carrinho está vazio' },
  'cart.emptyDesc': { es: 'Busca un medicamento y toca el icono del carrito para agregarlo aquí', en: 'Search a medication and tap the cart icon to add it here', fr: 'Cherchez un médicament et touchez l’icône du panier pour l’ajouter ici', it: 'Cerca un farmaco e tocca l’icona del carrello per aggiungerlo qui', de: 'Suche ein Medikament und tippe auf das Warenkorb-Symbol, um es hier hinzuzufügen', pt: 'Busque um medicamento e toque no ícone do carrinho para adicioná-lo aqui' },
  'cart.searchCta': { es: 'Buscar medicamentos', en: 'Search medications', fr: 'Rechercher des médicaments', it: 'Cerca farmaci', de: 'Medikamente suchen', pt: 'Buscar medicamentos' },
  'cart.remove': { es: 'Quitar', en: 'Remove', fr: 'Retirer', it: 'Rimuovi', de: 'Entfernen', pt: 'Remover' },
  'cart.seeCurrent': { es: 'Ver precios actuales', en: 'See current prices', fr: 'Voir les prix actuels', it: 'Vedi i prezzi attuali', de: 'Aktuelle Preise ansehen', pt: 'Ver preços atuais' },
  'cart.summary': { es: 'Resumen', en: 'Summary', fr: 'Récapitulatif', it: 'Riepilogo', de: 'Übersicht', pt: 'Resumo' },
  'cart.totalEst': { es: 'Total estimado', en: 'Estimated total', fr: 'Total estimé', it: 'Totale stimato', de: 'Geschätzte Summe', pt: 'Total estimado' },
  'cart.disclaimer': { es: 'Los precios pueden variar. Verifica en cada farmacia.', en: 'Prices may vary. Verify at each pharmacy.', fr: 'Les prix peuvent varier. Vérifiez dans chaque pharmacie.', it: 'I prezzi possono variare. Verifica in ogni farmacia.', de: 'Preise können variieren. Prüfe sie in jeder Apotheke.', pt: 'Os preços podem variar. Verifique em cada farmácia.' },
  'list.title': { es: 'Lista de medicamentos', en: 'Medication list', fr: 'Liste de médicaments', it: 'Lista dei farmaci', de: 'Medikamentenliste', pt: 'Lista de medicamentos' },
  'list.savePrompt': { es: 'Guarda los medicamentos que quieres seguir', en: 'Save the medications you want to track', fr: 'Enregistrez les médicaments que vous voulez suivre', it: 'Salva i farmaci che vuoi seguire', de: 'Speichere die Medikamente, die du verfolgen möchtest', pt: 'Salve os medicamentos que você quer acompanhar' },
  'list.emptyTitle': { es: 'Tu lista esta vacia', en: 'Your list is empty', fr: 'Votre liste est vide', it: 'La tua lista è vuota', de: 'Deine Liste ist leer', pt: 'Sua lista está vazia' },
  'list.emptyDesc': { es: 'Busca un medicamento y toca el corazon para guardarlo aquí', en: 'Search a medication and tap the heart to save it here', fr: 'Cherchez un médicament et touchez le cœur pour l’enregistrer ici', it: 'Cerca un farmaco e tocca il cuore per salvarlo qui', de: 'Suche ein Medikament und tippe auf das Herz, um es hier zu speichern', pt: 'Busque um medicamento e toque no coração para salvá-lo aqui' },
  'list.youSaved': { es: 'Has ahorrado', en: 'You’ve saved', fr: 'Vous avez économisé', it: 'Hai risparmiato', de: 'Du hast gespart', pt: 'Você economizou' },
  'list.youSavedNote': { es: 'al elegir el precio más bajo frente al precio de referencia', en: 'by choosing the lowest price versus the reference price', fr: 'en choisissant le prix le plus bas par rapport au prix de référence', it: 'scegliendo il prezzo più basso rispetto al prezzo di riferimento', de: 'durch die Wahl des niedrigsten Preises gegenüber dem Referenzpreis', pt: 'ao escolher o menor preço frente ao preço de referência' },

  // ── Mi cuenta ──
  'acct.needLoginDesc': { es: 'Inicia sesión para ver y administrar tu cuenta.', en: 'Sign in to see and manage your account.', fr: 'Connectez-vous pour voir et gérer votre compte.', it: 'Accedi per vedere e gestire il tuo account.', de: 'Melde dich an, um dein Konto zu sehen und zu verwalten.', pt: 'Entre para ver e administrar sua conta.' },
  'acct.profile': { es: 'Perfil', en: 'Profile', fr: 'Profil', it: 'Profilo', de: 'Profil', pt: 'Perfil' },
  'acct.name': { es: 'Nombre', en: 'Name', fr: 'Nom', it: 'Nome', de: 'Name', pt: 'Nome' },
  'acct.namePh': { es: 'Tu nombre', en: 'Your name', fr: 'Votre nom', it: 'Il tuo nome', de: 'Dein Name', pt: 'Seu nome' },
  'acct.email': { es: 'Correo electrónico', en: 'Email address', fr: 'Adresse e-mail', it: 'Indirizzo email', de: 'E-Mail-Adresse', pt: 'E-mail' },
  'acct.emailNote': { es: 'El correo no se puede cambiar desde aquí.', en: 'The email can’t be changed from here.', fr: 'L’e-mail ne peut pas être modifié ici.', it: 'L’email non si può cambiare da qui.', de: 'Die E-Mail kann hier nicht geändert werden.', pt: 'O e-mail não pode ser alterado por aqui.' },
  'acct.nameRequired': { es: 'Ingresa tu nombre.', en: 'Enter your name.', fr: 'Saisissez votre nom.', it: 'Inserisci il tuo nome.', de: 'Gib deinen Namen ein.', pt: 'Informe seu nome.' },
  'acct.saveError': { es: 'No se pudo guardar. Intenta de nuevo.', en: 'Couldn’t save. Try again.', fr: 'Impossible d’enregistrer. Réessayez.', it: 'Impossibile salvare. Riprova.', de: 'Konnte nicht gespeichert werden. Versuche es erneut.', pt: 'Não foi possível salvar. Tente novamente.' },
  'acct.nameUpdated': { es: 'Nombre actualizado.', en: 'Name updated.', fr: 'Nom mis à jour.', it: 'Nome aggiornato.', de: 'Name aktualisiert.', pt: 'Nome atualizado.' },
  'acct.saveChanges': { es: 'Guardar cambios', en: 'Save changes', fr: 'Enregistrer', it: 'Salva modifiche', de: 'Änderungen speichern', pt: 'Salvar alterações' },
  'acct.setPwd': { es: 'Establecer contraseña', en: 'Set password', fr: 'Définir un mot de passe', it: 'Imposta password', de: 'Passwort festlegen', pt: 'Definir senha' },
  'acct.changePwd': { es: 'Cambiar contraseña', en: 'Change password', fr: 'Changer le mot de passe', it: 'Cambia password', de: 'Passwort ändern', pt: 'Alterar senha' },
  'acct.pwdGoogleDesc': { es: 'Entras con Google. Si quieres, crea una contraseña para también poder entrar con tu correo.', en: 'You sign in with Google. If you want, create a password so you can also sign in with your email.', fr: 'Vous vous connectez avec Google. Si vous voulez, créez un mot de passe pour pouvoir aussi vous connecter avec votre e-mail.', it: 'Accedi con Google. Se vuoi, crea una password per poter entrare anche con la tua email.', de: 'Du meldest dich mit Google an. Wenn du willst, erstelle ein Passwort, um dich auch mit deiner E-Mail anzumelden.', pt: 'Você entra com o Google. Se quiser, crie uma senha para também poder entrar com seu e-mail.' },
  'acct.pwdMinDesc': { es: 'Usa al menos 8 caracteres.', en: 'Use at least 8 characters.', fr: 'Utilisez au moins 8 caractères.', it: 'Usa almeno 8 caratteri.', de: 'Verwende mindestens 8 Zeichen.', pt: 'Use pelo menos 8 caracteres.' },
  'acct.newPwdPh': { es: 'Nueva contraseña', en: 'New password', fr: 'Nouveau mot de passe', it: 'Nuova password', de: 'Neues Passwort', pt: 'Nova senha' },
  'acct.repeatPwdPh': { es: 'Repetir contraseña', en: 'Repeat password', fr: 'Répéter le mot de passe', it: 'Ripeti password', de: 'Passwort wiederholen', pt: 'Repetir senha' },
  'acct.show': { es: 'Ver', en: 'Show', fr: 'Voir', it: 'Mostra', de: 'Zeigen', pt: 'Ver' },
  'acct.hide': { es: 'Ocultar', en: 'Hide', fr: 'Masquer', it: 'Nascondi', de: 'Verbergen', pt: 'Ocultar' },
  'acct.pwdMin8': { es: 'La contraseña debe tener al menos 8 caracteres.', en: 'The password must be at least 8 characters.', fr: 'Le mot de passe doit contenir au moins 8 caractères.', it: 'La password deve avere almeno 8 caratteri.', de: 'Das Passwort muss mindestens 8 Zeichen haben.', pt: 'A senha deve ter pelo menos 8 caracteres.' },
  'acct.pwdMismatch': { es: 'Las contraseñas no coinciden.', en: 'The passwords don’t match.', fr: 'Les mots de passe ne correspondent pas.', it: 'Le password non coincidono.', de: 'Die Passwörter stimmen nicht überein.', pt: 'As senhas não coincidem.' },
  'acct.pwdChangeError': { es: 'No se pudo cambiar.', en: 'Couldn’t change it.', fr: 'Impossible de le changer.', it: 'Impossibile cambiarla.', de: 'Konnte nicht geändert werden.', pt: 'Não foi possível alterar.' },
  'acct.pwdSetOk': { es: 'Contraseña establecida. Ya puedes entrar también con tu correo.', en: 'Password set. You can now also sign in with your email.', fr: 'Mot de passe défini. Vous pouvez maintenant aussi vous connecter avec votre e-mail.', it: 'Password impostata. Ora puoi entrare anche con la tua email.', de: 'Passwort festgelegt. Du kannst dich jetzt auch mit deiner E-Mail anmelden.', pt: 'Senha definida. Agora você também pode entrar com seu e-mail.' },
  'acct.pwdUpdated': { es: 'Contraseña actualizada.', en: 'Password updated.', fr: 'Mot de passe mis à jour.', it: 'Password aggiornata.', de: 'Passwort aktualisiert.', pt: 'Senha atualizada.' },
  'acct.updatePwd': { es: 'Actualizar contraseña', en: 'Update password', fr: 'Mettre à jour le mot de passe', it: 'Aggiorna password', de: 'Passwort aktualisieren', pt: 'Atualizar senha' },
  'acct.mySaved': { es: 'Mis guardados', en: 'My saved items', fr: 'Mes enregistrements', it: 'I miei salvati', de: 'Meine gespeicherten', pt: 'Meus salvos' },
  'acct.deleteTitle': { es: 'Eliminar cuenta', en: 'Delete account', fr: 'Supprimer le compte', it: 'Elimina account', de: 'Konto löschen', pt: 'Excluir conta' },
  'acct.deleteDesc': {
    es: 'Borra tu cuenta y todos tus datos (carrito y lista de deseos) de forma permanente. Esta acción no se puede deshacer. Conforme a la Ley 1581 de 2012 (Habeas Data), puedes eliminar tus datos cuando quieras.',
    en: 'Permanently deletes your account and all your data (cart and wishlist). This action cannot be undone. Under Colombia’s Law 1581 of 2012 (Habeas Data), you can delete your data whenever you want.',
    fr: 'Supprime définitivement votre compte et toutes vos données (panier et liste de souhaits). Cette action est irréversible. Conformément à la loi colombienne 1581 de 2012 (Habeas Data), vous pouvez supprimer vos données quand vous le souhaitez.',
    it: 'Elimina definitivamente il tuo account e tutti i tuoi dati (carrello e lista dei desideri). Questa azione non si può annullare. In base alla legge colombiana 1581 del 2012 (Habeas Data), puoi eliminare i tuoi dati quando vuoi.',
    de: 'Löscht dein Konto und alle deine Daten (Warenkorb und Wunschliste) endgültig. Diese Aktion kann nicht rückgängig gemacht werden. Nach dem kolumbianischen Gesetz 1581 von 2012 (Habeas Data) kannst du deine Daten jederzeit löschen.',
    pt: 'Apaga sua conta e todos os seus dados (carrinho e lista de desejos) de forma permanente. Esta ação não pode ser desfeita. Conforme a Lei colombiana 1581 de 2012 (Habeas Data), você pode excluir seus dados quando quiser.',
  },
  'acct.deleteBtn': { es: 'Eliminar mi cuenta', en: 'Delete my account', fr: 'Supprimer mon compte', it: 'Elimina il mio account', de: 'Mein Konto löschen', pt: 'Excluir minha conta' },
  'acct.deleteConfirm': { es: 'Para confirmar, escribe {word} y toca el botón.', en: 'To confirm, type {word} and tap the button.', fr: 'Pour confirmer, écrivez {word} et touchez le bouton.', it: 'Per confermare, scrivi {word} e tocca il pulsante.', de: 'Zum Bestätigen tippe {word} ein und drücke den Button.', pt: 'Para confirmar, escreva {word} e toque no botão.' },
  'acct.deleteYes': { es: 'Sí, eliminar definitivamente', en: 'Yes, delete permanently', fr: 'Oui, supprimer définitivement', it: 'Sì, elimina definitivamente', de: 'Ja, endgültig löschen', pt: 'Sim, excluir definitivamente' },
  'acct.deleting': { es: 'Eliminando...', en: 'Deleting...', fr: 'Suppression...', it: 'Eliminazione...', de: 'Wird gelöscht...', pt: 'Excluindo...' },
  'acct.cancel': { es: 'Cancelar', en: 'Cancel', fr: 'Annuler', it: 'Annulla', de: 'Abbrechen', pt: 'Cancelar' },
  'acct.sessionInvalid': { es: 'Sesión no válida. Vuelve a iniciar sesión.', en: 'Invalid session. Sign in again.', fr: 'Session non valide. Reconnectez-vous.', it: 'Sessione non valida. Accedi di nuovo.', de: 'Ungültige Sitzung. Melde dich erneut an.', pt: 'Sessão inválida. Entre novamente.' },
  'acct.deleteUnavailable': { es: 'La eliminación no está disponible en este momento.', en: 'Deletion is not available right now.', fr: 'La suppression n’est pas disponible pour le moment.', it: 'L’eliminazione non è disponibile al momento.', de: 'Das Löschen ist derzeit nicht verfügbar.', pt: 'A exclusão não está disponível no momento.' },
  'acct.deleteFailed': { es: 'No se pudo eliminar la cuenta. Intenta de nuevo.', en: 'Couldn’t delete the account. Try again.', fr: 'Impossible de supprimer le compte. Réessayez.', it: 'Impossibile eliminare l’account. Riprova.', de: 'Konto konnte nicht gelöscht werden. Versuche es erneut.', pt: 'Não foi possível excluir a conta. Tente novamente.' },
  'acct.connError': { es: 'Error de conexión. Intenta de nuevo.', en: 'Connection error. Try again.', fr: 'Erreur de connexion. Réessayez.', it: 'Errore di connessione. Riprova.', de: 'Verbindungsfehler. Versuche es erneut.', pt: 'Erro de conexão. Tente novamente.' },
  'acct.privacyNote': { es: 'Manejamos tus datos según nuestra', en: 'We handle your data according to our', fr: 'Nous traitons vos données selon notre', it: 'Trattiamo i tuoi dati secondo la nostra', de: 'Wir behandeln deine Daten gemäß unserer', pt: 'Tratamos seus dados conforme nossa' },
  'acct.privacyLink': { es: 'política de privacidad', en: 'privacy policy', fr: 'politique de confidentialité', it: 'informativa sulla privacy', de: 'Datenschutzerklärung', pt: 'política de privacidade' },

  // ── Mapa de cercanas en portada / autocompletado ──
  'map.orAddress': { es: 'O escribe tu dirección o barrio', en: 'Or type your address or neighborhood', fr: 'Ou saisissez votre adresse ou quartier', it: 'O scrivi il tuo indirizzo o quartiere', de: 'Oder gib deine Adresse oder dein Viertel ein', pt: 'Ou digite seu endereço ou bairro' },
  'map.gettingLocation': { es: 'Obteniendo tu ubicación...', en: 'Getting your location...', fr: 'Obtention de votre position...', it: 'Rilevamento della posizione...', de: 'Standort wird ermittelt...', pt: 'Obtendo sua localização...' },
  'map.addressPh': { es: 'Escribe tu dirección o barrio (ej: Calle 53 # 25-10, Bogotá)', en: 'Type your address or neighborhood (e.g. Calle 53 # 25-10, Bogotá)', fr: 'Saisissez votre adresse ou quartier (ex : Calle 53 # 25-10, Bogotá)', it: 'Scrivi il tuo indirizzo o quartiere (es: Calle 53 # 25-10, Bogotá)', de: 'Gib deine Adresse oder dein Viertel ein (z. B. Calle 53 # 25-10, Bogotá)', pt: 'Digite seu endereço ou bairro (ex: Calle 53 # 25-10, Bogotá)' },
  'map.changeAddressPh': { es: 'Cambiar ubicación: escribe tu dirección', en: 'Change location: type your address', fr: 'Changer de position : saisissez votre adresse', it: 'Cambia posizione: scrivi il tuo indirizzo', de: 'Standort ändern: gib deine Adresse ein', pt: 'Mudar localização: digite seu endereço' },
  'map.pricedNearYou': { es: 'farmacias cuyos precios comparamos, cerca de ti.', en: 'pharmacies whose prices we compare, near you.', fr: 'pharmacies dont nous comparons les prix, près de vous.', it: 'farmacie di cui confrontiamo i prezzi, vicino a te.', de: 'Apotheken, deren Preise wir vergleichen, in deiner Nähe.', pt: 'farmácias cujos preços comparamos, perto de você.' },
  'map.nearYouPart': { es: 'farmacias cerca de ti,', en: 'pharmacies near you,', fr: 'pharmacies près de vous,', it: 'farmacie vicino a te,', de: 'Apotheken in deiner Nähe,', pt: 'farmácias perto de você,' },
  'map.withPricesPart': { es: 'con precios en Farmi.', en: 'with prices on Farmi.', fr: 'avec prix sur Farmi.', it: 'con prezzi su Farmi.', de: 'mit Preisen auf Farmi.', pt: 'com preços na Farmi.' },
  'addr.typePh': { es: 'Escribe tu dirección', en: 'Type your address', fr: 'Saisissez votre adresse', it: 'Scrivi il tuo indirizzo', de: 'Gib deine Adresse ein', pt: 'Digite seu endereço' },
  'addr.aria': { es: 'Dirección', en: 'Address', fr: 'Adresse', it: 'Indirizzo', de: 'Adresse', pt: 'Endereço' },
  'addr.searching': { es: 'Buscando direcciones...', en: 'Searching addresses...', fr: 'Recherche d’adresses...', it: 'Ricerca indirizzi...', de: 'Adressen werden gesucht...', pt: 'Buscando endereços...' },

  // ── Rastreador / historial de precios ──
  'tracker.title': { es: 'Historial de precios', en: 'Price history', fr: 'Historique des prix', it: 'Cronologia dei prezzi', de: 'Preisverlauf', pt: 'Histórico de preços' },
  'tracker.builtDaily': { es: 'Construido con datos reales, día a día', en: 'Built with real data, day by day', fr: 'Construit avec des données réelles, jour après jour', it: 'Costruito con dati reali, giorno per giorno', de: 'Aufgebaut mit echten Daten, Tag für Tag', pt: 'Construído com dados reais, dia a dia' },
  'tracker.hoverHint': { es: 'Pasa el cursor sobre el grafico para ver el detalle', en: 'Hover over the chart to see the detail', fr: 'Passez le curseur sur le graphique pour voir le détail', it: 'Passa il cursore sul grafico per vedere il dettaglio', de: 'Fahre mit dem Cursor über das Diagramm, um Details zu sehen', pt: 'Passe o cursor sobre o gráfico para ver o detalhe' },
  'tracker.firstRecord': { es: 'Primer registro guardado', en: 'First record saved', fr: 'Premier enregistrement sauvegardé', it: 'Primo dato salvato', de: 'Erster Eintrag gespeichert', pt: 'Primeiro registro salvo' },
  'tracker.noHistory': { es: 'Aún no hay historial', en: 'No history yet', fr: 'Pas encore d’historique', it: 'Ancora nessuna cronologia', de: 'Noch kein Verlauf', pt: 'Ainda não há histórico' },
  'tracker.trackingDesc': { es: 'Ya estamos rastreando este medicamento. El historial aparecera a medida que registremos el precio cada día.', en: 'We’re already tracking this medication. The history will appear as we record the price each day.', fr: 'Nous suivons déjà ce médicament. L’historique apparaîtra au fur et à mesure que nous enregistrons le prix chaque jour.', it: 'Stiamo già monitorando questo farmaco. La cronologia apparirà man mano che registriamo il prezzo ogni giorno.', de: 'Wir verfolgen dieses Medikament bereits. Der Verlauf erscheint, während wir den Preis täglich erfassen.', pt: 'Já estamos acompanhando este medicamento. O histórico aparecerá à medida que registrarmos o preço a cada dia.' },
  'tracker.startDesc': { es: 'Rastrea este medicamento para empezar a guardar su precio cada día y construir la grafica de evolucion.', en: 'Track this medication to start saving its price every day and build the trend chart.', fr: 'Suivez ce médicament pour commencer à enregistrer son prix chaque jour et construire le graphique d’évolution.', it: 'Monitora questo farmaco per iniziare a salvare il prezzo ogni giorno e costruire il grafico di evoluzione.', de: 'Verfolge dieses Medikament, um seinen Preis täglich zu speichern und die Verlaufskurve aufzubauen.', pt: 'Acompanhe este medicamento para começar a salvar o preço todos os dias e construir o gráfico de evolução.' },
  'tracker.loginDesc': { es: 'Inicia sesión para rastrear este medicamento y guardar su precio cada día.', en: 'Sign in to track this medication and save its price every day.', fr: 'Connectez-vous pour suivre ce médicament et enregistrer son prix chaque jour.', it: 'Accedi per monitorare questo farmaco e salvarne il prezzo ogni giorno.', de: 'Melde dich an, um dieses Medikament zu verfolgen und seinen Preis täglich zu speichern.', pt: 'Entre para acompanhar este medicamento e salvar o preço todos os dias.' },
  'tracker.loginShort': { es: 'Inicia sesión para rastrear precios.', en: 'Sign in to track prices.', fr: 'Connectez-vous pour suivre les prix.', it: 'Accedi per monitorare i prezzi.', de: 'Melde dich an, um Preise zu verfolgen.', pt: 'Entre para acompanhar preços.' },
  'tracker.startError': { es: 'No se pudo iniciar el rastreo. Intenta de nuevo en unos minutos.', en: 'Couldn’t start tracking. Try again in a few minutes.', fr: 'Impossible de démarrer le suivi. Réessayez dans quelques minutes.', it: 'Impossibile avviare il monitoraggio. Riprova tra qualche minuto.', de: 'Tracking konnte nicht gestartet werden. Versuche es in ein paar Minuten erneut.', pt: 'Não foi possível iniciar o acompanhamento. Tente novamente em alguns minutos.' },
  'tracker.tracking': { es: 'Rastreando.', en: 'Tracking.', fr: 'Suivi en cours.', it: 'Monitoraggio attivo.', de: 'Wird verfolgt.', pt: 'Acompanhando.' },
  'tracker.dailyNote': { es: 'Guardaremos el precio cada día para construir el historial.', en: 'We’ll save the price every day to build the history.', fr: 'Nous enregistrerons le prix chaque jour pour construire l’historique.', it: 'Salveremo il prezzo ogni giorno per costruire la cronologia.', de: 'Wir speichern den Preis täglich, um den Verlauf aufzubauen.', pt: 'Salvaremos o preço todos os dias para construir o histórico.' },
  'tracker.updateNow': { es: 'Actualizar ahora', en: 'Update now', fr: 'Mettre à jour maintenant', it: 'Aggiorna ora', de: 'Jetzt aktualisieren', pt: 'Atualizar agora' },
  'tracker.trackPrice': { es: 'Rastrear precio', en: 'Track price', fr: 'Suivre le prix', it: 'Monitora il prezzo', de: 'Preis verfolgen', pt: 'Acompanhar preço' },

  // ── Comparación de lista / precios en vivo ──
  'listcmp.title': { es: 'Total por farmacia', en: 'Total per pharmacy', fr: 'Total par pharmacie', it: 'Totale per farmacia', de: 'Summe pro Apotheke', pt: 'Total por farmácia' },
  'listcmp.calculating': { es: 'Calculando...', en: 'Calculating...', fr: 'Calcul en cours...', it: 'Calcolo in corso...', de: 'Wird berechnet...', pt: 'Calculando...' },
  'listcmp.recalc': { es: 'Recalcular', en: 'Recalculate', fr: 'Recalculer', it: 'Ricalcola', de: 'Neu berechnen', pt: 'Recalcular' },
  'listcmp.compareTotal': { es: 'Comparar total', en: 'Compare total', fr: 'Comparer le total', it: 'Confronta il totale', de: 'Summe vergleichen', pt: 'Comparar total' },
  'listcmp.consulting': { es: 'Consultando precios actuales en las farmacias...', en: 'Checking current prices at the pharmacies...', fr: 'Consultation des prix actuels dans les pharmacies...', it: 'Consultazione dei prezzi attuali nelle farmacie...', de: 'Aktuelle Preise der Apotheken werden abgefragt...', pt: 'Consultando os preços atuais nas farmácias...' },
  'listcmp.hasAll': { es: 'Tiene todos tus medicamentos', en: 'Has all your medications', fr: 'A tous vos médicaments', it: 'Ha tutti i tuoi farmaci', de: 'Hat alle deine Medikamente', pt: 'Tem todos os seus medicamentos' },
  'live.subtitle': { es: 'Consultamos el precio directamente en cada farmacia', en: 'We check the price directly at each pharmacy', fr: 'Nous consultons le prix directement dans chaque pharmacie', it: 'Consultiamo il prezzo direttamente in ogni farmacia', de: 'Wir fragen den Preis direkt bei jeder Apotheke ab', pt: 'Consultamos o preço diretamente em cada farmácia' },
  'live.consulting': { es: 'Consultando precios...', en: 'Checking prices...', fr: 'Consultation des prix...', it: 'Consultazione dei prezzi...', de: 'Preise werden abgefragt...', pt: 'Consultando preços...' },
  'live.disclaimer': { es: 'Precios de referencia tomados en tiempo real. Pueden variar por sede, presentación y promociones.', en: 'Reference prices taken in real time. They may vary by branch, form and promotions.', fr: 'Prix indicatifs relevés en temps réel. Ils peuvent varier selon le point de vente, la présentation et les promotions.', it: 'Prezzi indicativi rilevati in tempo reale. Possono variare per sede, formato e promozioni.', de: 'Referenzpreise in Echtzeit erfasst. Sie können je nach Filiale, Darreichungsform und Aktionen variieren.', pt: 'Preços de referência obtidos em tempo real. Podem variar por unidade, apresentação e promoções.' },
  'live.error': { es: 'No pudimos cargar los precios ahora mismo.', en: 'We couldn’t load the prices right now.', fr: 'Impossible de charger les prix pour le moment.', it: 'Non siamo riusciti a caricare i prezzi in questo momento.', de: 'Wir konnten die Preise gerade nicht laden.', pt: 'Não conseguimos carregar os preços agora.' },

  // ── Aviso médico y chat (solo el marco; el contenido del bot sigue en español) ──
  'disclaimer.aria': { es: 'Aviso importante sobre información médica', en: 'Important notice about medical information', fr: 'Avis important sur les informations médicales', it: 'Avviso importante sulle informazioni mediche', de: 'Wichtiger Hinweis zu medizinischen Informationen', pt: 'Aviso importante sobre informações médicas' },
  'disclaimer.text': { es: 'Esta plataforma no sustituye la asesoría médica profesional.', en: 'This platform does not replace professional medical advice.', fr: 'Cette plateforme ne remplace pas un avis médical professionnel.', it: 'Questa piattaforma non sostituisce la consulenza medica professionale.', de: 'Diese Plattform ersetzt keine professionelle medizinische Beratung.', pt: 'Esta plataforma não substitui a orientação médica profissional.' },
  'disclaimer.close': { es: 'Cerrar aviso', en: 'Close notice', fr: 'Fermer l’avis', it: 'Chiudi avviso', de: 'Hinweis schließen', pt: 'Fechar aviso' },
  'chat.aiAssistant': { es: 'Asistente con IA', en: 'AI assistant', fr: 'Assistant IA', it: 'Assistente IA', de: 'KI-Assistent', pt: 'Assistente com IA' },
  'chat.online': { es: 'En línea ahora', en: 'Online now', fr: 'En ligne maintenant', it: 'Online ora', de: 'Jetzt online', pt: 'Online agora' },
  'chat.close': { es: 'Cerrar chat', en: 'Close chat', fr: 'Fermer le chat', it: 'Chiudi chat', de: 'Chat schließen', pt: 'Fechar chat' },
  'chat.inputPh': { es: 'Escribe tu pregunta...', en: 'Type your question...', fr: 'Écrivez votre question...', it: 'Scrivi la tua domanda...', de: 'Schreibe deine Frage...', pt: 'Escreva sua pergunta...' },
  'chat.inputAria': { es: 'Escribe tu pregunta', en: 'Type your question', fr: 'Écrivez votre question', it: 'Scrivi la tua domanda', de: 'Schreibe deine Frage', pt: 'Escreva sua pergunta' },
  'chat.send': { es: 'Enviar', en: 'Send', fr: 'Envoyer', it: 'Invia', de: 'Senden', pt: 'Enviar' },
  'chat.helpSeconds': { es: 'Te ayudo en segundos', en: 'I’ll help you in seconds', fr: 'Je vous aide en quelques secondes', it: 'Ti aiuto in pochi secondi', de: 'Ich helfe dir in Sekunden', pt: 'Ajudo você em segundos' },
  'chat.closeAssistant': { es: 'Cerrar asistente', en: 'Close assistant', fr: 'Fermer l’assistant', it: 'Chiudi assistente', de: 'Assistent schließen', pt: 'Fechar assistente' },
  'banner.overpaying': { es: '¿Pagando de más por tus medicamentos? Compara los precios y ahorra con Farmi.', en: 'Overpaying for your medications? Compare prices and save with Farmi.', fr: 'Vous payez trop cher vos médicaments ? Comparez les prix et économisez avec Farmi.', it: 'Stai pagando troppo i tuoi farmaci? Confronta i prezzi e risparmia con Farmi.', de: 'Zahlst du zu viel für deine Medikamente? Vergleiche Preise und spare mit Farmi.', pt: 'Pagando a mais pelos seus medicamentos? Compare os preços e economize com a Farmi.' },
  'chat.openAssistant': { es: 'Abrir asistente Farmi', en: 'Open Farmi assistant', fr: 'Ouvrir l’assistant Farmi', it: 'Apri l’assistente Farmi', de: 'Farmi-Assistent öffnen', pt: 'Abrir assistente Farmi' },
}
