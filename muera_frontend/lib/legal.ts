/**
 * Privacy policy and terms of sale, per language. {company}, {email} and {address}
 * are filled from Admin → Settings → Store details.
 *
 * Written for a Swiss online shop (revised FADP, with GDPR for EU customers) selling
 * ready-to-wear and made-to-measure garments. Have it reviewed by your legal adviser.
 */

export type LegalDoc = "privacy" | "terms";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalContent {
  title: string;
  description: string;
  updatedLabel: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_UPDATED = "2026-10-09";

const privacy: Record<string, LegalContent> = {
  en: {
    title: "Privacy Policy",
    description: "How MUERA collects, uses and protects your personal data.",
    updatedLabel: "Last updated",
    intro:
      "This policy explains which personal data we process when you visit our website, create an account, configure a made-to-measure garment or place an order, and what rights you have. We process data in accordance with the Swiss Federal Act on Data Protection (FADP) and, where it applies, the EU General Data Protection Regulation (GDPR).",
    sections: [
      {
        heading: "1. Who is responsible",
        paragraphs: [
          "{company}, operator of the MUERA online shop, is responsible for the processing described here.",
          "Address: {address}. Email: {email}. Please use this address for any questions about data protection.",
        ],
      },
      {
        heading: "2. Data we process",
        list: [
          "Account data: name, email address, phone number, preferred language and saved addresses. Passwords are stored only in encrypted (hashed) form by our authentication provider.",
          "Order data: products ordered, shipping and billing addresses, order notes, payment status and order history. We never see or store your full card details — payments are handled by Stripe.",
          "Made-to-measure data: the fabrics, styles and details you choose in the 3D configurator and the body measurements needed to make your garment.",
          "Shopping cart: the contents of your cart and, if you enter it at checkout, your email address, so that we can help you finish an order you did not complete.",
          "Messages: what you send us through the contact form or by email, and product reviews you publish.",
          "Technical data: IP address, browser type, date and time of access and similar log data that our servers record for security and to operate the website.",
        ],
      },
      {
        heading: "3. Why we process it",
        list: [
          "To perform our contract with you: processing and delivering orders, producing made-to-measure garments, handling returns and customer service.",
          "To manage your customer account and let you see your orders and saved addresses.",
          "Based on our legitimate interest: securing the website, preventing fraud, improving our offer, and reminding you once about items left in your cart. You can object to cart reminders at any time.",
          "To comply with legal obligations, in particular the duty to keep accounting records.",
          "Where you have given consent, for the purpose you agreed to. You can withdraw consent at any time with effect for the future.",
        ],
      },
      {
        heading: "4. Who receives your data",
        paragraphs: [
          "We share personal data only as far as necessary, with service providers who process it on our behalf and are bound by contract:",
        ],
        list: [
          "Supabase — database, user accounts and file storage for the shop.",
          "Stripe — payment processing. Stripe receives your payment details directly and processes them under its own privacy policy.",
          "MirrorSize — the 3D configurator in which you design made-to-measure garments; your selections and measurements are processed there.",
          "Our tailoring workshop — receives the specification and measurements needed to make your garment.",
          "Shipping carriers such as Swiss Post — receive your name and delivery address.",
          "Our website hosting and email providers.",
        ],
      },
      {
        heading: "5. Transfers abroad",
        paragraphs: [
          "Some of these providers process data outside Switzerland and the European Economic Area, for example in the United States or India. In those cases we rely on the safeguards recognised by Swiss and EU law, such as the EU Standard Contractual Clauses or the Swiss-US Data Privacy Framework.",
        ],
      },
      {
        heading: "6. How long we keep data",
        paragraphs: [
          "Account data is kept until you ask us to delete your account. Order and accounting records are kept for ten years as required by Swiss law. Made-to-measure specifications and measurements are kept with your account so that you can reorder; you can ask us to delete them at any time. Saved carts are kept until you complete or empty them and inactive carts are removed regularly. Contact messages are deleted once your request has been dealt with and no longer needs to be kept.",
        ],
      },
      {
        heading: "7. Cookies and local storage",
        paragraphs: [
          "We only use cookies and browser storage that are needed for the shop to work: keeping you signed in, remembering your cart and language, and completing payment securely. We do not use advertising or tracking cookies and do not run analytics tools that profile visitors.",
        ],
      },
      {
        heading: "8. Your rights",
        paragraphs: [
          "Within the limits of the applicable law you have the right to access your data, have it corrected or deleted, restrict or object to its processing, receive it in a common format, and withdraw consent. To exercise these rights, write to {email}. You may also lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC) or, if you live in the EU, with your local data protection authority.",
        ],
      },
      {
        heading: "9. Security",
        paragraphs: [
          "We protect your data with appropriate technical and organisational measures, including encrypted connections (TLS), access controls and restricted administrative access.",
        ],
      },
      {
        heading: "10. Changes",
        paragraphs: [
          "We may update this policy when our services or the law change. The version published on this page applies.",
        ],
      },
    ],
  },
  de: {
    title: "Datenschutzerklärung",
    description: "Wie MUERA Ihre Personendaten erhebt, verwendet und schützt.",
    updatedLabel: "Stand",
    intro:
      "Diese Erklärung beschreibt, welche Personendaten wir bearbeiten, wenn Sie unsere Website besuchen, ein Kundenkonto eröffnen, ein Massprodukt konfigurieren oder eine Bestellung aufgeben, und welche Rechte Sie haben. Wir bearbeiten Daten gemäss dem Schweizer Bundesgesetz über den Datenschutz (DSG) und, soweit anwendbar, der EU-Datenschutz-Grundverordnung (DSGVO).",
    sections: [
      {
        heading: "1. Verantwortliche Stelle",
        paragraphs: [
          "Verantwortlich für die hier beschriebene Datenbearbeitung ist {company}, Betreiberin des Online-Shops MUERA.",
          "Adresse: {address}. E-Mail: {email}. Für Fragen zum Datenschutz wenden Sie sich bitte an diese Adresse.",
        ],
      },
      {
        heading: "2. Welche Daten wir bearbeiten",
        list: [
          "Kontodaten: Name, E-Mail-Adresse, Telefonnummer, bevorzugte Sprache und gespeicherte Adressen. Passwörter werden von unserem Authentifizierungsanbieter ausschliesslich verschlüsselt (gehasht) gespeichert.",
          "Bestelldaten: bestellte Produkte, Liefer- und Rechnungsadresse, Bestellnotizen, Zahlungsstatus und Bestellverlauf. Ihre vollständigen Kartendaten sehen und speichern wir nie – die Zahlung wird über Stripe abgewickelt.",
          "Massdaten: die im 3D-Konfigurator gewählten Stoffe, Schnitte und Details sowie die für die Anfertigung nötigen Körpermasse.",
          "Warenkorb: der Inhalt Ihres Warenkorbs und – sofern Sie sie im Checkout eingeben – Ihre E-Mail-Adresse, damit wir Ihnen helfen können, eine nicht abgeschlossene Bestellung fertigzustellen.",
          "Nachrichten: Ihre Anfragen über das Kontaktformular oder per E-Mail sowie veröffentlichte Produktbewertungen.",
          "Technische Daten: IP-Adresse, Browsertyp, Datum und Uhrzeit des Zugriffs und ähnliche Protokolldaten, die unsere Server aus Sicherheitsgründen und für den Betrieb der Website aufzeichnen.",
        ],
      },
      {
        heading: "3. Zwecke der Bearbeitung",
        list: [
          "Zur Erfüllung des Vertrags mit Ihnen: Abwicklung und Lieferung von Bestellungen, Anfertigung von Massprodukten, Retouren und Kundendienst.",
          "Zur Verwaltung Ihres Kundenkontos, damit Sie Bestellungen und gespeicherte Adressen einsehen können.",
          "Gestützt auf unser berechtigtes Interesse: Sicherheit der Website, Betrugsprävention, Verbesserung unseres Angebots sowie eine einmalige Erinnerung an Artikel in Ihrem Warenkorb. Der Warenkorb-Erinnerung können Sie jederzeit widersprechen.",
          "Zur Erfüllung gesetzlicher Pflichten, insbesondere der Aufbewahrungspflicht für Geschäftsbücher.",
          "Soweit Sie eingewilligt haben, für den vereinbarten Zweck. Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.",
        ],
      },
      {
        heading: "4. Empfänger Ihrer Daten",
        paragraphs: [
          "Wir geben Personendaten nur soweit nötig an Dienstleister weiter, die sie in unserem Auftrag bearbeiten und vertraglich gebunden sind:",
        ],
        list: [
          "Supabase – Datenbank, Kundenkonten und Dateispeicher des Shops.",
          "Stripe – Zahlungsabwicklung. Stripe erhält Ihre Zahlungsdaten direkt und bearbeitet sie gemäss eigener Datenschutzerklärung.",
          "MirrorSize – der 3D-Konfigurator, in dem Sie Massprodukte gestalten; Ihre Auswahl und Masse werden dort bearbeitet.",
          "Unsere Massschneiderei – erhält die für die Anfertigung nötige Spezifikation und Ihre Masse.",
          "Versanddienstleister wie die Schweizerische Post – erhalten Name und Lieferadresse.",
          "Unsere Hosting- und E-Mail-Anbieter.",
        ],
      },
      {
        heading: "5. Bekanntgabe ins Ausland",
        paragraphs: [
          "Einige dieser Anbieter bearbeiten Daten ausserhalb der Schweiz und des Europäischen Wirtschaftsraums, etwa in den USA oder in Indien. In diesen Fällen stützen wir uns auf die vom schweizerischen und europäischen Recht anerkannten Garantien, beispielsweise die EU-Standardvertragsklauseln oder das Swiss-US Data Privacy Framework.",
        ],
      },
      {
        heading: "6. Aufbewahrungsdauer",
        paragraphs: [
          "Kontodaten bewahren wir auf, bis Sie die Löschung Ihres Kontos verlangen. Bestell- und Buchhaltungsunterlagen werden gemäss Schweizer Recht zehn Jahre aufbewahrt. Massspezifikationen und Körpermasse speichern wir in Ihrem Konto, damit Sie nachbestellen können; Sie können deren Löschung jederzeit verlangen. Gespeicherte Warenkörbe bleiben bestehen, bis Sie die Bestellung abschliessen oder den Warenkorb leeren; inaktive Warenkörbe werden regelmässig gelöscht. Kontaktanfragen löschen wir, sobald sie erledigt sind und nicht mehr aufbewahrt werden müssen.",
        ],
      },
      {
        heading: "7. Cookies und lokaler Speicher",
        paragraphs: [
          "Wir verwenden nur Cookies und Browserspeicher, die für den Betrieb des Shops notwendig sind: um Sie angemeldet zu halten, Warenkorb und Sprache zu speichern und Zahlungen sicher abzuschliessen. Wir setzen keine Werbe- oder Tracking-Cookies und keine Analyse-Tools ein, die Besucherprofile erstellen.",
        ],
      },
      {
        heading: "8. Ihre Rechte",
        paragraphs: [
          "Im Rahmen des anwendbaren Rechts haben Sie das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten, auf Einschränkung der Bearbeitung und Widerspruch, auf Herausgabe in einem gängigen Format sowie auf Widerruf von Einwilligungen. Wenden Sie sich dafür an {email}. Sie können zudem beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) oder, mit Wohnsitz in der EU, bei Ihrer lokalen Datenschutzbehörde Beschwerde einreichen.",
        ],
      },
      {
        heading: "9. Datensicherheit",
        paragraphs: [
          "Wir schützen Ihre Daten mit angemessenen technischen und organisatorischen Massnahmen, unter anderem mit verschlüsselten Verbindungen (TLS), Zugriffskontrollen und eingeschränktem Administratorzugang.",
        ],
      },
      {
        heading: "10. Änderungen",
        paragraphs: [
          "Wir können diese Erklärung anpassen, wenn sich unsere Dienste oder die Rechtslage ändern. Es gilt die auf dieser Seite veröffentlichte Fassung.",
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    description: "Comment MUERA collecte, utilise et protège vos données personnelles.",
    updatedLabel: "Dernière mise à jour",
    intro:
      "La présente politique explique quelles données personnelles nous traitons lorsque vous visitez notre site, créez un compte, configurez un vêtement sur mesure ou passez commande, ainsi que les droits dont vous disposez. Nous traitons les données conformément à la loi fédérale suisse sur la protection des données (LPD) et, lorsqu’il s’applique, au Règlement général sur la protection des données de l’UE (RGPD).",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          "{company}, exploitant de la boutique en ligne MUERA, est responsable des traitements décrits ici.",
          "Adresse : {address}. E-mail : {email}. Merci d’utiliser cette adresse pour toute question relative à la protection des données.",
        ],
      },
      {
        heading: "2. Données traitées",
        list: [
          "Données de compte : nom, adresse e-mail, numéro de téléphone, langue préférée et adresses enregistrées. Les mots de passe sont conservés uniquement sous forme chiffrée (hachée) par notre fournisseur d’authentification.",
          "Données de commande : produits commandés, adresses de livraison et de facturation, remarques, statut du paiement et historique. Nous ne voyons ni ne conservons jamais vos données de carte complètes — le paiement est géré par Stripe.",
          "Données sur mesure : tissus, styles et détails choisis dans le configurateur 3D ainsi que les mensurations nécessaires à la confection de votre vêtement.",
          "Panier : le contenu de votre panier et, si vous la saisissez lors du paiement, votre adresse e-mail, afin de vous aider à finaliser une commande non terminée.",
          "Messages : ce que vous nous envoyez via le formulaire de contact ou par e-mail, ainsi que les avis que vous publiez.",
          "Données techniques : adresse IP, type de navigateur, date et heure d’accès et autres journaux enregistrés par nos serveurs pour la sécurité et le fonctionnement du site.",
        ],
      },
      {
        heading: "3. Finalités",
        list: [
          "Exécuter notre contrat avec vous : traitement et livraison des commandes, confection des vêtements sur mesure, retours et service client.",
          "Gérer votre compte client et vous permettre de consulter vos commandes et adresses.",
          "Sur la base de notre intérêt légitime : sécurité du site, prévention de la fraude, amélioration de notre offre et un rappel unique concernant les articles laissés dans votre panier. Vous pouvez vous opposer à ces rappels à tout moment.",
          "Respecter nos obligations légales, notamment la conservation des pièces comptables.",
          "Lorsque vous y avez consenti, pour la finalité convenue. Vous pouvez retirer votre consentement à tout moment pour l’avenir.",
        ],
      },
      {
        heading: "4. Destinataires",
        paragraphs: [
          "Nous ne transmettons des données personnelles que dans la mesure nécessaire, à des prestataires qui les traitent pour notre compte et sont liés par contrat :",
        ],
        list: [
          "Supabase — base de données, comptes utilisateurs et stockage de fichiers de la boutique.",
          "Stripe — traitement des paiements. Stripe reçoit directement vos données de paiement et les traite selon sa propre politique de confidentialité.",
          "MirrorSize — le configurateur 3D dans lequel vous concevez vos vêtements sur mesure ; vos choix et mensurations y sont traités.",
          "Notre atelier de confection — reçoit les spécifications et mensurations nécessaires à la fabrication.",
          "Les transporteurs, comme La Poste suisse — reçoivent votre nom et votre adresse de livraison.",
          "Nos prestataires d’hébergement et de messagerie.",
        ],
      },
      {
        heading: "5. Transferts à l’étranger",
        paragraphs: [
          "Certains de ces prestataires traitent des données hors de Suisse et de l’Espace économique européen, par exemple aux États-Unis ou en Inde. Nous nous appuyons alors sur les garanties reconnues par les droits suisse et européen, telles que les clauses contractuelles types de l’UE ou le Swiss-US Data Privacy Framework.",
        ],
      },
      {
        heading: "6. Durée de conservation",
        paragraphs: [
          "Les données de compte sont conservées jusqu’à ce que vous demandiez la suppression de votre compte. Les commandes et pièces comptables sont conservées dix ans, comme l’exige le droit suisse. Les spécifications sur mesure et mensurations sont conservées avec votre compte pour faciliter une nouvelle commande ; vous pouvez en demander la suppression à tout moment. Les paniers enregistrés sont conservés jusqu’à ce que vous finalisiez la commande ou vidiez le panier, et les paniers inactifs sont supprimés régulièrement. Les messages de contact sont supprimés une fois votre demande traitée et dès qu’ils n’ont plus à être conservés.",
        ],
      },
      {
        heading: "7. Cookies et stockage local",
        paragraphs: [
          "Nous utilisons uniquement les cookies et le stockage du navigateur nécessaires au fonctionnement de la boutique : maintenir votre connexion, mémoriser votre panier et votre langue, et finaliser le paiement en toute sécurité. Nous n’utilisons ni cookies publicitaires ou de suivi, ni outils d’analyse établissant des profils de visiteurs.",
        ],
      },
      {
        heading: "8. Vos droits",
        paragraphs: [
          "Dans les limites du droit applicable, vous avez le droit d’accéder à vos données, de les faire rectifier ou effacer, d’en limiter le traitement ou de vous y opposer, de les recevoir dans un format courant et de retirer votre consentement. Pour exercer ces droits, écrivez à {email}. Vous pouvez également déposer une plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT) ou, si vous résidez dans l’UE, auprès de votre autorité de protection des données.",
        ],
      },
      {
        heading: "9. Sécurité",
        paragraphs: [
          "Nous protégeons vos données par des mesures techniques et organisationnelles appropriées, notamment des connexions chiffrées (TLS), des contrôles d’accès et un accès administrateur restreint.",
        ],
      },
      {
        heading: "10. Modifications",
        paragraphs: [
          "Nous pouvons adapter la présente politique si nos services ou la législation évoluent. La version publiée sur cette page fait foi.",
        ],
      },
    ],
  },
  it: {
    title: "Informativa sulla privacy",
    description: "Come MUERA raccoglie, utilizza e protegge i tuoi dati personali.",
    updatedLabel: "Ultimo aggiornamento",
    intro:
      "La presente informativa spiega quali dati personali trattiamo quando visiti il nostro sito, crei un account, configuri un capo su misura o effettui un ordine, e quali diritti hai. Trattiamo i dati in conformità alla Legge federale svizzera sulla protezione dei dati (LPD) e, ove applicabile, al Regolamento generale sulla protezione dei dati dell’UE (GDPR).",
    sections: [
      {
        heading: "1. Titolare del trattamento",
        paragraphs: [
          "{company}, gestore del negozio online MUERA, è responsabile dei trattamenti qui descritti.",
          "Indirizzo: {address}. E-mail: {email}. Per qualsiasi domanda sulla protezione dei dati ti preghiamo di utilizzare questo indirizzo.",
        ],
      },
      {
        heading: "2. Dati trattati",
        list: [
          "Dati dell’account: nome, indirizzo e-mail, numero di telefono, lingua preferita e indirizzi salvati. Le password sono conservate esclusivamente in forma cifrata (hash) dal nostro fornitore di autenticazione.",
          "Dati dell’ordine: prodotti ordinati, indirizzi di consegna e di fatturazione, note, stato del pagamento e cronologia degli ordini. Non vediamo né conserviamo mai i dati completi della tua carta: il pagamento è gestito da Stripe.",
          "Dati su misura: tessuti, stili e dettagli scelti nel configuratore 3D e le misure corporee necessarie per realizzare il tuo capo.",
          "Carrello: il contenuto del carrello e, se lo inserisci al checkout, il tuo indirizzo e-mail, per aiutarti a completare un ordine non concluso.",
          "Messaggi: ciò che ci invii tramite il modulo di contatto o via e-mail e le recensioni che pubblichi.",
          "Dati tecnici: indirizzo IP, tipo di browser, data e ora di accesso e altri dati di log registrati dai nostri server per la sicurezza e il funzionamento del sito.",
        ],
      },
      {
        heading: "3. Finalità",
        list: [
          "Eseguire il contratto con te: gestione e consegna degli ordini, confezione dei capi su misura, resi e assistenza clienti.",
          "Gestire il tuo account cliente e permetterti di consultare ordini e indirizzi salvati.",
          "Sulla base del nostro legittimo interesse: sicurezza del sito, prevenzione delle frodi, miglioramento dell’offerta e un unico promemoria per gli articoli lasciati nel carrello. Puoi opporti ai promemoria in qualsiasi momento.",
          "Adempiere agli obblighi di legge, in particolare la conservazione dei documenti contabili.",
          "Se hai dato il tuo consenso, per la finalità concordata. Puoi revocarlo in qualsiasi momento con effetto per il futuro.",
        ],
      },
      {
        heading: "4. Destinatari",
        paragraphs: [
          "Comunichiamo dati personali solo nella misura necessaria a fornitori che li trattano per nostro conto e sono vincolati contrattualmente:",
        ],
        list: [
          "Supabase — database, account utente e archiviazione file del negozio.",
          "Stripe — elaborazione dei pagamenti. Stripe riceve direttamente i tuoi dati di pagamento e li tratta secondo la propria informativa.",
          "MirrorSize — il configuratore 3D in cui progetti i capi su misura; le tue scelte e misure vengono trattate lì.",
          "La nostra sartoria — riceve le specifiche e le misure necessarie alla confezione.",
          "Corrieri come La Posta Svizzera — ricevono il tuo nome e l’indirizzo di consegna.",
          "I nostri fornitori di hosting e di posta elettronica.",
        ],
      },
      {
        heading: "5. Trasferimenti all’estero",
        paragraphs: [
          "Alcuni di questi fornitori trattano dati al di fuori della Svizzera e dello Spazio economico europeo, ad esempio negli Stati Uniti o in India. In tali casi ci basiamo sulle garanzie riconosciute dal diritto svizzero ed europeo, come le clausole contrattuali tipo dell’UE o lo Swiss-US Data Privacy Framework.",
        ],
      },
      {
        heading: "6. Durata della conservazione",
        paragraphs: [
          "I dati dell’account sono conservati finché non chiedi la cancellazione dell’account. Ordini e documenti contabili sono conservati per dieci anni come previsto dal diritto svizzero. Le specifiche su misura e le misure corporee sono conservate nel tuo account per permetterti di riordinare; puoi chiederne la cancellazione in qualsiasi momento. I carrelli salvati restano finché completi l’ordine o svuoti il carrello; i carrelli inattivi vengono eliminati regolarmente. I messaggi di contatto vengono eliminati una volta evasa la richiesta e quando non devono più essere conservati.",
        ],
      },
      {
        heading: "7. Cookie e memoria locale",
        paragraphs: [
          "Utilizziamo solo i cookie e la memoria del browser necessari al funzionamento del negozio: mantenere l’accesso, ricordare carrello e lingua e completare il pagamento in modo sicuro. Non utilizziamo cookie pubblicitari o di tracciamento né strumenti di analisi che profilano i visitatori.",
        ],
      },
      {
        heading: "8. I tuoi diritti",
        paragraphs: [
          "Nei limiti del diritto applicabile hai il diritto di accedere ai tuoi dati, di farli rettificare o cancellare, di limitarne il trattamento o di opporti, di riceverli in un formato di uso comune e di revocare il consenso. Per esercitarli scrivi a {email}. Puoi inoltre presentare reclamo all’Incaricato federale della protezione dei dati e della trasparenza (IFPDT) o, se risiedi nell’UE, alla tua autorità di controllo.",
        ],
      },
      {
        heading: "9. Sicurezza",
        paragraphs: [
          "Proteggiamo i tuoi dati con adeguate misure tecniche e organizzative, tra cui connessioni cifrate (TLS), controlli degli accessi e accesso amministrativo limitato.",
        ],
      },
      {
        heading: "10. Modifiche",
        paragraphs: [
          "Possiamo aggiornare la presente informativa se cambiano i nostri servizi o la normativa. Fa fede la versione pubblicata su questa pagina.",
        ],
      },
    ],
  },
};

const terms: Record<string, LegalContent> = {
  en: {
    title: "Terms and Conditions",
    description: "The terms that apply to orders placed in the MUERA online shop.",
    updatedLabel: "Last updated",
    intro:
      "These terms and conditions apply to all orders placed through the MUERA online shop, operated by {company}. By placing an order you accept them in the version valid at the time of your order.",
    sections: [
      {
        heading: "1. Contract",
        paragraphs: [
          "The products shown in the shop are an invitation to order, not a binding offer. By completing checkout you make a binding offer to buy. The contract is concluded when we confirm your order and your payment has been received.",
          "Made-to-measure garments are produced according to the configuration you create in the 3D configurator and the measurements you provide. Please check them carefully before ordering.",
        ],
      },
      {
        heading: "2. Prices and payment",
        list: [
          "Prices are in Swiss francs (CHF) and include Swiss VAT where applicable. Shipping costs are shown in your cart and at checkout before you order.",
          "Made-to-measure prices are calculated from the garment and the options you select in the 3D configurator; the price shown at checkout applies.",
          "Payment is made online through our payment provider Stripe, or — for orders arranged with us directly — by bank transfer or another agreed method. Production and dispatch start once payment has been received.",
          "Discount codes cannot be exchanged for cash, combined unless stated, or applied to orders already placed.",
        ],
      },
      {
        heading: "3. Delivery",
        paragraphs: [
          "We deliver to the addresses accepted at checkout. Delivery times shown on product pages are estimates; made-to-measure garments are tailored to order and take longer than ready-to-wear items. We will keep you informed if a delay occurs. Risk passes to you when the goods are delivered.",
        ],
      },
      {
        heading: "4. Returns",
        list: [
          "Ready-to-wear items may be returned within 14 days of delivery if they are unworn, unaltered and in their original packaging. Please contact us at {email} before sending a return. Return shipping costs are borne by you unless the item is faulty or we sent the wrong item.",
          "We refund the purchase price to the original payment method within 14 days of receiving and checking the return.",
          "Made-to-measure garments are made individually to your specification and are therefore excluded from returns. If a made-to-measure garment does not correspond to your configuration or measurements, contact us within 14 days of delivery and we will arrange alterations or a remake, at our discretion.",
        ],
      },
      {
        heading: "5. Warranty",
        paragraphs: [
          "Statutory warranty under the Swiss Code of Obligations applies. Please inspect the goods on delivery and report any defect promptly, at the latest within 30 days of discovering it. We will repair or replace the item or, if that is not possible, refund it. Normal wear and tear, improper care and alterations made by third parties are not covered.",
        ],
      },
      {
        heading: "6. Liability",
        paragraphs: [
          "We are liable for damage caused intentionally or through gross negligence. To the extent permitted by law, any further liability — in particular for indirect or consequential damage — is excluded. Mandatory liability, for example under the Product Liability Act, remains unaffected.",
        ],
      },
      {
        heading: "7. Customer account",
        paragraphs: [
          "You are responsible for keeping your login details confidential and for the accuracy of the data you provide. We may close accounts that are misused.",
        ],
      },
      {
        heading: "8. Data protection",
        paragraphs: ["We process your personal data as described in our Privacy Policy."],
      },
      {
        heading: "9. Applicable law and jurisdiction",
        paragraphs: [
          "These terms are governed by Swiss law, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). The place of jurisdiction is the registered office of {company}, subject to mandatory jurisdictions for consumers.",
        ],
      },
      {
        heading: "10. Contact",
        paragraphs: ["{company}, {address}. Email: {email}."],
      },
    ],
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen",
    description: "Die Bedingungen für Bestellungen im Online-Shop von MUERA.",
    updatedLabel: "Stand",
    intro:
      "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen im Online-Shop MUERA, betrieben von {company}. Mit Ihrer Bestellung akzeptieren Sie die AGB in der zum Bestellzeitpunkt gültigen Fassung.",
    sections: [
      {
        heading: "1. Vertragsabschluss",
        paragraphs: [
          "Die Darstellung der Produkte im Shop ist kein verbindliches Angebot, sondern eine Einladung zur Bestellung. Mit Abschluss des Checkouts geben Sie ein verbindliches Kaufangebot ab. Der Vertrag kommt zustande, sobald wir Ihre Bestellung bestätigen und Ihre Zahlung eingegangen ist.",
          "Massprodukte werden nach der von Ihnen im 3D-Konfigurator erstellten Konfiguration und den von Ihnen angegebenen Massen gefertigt. Bitte prüfen Sie diese vor der Bestellung sorgfältig.",
        ],
      },
      {
        heading: "2. Preise und Zahlung",
        list: [
          "Die Preise verstehen sich in Schweizer Franken (CHF) inklusive gegebenenfalls anfallender Mehrwertsteuer. Versandkosten werden im Warenkorb und im Checkout vor der Bestellung angezeigt.",
          "Der Preis von Massprodukten ergibt sich aus dem Kleidungsstück und den im 3D-Konfigurator gewählten Optionen; massgebend ist der im Checkout angezeigte Preis.",
          "Die Zahlung erfolgt online über unseren Zahlungsdienstleister Stripe oder – bei direkt mit uns vereinbarten Bestellungen – per Banküberweisung oder auf eine andere vereinbarte Weise. Anfertigung und Versand beginnen nach Zahlungseingang.",
          "Rabattcodes können nicht bar ausbezahlt, nicht kombiniert (sofern nicht anders angegeben) und nicht nachträglich auf bereits aufgegebene Bestellungen angewendet werden.",
        ],
      },
      {
        heading: "3. Lieferung",
        paragraphs: [
          "Wir liefern an die im Checkout akzeptierten Adressen. Die auf den Produktseiten angegebenen Lieferzeiten sind Richtwerte; Massprodukte werden auf Bestellung gefertigt und benötigen mehr Zeit als Konfektionsware. Über Verzögerungen informieren wir Sie. Die Gefahr geht mit der Lieferung auf Sie über.",
        ],
      },
      {
        heading: "4. Rückgabe",
        list: [
          "Konfektionsware kann innerhalb von 14 Tagen nach Lieferung zurückgegeben werden, sofern sie ungetragen, unverändert und in der Originalverpackung ist. Bitte kontaktieren Sie uns vor der Rücksendung unter {email}. Die Kosten der Rücksendung tragen Sie, ausser der Artikel ist mangelhaft oder wir haben einen falschen Artikel geliefert.",
          "Den Kaufpreis erstatten wir innerhalb von 14 Tagen nach Eingang und Prüfung der Rücksendung über das ursprüngliche Zahlungsmittel.",
          "Massprodukte werden individuell nach Ihren Angaben gefertigt und sind daher von der Rückgabe ausgeschlossen. Entspricht ein Massprodukt nicht Ihrer Konfiguration oder Ihren Massen, melden Sie sich innerhalb von 14 Tagen nach Lieferung; wir veranlassen nach unserer Wahl eine Änderung oder Neuanfertigung.",
        ],
      },
      {
        heading: "5. Gewährleistung",
        paragraphs: [
          "Es gilt die gesetzliche Gewährleistung nach dem Schweizerischen Obligationenrecht. Bitte prüfen Sie die Ware bei Erhalt und melden Sie Mängel umgehend, spätestens innerhalb von 30 Tagen nach Entdeckung. Wir reparieren oder ersetzen den Artikel oder erstatten, falls dies nicht möglich ist, den Kaufpreis. Normale Abnutzung, unsachgemässe Pflege und Änderungen durch Dritte sind ausgeschlossen.",
        ],
      },
      {
        heading: "6. Haftung",
        paragraphs: [
          "Wir haften für vorsätzlich oder grobfahrlässig verursachte Schäden. Soweit gesetzlich zulässig, ist jede weitere Haftung – insbesondere für indirekte Schäden und Folgeschäden – ausgeschlossen. Zwingende Haftungsbestimmungen, etwa nach dem Produktehaftpflichtgesetz, bleiben vorbehalten.",
        ],
      },
      {
        heading: "7. Kundenkonto",
        paragraphs: [
          "Sie sind für die Geheimhaltung Ihrer Zugangsdaten und die Richtigkeit Ihrer Angaben verantwortlich. Missbräuchlich verwendete Konten können wir schliessen.",
        ],
      },
      {
        heading: "8. Datenschutz",
        paragraphs: ["Wir bearbeiten Ihre Personendaten gemäss unserer Datenschutzerklärung."],
      },
      {
        heading: "9. Anwendbares Recht und Gerichtsstand",
        paragraphs: [
          "Es gilt Schweizer Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand ist der Sitz von {company}; zwingende Gerichtsstände für Konsumentinnen und Konsumenten bleiben vorbehalten.",
        ],
      },
      {
        heading: "10. Kontakt",
        paragraphs: ["{company}, {address}. E-Mail: {email}."],
      },
    ],
  },
  fr: {
    title: "Conditions générales de vente",
    description: "Les conditions applicables aux commandes passées sur la boutique en ligne MUERA.",
    updatedLabel: "Dernière mise à jour",
    intro:
      "Les présentes conditions générales de vente (CGV) s’appliquent à toutes les commandes passées sur la boutique en ligne MUERA, exploitée par {company}. En passant commande, vous les acceptez dans leur version en vigueur au moment de la commande.",
    sections: [
      {
        heading: "1. Conclusion du contrat",
        paragraphs: [
          "La présentation des produits dans la boutique ne constitue pas une offre ferme, mais une invitation à commander. En finalisant le paiement, vous faites une offre d’achat ferme. Le contrat est conclu dès que nous confirmons votre commande et que votre paiement a été reçu.",
          "Les vêtements sur mesure sont confectionnés selon la configuration créée dans le configurateur 3D et les mensurations que vous fournissez. Veuillez les vérifier attentivement avant de commander.",
        ],
      },
      {
        heading: "2. Prix et paiement",
        list: [
          "Les prix sont indiqués en francs suisses (CHF), TVA suisse comprise le cas échéant. Les frais de port sont affichés dans le panier et lors du paiement, avant la commande.",
          "Le prix des vêtements sur mesure dépend du modèle et des options choisies dans le configurateur 3D ; le prix affiché lors du paiement fait foi.",
          "Le paiement s’effectue en ligne via notre prestataire Stripe ou, pour les commandes convenues directement avec nous, par virement bancaire ou selon un autre mode convenu. La confection et l’expédition commencent après réception du paiement.",
          "Les codes de réduction ne sont ni échangeables contre des espèces, ni cumulables sauf indication contraire, ni applicables à des commandes déjà passées.",
        ],
      },
      {
        heading: "3. Livraison",
        paragraphs: [
          "Nous livrons aux adresses acceptées lors du paiement. Les délais indiqués sur les fiches produits sont indicatifs ; les vêtements sur mesure sont confectionnés à la commande et demandent plus de temps que le prêt-à-porter. Nous vous informons en cas de retard. Les risques vous sont transférés à la livraison.",
        ],
      },
      {
        heading: "4. Retours",
        list: [
          "Les articles de prêt-à-porter peuvent être retournés dans les 14 jours suivant la livraison s’ils n’ont pas été portés ni modifiés et sont dans leur emballage d’origine. Merci de nous contacter à {email} avant tout retour. Les frais de retour sont à votre charge, sauf si l’article est défectueux ou si nous avons livré un mauvais article.",
          "Nous remboursons le prix d’achat sur le moyen de paiement d’origine dans les 14 jours suivant la réception et le contrôle du retour.",
          "Les vêtements sur mesure étant confectionnés individuellement selon vos indications, ils sont exclus du droit de retour. Si un vêtement sur mesure ne correspond pas à votre configuration ou à vos mensurations, contactez-nous dans les 14 jours suivant la livraison : nous organiserons, à notre choix, une retouche ou une nouvelle confection.",
        ],
      },
      {
        heading: "5. Garantie",
        paragraphs: [
          "La garantie légale prévue par le Code suisse des obligations s’applique. Veuillez vérifier la marchandise à réception et signaler tout défaut sans délai, au plus tard dans les 30 jours suivant sa découverte. Nous réparons ou remplaçons l’article ou, si cela n’est pas possible, le remboursons. L’usure normale, un entretien inapproprié et les modifications effectuées par des tiers sont exclus.",
        ],
      },
      {
        heading: "6. Responsabilité",
        paragraphs: [
          "Nous répondons des dommages causés intentionnellement ou par négligence grave. Dans la mesure permise par la loi, toute autre responsabilité — notamment pour les dommages indirects ou consécutifs — est exclue. Les dispositions impératives, par exemple la loi sur la responsabilité du fait des produits, sont réservées.",
        ],
      },
      {
        heading: "7. Compte client",
        paragraphs: [
          "Vous êtes responsable de la confidentialité de vos identifiants et de l’exactitude des données fournies. Nous pouvons fermer les comptes utilisés de manière abusive.",
        ],
      },
      {
        heading: "8. Protection des données",
        paragraphs: ["Nous traitons vos données personnelles conformément à notre politique de confidentialité."],
      },
      {
        heading: "9. Droit applicable et for",
        paragraphs: [
          "Les présentes CGV sont régies par le droit suisse, à l’exclusion de la Convention de Vienne (CVIM). Le for est au siège de {company}, sous réserve des fors impératifs prévus pour les consommateurs.",
        ],
      },
      {
        heading: "10. Contact",
        paragraphs: ["{company}, {address}. E-mail : {email}."],
      },
    ],
  },
  it: {
    title: "Condizioni generali di vendita",
    description: "Le condizioni applicabili agli ordini effettuati nel negozio online MUERA.",
    updatedLabel: "Ultimo aggiornamento",
    intro:
      "Le presenti condizioni generali di vendita (CGV) si applicano a tutti gli ordini effettuati nel negozio online MUERA, gestito da {company}. Effettuando un ordine accetti le CGV nella versione valida al momento dell’ordine.",
    sections: [
      {
        heading: "1. Conclusione del contratto",
        paragraphs: [
          "La presentazione dei prodotti nel negozio non costituisce un’offerta vincolante, ma un invito a ordinare. Completando il checkout fai un’offerta d’acquisto vincolante. Il contratto è concluso quando confermiamo l’ordine e abbiamo ricevuto il pagamento.",
          "I capi su misura sono realizzati secondo la configurazione creata nel configuratore 3D e le misure da te indicate. Ti preghiamo di verificarle attentamente prima di ordinare.",
        ],
      },
      {
        heading: "2. Prezzi e pagamento",
        list: [
          "I prezzi sono espressi in franchi svizzeri (CHF) e includono l’IVA svizzera ove applicabile. Le spese di spedizione sono indicate nel carrello e al checkout prima dell’ordine.",
          "Il prezzo dei capi su misura dipende dal modello e dalle opzioni scelte nel configuratore 3D; fa fede il prezzo indicato al checkout.",
          "Il pagamento avviene online tramite il nostro fornitore Stripe oppure, per ordini concordati direttamente con noi, tramite bonifico bancario o altra modalità concordata. La confezione e la spedizione iniziano dopo la ricezione del pagamento.",
          "I codici sconto non sono convertibili in denaro, non sono cumulabili salvo diversa indicazione e non si applicano a ordini già effettuati.",
        ],
      },
      {
        heading: "3. Consegna",
        paragraphs: [
          "Consegniamo agli indirizzi accettati al checkout. I tempi di consegna indicati nelle pagine dei prodotti sono indicativi; i capi su misura sono realizzati su ordinazione e richiedono più tempo rispetto al prêt-à-porter. Ti informeremo in caso di ritardi. Il rischio passa a te con la consegna.",
        ],
      },
      {
        heading: "4. Resi",
        list: [
          "Gli articoli prêt-à-porter possono essere resi entro 14 giorni dalla consegna se non indossati, non modificati e nella confezione originale. Contattaci a {email} prima di effettuare un reso. Le spese di reso sono a tuo carico, salvo che l’articolo sia difettoso o che ti abbiamo inviato un articolo sbagliato.",
          "Rimborsiamo il prezzo d’acquisto sul mezzo di pagamento originale entro 14 giorni dalla ricezione e verifica del reso.",
          "I capi su misura sono realizzati individualmente secondo le tue indicazioni e sono quindi esclusi dal reso. Se un capo su misura non corrisponde alla tua configurazione o alle tue misure, contattaci entro 14 giorni dalla consegna: provvederemo, a nostra scelta, a una modifica o a una nuova confezione.",
        ],
      },
      {
        heading: "5. Garanzia",
        paragraphs: [
          "Si applica la garanzia legale prevista dal Codice svizzero delle obbligazioni. Controlla la merce al ricevimento e segnala eventuali difetti tempestivamente, al più tardi entro 30 giorni dalla scoperta. Ripariamo o sostituiamo l’articolo oppure, se non è possibile, lo rimborsiamo. Sono esclusi la normale usura, la cura inadeguata e le modifiche eseguite da terzi.",
        ],
      },
      {
        heading: "6. Responsabilità",
        paragraphs: [
          "Rispondiamo dei danni causati intenzionalmente o per negligenza grave. Nella misura consentita dalla legge è esclusa ogni ulteriore responsabilità, in particolare per danni indiretti o conseguenti. Restano salve le disposizioni imperative, ad esempio la legge sulla responsabilità per danno da prodotti.",
        ],
      },
      {
        heading: "7. Account cliente",
        paragraphs: [
          "Sei responsabile della riservatezza delle tue credenziali e della correttezza dei dati forniti. Possiamo chiudere gli account utilizzati in modo abusivo.",
        ],
      },
      {
        heading: "8. Protezione dei dati",
        paragraphs: ["Trattiamo i tuoi dati personali secondo la nostra informativa sulla privacy."],
      },
      {
        heading: "9. Diritto applicabile e foro competente",
        paragraphs: [
          "Le presenti CGV sono disciplinate dal diritto svizzero, con esclusione della Convenzione di Vienna (CISG). Il foro competente è la sede di {company}, fatti salvi i fori imperativi previsti per i consumatori.",
        ],
      },
      {
        heading: "10. Contatto",
        paragraphs: ["{company}, {address}. E-mail: {email}."],
      },
    ],
  },
};

const DOCS: Record<LegalDoc, Record<string, LegalContent>> = { privacy, terms };

export function getLegalContent(doc: LegalDoc, locale: string): LegalContent {
  return DOCS[doc][locale] ?? DOCS[doc].de;
}
