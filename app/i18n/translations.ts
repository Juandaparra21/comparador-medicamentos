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
    es: '6 farmacias en una búsqueda', en: '6 pharmacies in one search', fr: '6 pharmacies en une seule recherche', it: '6 farmacie in una ricerca', de: '6 Apotheken mit einer Suche', pt: '6 farmácias em uma busca',
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
  'value3.title': { es: '6 farmacias a la vez', en: '6 pharmacies at once', fr: '6 pharmacies à la fois', it: '6 farmacie insieme', de: '6 Apotheken auf einmal', pt: '6 farmácias de uma vez' },
  'value3.desc': {
    es: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y Olimpica.', en: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam and Olimpica.', fr: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam et Olimpica.', it: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam e Olimpica.', de: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam und Olimpica.', pt: 'La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam e Olimpica.',
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
    es: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y Olimpica. Consultamos sus precios cuando haces una búsqueda.',
    en: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam and Olimpica. We check their prices when you search.',
    fr: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam et Olimpica. Nous consultons leurs prix lors de votre recherche.',
    it: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam e Olimpica. Controlliamo i loro prezzi quando fai una ricerca.',
    de: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam und Olimpica. Wir prüfen ihre Preise, wenn du suchst.',
    pt: 'Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam e Olimpica. Consultamos os preços deles quando você busca.',
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
}
