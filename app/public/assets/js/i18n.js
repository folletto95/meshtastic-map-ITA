(function () {
        const LANGUAGE_STORAGE_KEY = "ui_language";
        const DEFAULT_LANGUAGE = "it";

        const LANGUAGE_OPTIONS = [
                { code: "it", label: { it: "Italiano", en: "Italian" } },
                { code: "en", label: { it: "Inglese", en: "English" } },
        ];

        const META_TRANSLATIONS = {
                title: {
                        it: "Mappa Meshtastic",
                        en: "Meshtastic Map",
                },
                description: {
                        it: "Una mappa interattiva dei nodi Meshtastic visibili sul server MQTT.",
                        en: "An interactive map of all Meshtastic nodes.",
                },
        };

        const TEXT_TRANSLATIONS = {
                "Meshtastic Map": { it: "Mappa Meshtastic" },
                "Service Announcement": { it: "Avviso di servizio" },
                "Changes were made to mqtt.meshnet.si. Uplink your nodes to": {
                        it: "Sono state apportate modifiche a mqtt.meshnet.si. Collega i tuoi nodi a",
                },
                "our MQTT server": { it: "il nostro server MQTT" },
                "to continue showing on this map.": {
                        it: "per continuare a visualizzarli su questa mappa.",
                },
                "Created by": { it: "Creato da" },
                "Liam Cottle": { it: "Liam Cottle" },
                "Forked by": { it: "Fork di" },
                "Tilen Komel": { it: "Tilen Komel" },
                "Only the first 500 results are shown.": {
                        it: "Sono mostrati solo i primi 500 risultati.",
                },
                "No results found...": { it: "Nessun risultato trovato..." },
                "Search {count} nodes...": { it: "Cerca tra {count} nodi..." },
                "About": { it: "Informazioni" },
                "Search": { it: "Cerca" },
                "Devices": { it: "Dispositivi" },
                "Random": { it: "Casuale" },
                "Settings": { it: "Impostazioni" },
                "Reload": { it: "Ricarica" },
                "👋 Welcome to my open source map of Meshtastic nodes heard on the mqtt.meshnet.si MQTT server.": {
                        it: "👋 Benvenuto nella mia mappa open source dei nodi Meshtastic rilevati sul server MQTT mqtt.meshnet.si.",
                },
                "Features": { it: "Funzionalità" },
                "The map shows nodes that have sent a valid position to MQTT.": {
                        it: "La mappa mostra i nodi che hanno inviato una posizione valida a MQTT.",
                },
                "Position packets must be unencrypted, or encrypted with the default key.": {
                        it: "I pacchetti di posizione devono essere non crittografati oppure crittografati con la chiave predefinita.",
                },
                "Use the search bar to find nodes by ID or name.": {
                        it: "Usa la barra di ricerca per trovare i nodi per ID o nome.",
                },
                "Hover over nodes (on desktop) to see basic details.": {
                        it: "Passa il mouse sui nodi (su desktop) per vedere i dettagli di base.",
                },
                "Click a node to see info such as telemetry graphs and traceroutes.": {
                        it: "Fai clic su un nodo per vedere informazioni come grafici di telemetria e traceroute.",
                },
                "Use the top right layers panel to show neighbours and waypoints.": {
                        it: "Usa il pannello dei livelli in alto a destra per mostrare vicini e waypoint.",
                },
                "Use the settings button to configure the map to your liking.": {
                        it: "Usa il pulsante Impostazioni per configurare la mappa secondo le tue preferenze.",
                },
                "Have a feature request, or found a bug?": {
                        it: "Hai una richiesta di funzionalità o hai trovato un bug?",
                },
                "Open an issue": { it: "Apri una segnalazione" },
                "on GitHub.": { it: "su GitHub." },
                "FAQ": { it: "FAQ" },
                "How do I add my node to the map?": {
                        it: "Come aggiungo il mio nodo alla mappa?",
                },
                "Your node, or a node that hears your node must uplink to our MQTT server.": {
                        it: "Il tuo nodo, o un nodo che lo riceve, deve effettuare l'uplink al nostro server MQTT.",
                },
                "Use the MQTT server details below to uplink to this map.": {
                        it: "Utilizza i dettagli del server MQTT qui sotto per collegarti a questa mappa.",
                },
                "If your node has v2.5 firmware or newer, you must enable \"OK to MQTT\".": {
                        it: "Se il tuo nodo ha il firmware v2.5 o successivo, devi abilitare \"OK to MQTT\".",
                },
                "What MQTT server should I use?": {
                        it: "Quale server MQTT devo utilizzare?",
                },
                "Address: mqtt.meshnet.si": { it: "Indirizzo: mqtt.meshnet.si" },
                "Username: slovenia": { it: "Nome utente: slovenia" },
                "Password: meshnet-si-slovenia": { it: "Password: meshnet-si-slovenia" },
                "Topic: si/meshnet/slovenia": { it: "Topic: si/meshnet/slovenia" },
                "TLS Enabled: No / Yes": { it: "TLS abilitato: No / Sì" },
                "How do I remove my node from the map?": {
                        it: "Come rimuovo il mio nodo dalla mappa?",
                },
                "Nodes that have not been heard for 7 days are automatically removed.": {
                        it: "I nodi che non vengono ascoltati per 7 giorni vengono rimossi automaticamente.",
                },
                "To have your node removed now, please": {
                        it: "Per rimuovere subito il tuo nodo",
                },
                "contact me": { it: "contattami" },
                "Disable position reporting in your node to prevent it coming back.": {
                        it: "Disattiva l'invio della posizione nel tuo nodo per evitare che ricompaia.",
                },
                "Use custom encryption keys so the public can't see your position data.": {
                        it: "Utilizza chiavi di crittografia personalizzate in modo che il pubblico non possa vedere i tuoi dati di posizione.",
                },
                "How do I see neighbours a node heard?": {
                        it: "Come posso vedere i vicini ascoltati da un nodo?",
                },
                "Open the top right layers panel and enable neighbours.": {
                        it: "Apri il pannello dei livelli in alto a destra e abilita i vicini.",
                },
                "Some neighbours are from MQTT, this is patched in latest firmware.": {
                        it: "Alcuni vicini provengono da MQTT, questo è stato corretto nelle ultime versioni del firmware.",
                },
                "Legal": { it: "Note legali" },
                "This project is not affiliated with or endorsed by the": {
                        it: "Questo progetto non è affiliato né approvato dal",
                },
                "Meshtastic": { it: "Meshtastic" },
                "project.": { it: "progetto." },
                "The Meshtastic logo is the trademark of Meshtastic LLC.": {
                        it: "Il logo Meshtastic è un marchio registrato di Meshtastic LLC.",
                },
                "Map tiles provided by": { it: "Tile della mappa fornite da" },
                "OpenStreetMap": { it: "OpenStreetMap" },
                "Dismiss": { it: "Chiudi" },
                "Meshtastic Devices": { it: "Dispositivi Meshtastic" },
                "Ordered by most popular": { it: "Ordinati per popolarità" },
                "Node Info": { it: "Informazioni sul nodo" },
                "This node has not reported a position.": {
                        it: "Questo nodo non ha riportato alcuna posizione.",
                },
                "Sent Msgs": { it: "Messaggi inviati" },
                "Received Msgs": { it: "Messaggi ricevuti" },
                "Gated Msgs": { it: "Messaggi inoltrati" },
                "Details": { it: "Dettagli" },
                "ID": { it: "ID" },
                "Hex ID": { it: "ID esadecimale" },
                "Hex ID:": { it: "ID esadecimale:" },
                "Role": { it: "Ruolo" },
                "Hardware": { it: "Hardware" },
                "Firmware": { it: "Firmware" },
                "LoRa Config": { it: "Configurazione LoRa" },
                "Region": { it: "Regione" },
                "Modem Preset": { it: "Preset modem" },
                "Has Default Channel": { it: "Ha il canale predefinito" },
                "Position": { it: "Posizione" },
                "Show History": { it: "Mostra storico" },
                "Latitude, Longitude": { it: "Latitudine, Longitudine" },
                "Lat/Long": { it: "Lat/Lon" },
                "Altitude": { it: "Altitudine" },
                "Device Metrics": { it: "Metriche del dispositivo" },
                "1 Day": { it: "1 giorno" },
                "3 Days": { it: "3 giorni" },
                "7 Days": { it: "7 giorni" },
                "Battery Level": { it: "Livello batteria" },
                "Channel Utilization": { it: "Utilizzo del canale" },
                "Air Util TX": { it: "Utilizzo TX aria" },
                "Plugged In": { it: "Collegato all'alimentazione" },
                "Voltage": { it: "Voltaggio" },
                "Air Util Tx": { it: "Utilizzo TX aria" },
                "Uptime": { it: "Tempo di attività" },
                "Environment Metrics": { it: "Metriche ambientali" },
                "Temperature": { it: "Temperatura" },
                "Humidity": { it: "Umidità" },
                "Pressure": { it: "Pressione" },
                "Relative Humidity": { it: "Umidità relativa" },
                "Barometric Pressure": { it: "Pressione barometrica" },
                "Power Metrics": { it: "Metriche di alimentazione" },
                "Channel 1": { it: "Canale 1" },
                "Channel 2": { it: "Canale 2" },
                "Channel 3": { it: "Canale 3" },
                "MQTT": { it: "MQTT" },
                "Topics this node sent packets to": { it: "Topic a cui questo nodo ha inviato pacchetti" },
                "No packets seen on MQTT": { it: "Nessun pacchetto visto su MQTT" },
                "Trace Routes": { it: "Traceroute" },
                "Only 5 most recent are shown": { it: "Sono mostrati solo gli ultimi 5" },
                "to": { it: "a" },
                "No traceroutes seen on MQTT": { it: "Nessun traceroute visto su MQTT" },
                "Other": { it: "Altro" },
                "First Seen": { it: "Prima rilevazione" },
                "Last Seen": { it: "Ultima rilevazione" },
                "Neighbours Updated": { it: "Vicini aggiornati" },
                "Position Updated": { it: "Posizione aggiornata" },
                "Share Link": { it: "Condividi link" },
                "Copy": { it: "Copia" },
                "Short Name:": { it: "Nome breve:" },
                "MQTT:": { it: "MQTT:" },
                "Connected": { it: "Connesso" },
                "Disconnected": { it: "Disconnesso" },
                "Local Nodes Online:": { it: "Nodi locali online:" },
                "Position Precision:": { it: "Precisione della posizione:" },
                "Role:": { it: "Ruolo:" },
                "Hardware:": { it: "Hardware:" },
                "Firmware:": { it: "Firmware:" },
                "LoRa Region:": { it: "Regione LoRa:" },
                "Modem Preset:": { it: "Preset modem:" },
                "Has Default Channel:": { it: "Ha il canale predefinito:" },
                "Battery:": { it: "Batteria:" },
                "Voltage:": { it: "Voltaggio:" },
                "Ch Util:": { it: "Utilizzo canale:" },
                "Air Util:": { it: "Utilizzo aria:" },
                "Altitude:": { it: "Altitudine:" },
                "Started the traceroute": { it: "Ha avviato il traceroute" },
                "Forwarded the packet": { it: "Ha inoltrato il pacchetto" },
                "Replied to traceroute": { it: "Ha risposto al traceroute" },
                "Gated the packet to MQTT": { it: "Ha inoltrato il pacchetto su MQTT" },
                "Raw Data": { it: "Dati grezzi" },
                "Changes are only saved in this browser.": {
                        it: "Le modifiche vengono salvate solo in questo browser.",
                },
                "Nodes Max Age": { it: "Anzianità massima dei nodi" },
                "Nodes not updated within this time are hidden. Reload to update map.": {
                        it: "I nodi non aggiornati entro questo intervallo vengono nascosti. Ricarica per aggiornare la mappa.",
                },
                "Show All": { it: "Mostra tutto" },
                "15 minutes": { it: "15 minuti" },
                "30 minutes": { it: "30 minuti" },
                "1 hour": { it: "1 ora" },
                "3 hours": { it: "3 ore" },
                "6 hours": { it: "6 ore" },
                "12 hours": { it: "12 ore" },
                "24 hours": { it: "24 ore" },
                "2 days": { it: "2 giorni" },
                "3 days": { it: "3 giorni" },
                "4 days": { it: "4 giorni" },
                "5 days": { it: "5 giorni" },
                "6 days": { it: "6 giorni" },
                "7 days": { it: "7 giorni" },
                "Nodes Disconnected Age": { it: "Tempo disconnessione nodi" },
                "Nodes that have not uplinked to MQTT in this time will show as blue icons. Reload to update map.": {
                        it: "I nodi che non hanno effettuato uplink a MQTT in questo intervallo vengono mostrati con icone blu. Ricarica per aggiornare la mappa.",
                },
                "45 minutes": { it: "45 minuti" },
                "2 hours": { it: "2 ore" },
                "Nodes Offline Age": { it: "Tempo offline nodi" },
                "Nodes not updated within this time will show as red icons. Reload to update map.": {
                        it: "I nodi non aggiornati entro questo intervallo vengono mostrati con icone rosse. Ricarica per aggiornare la mappa.",
                },
                "Don't show as offline": { it: "Non mostrare come offline" },
                "Waypoints Max Age": { it: "Anzianità massima dei waypoint" },
                "Waypoints not updated within this time are hidden. Reload to update map.": {
                        it: "I waypoint non aggiornati entro questo intervallo vengono nascosti. Ricarica per aggiornare la mappa.",
                },
                "Neighbours Max Distance (meters)": { it: "Distanza massima vicini (metri)" },
                "Neighbours further than this are hidden. Reload to update map.": {
                        it: "I vicini oltre questa distanza vengono nascosti. Ricarica per aggiornare la mappa.",
                },
                "Zoom Level (go to node)": { it: "Livello di zoom (vai al nodo)" },
                "How far to zoom map when navigating to a node.": {
                        it: "Grado di zoom della mappa quando si naviga verso un nodo.",
                },
                "Temperature Format": { it: "Formato della temperatura" },
                "Metrics will be shown in the selected format.": {
                        it: "Le metriche verranno mostrate nel formato selezionato.",
                },
                "Celsius (ºC)": { it: "Celsius (ºC)" },
                "Fahrenheit (ºF)": { it: "Fahrenheit (ºF)" },
                "Auto Update Position in URL": { it: "Aggiornamento automatico posizione nell'URL" },
                "Sets lat/lng/zoom as query parameters.": {
                        it: "Imposta latitudine/longitudine/zoom come parametri della query.",
                },
                "Enable Map Animations": { it: "Abilita animazioni mappa" },
                "Map will animate flying to nodes.": {
                        it: "La mappa animerà il movimento verso i nodi.",
                },
                "1 Hour": { it: "1 ora" },
                "24 Hours": { it: "24 ore" },
                "From:": { it: "Da:" },
                "To:": { it: "A:" },
                "Language": { it: "Lingua" },
                "Choose the interface language.": { it: "Scegli la lingua dell'interfaccia." },
                "Yes": { it: "Sì" },
                "No": { it: "No" },
                "Neighbours Updated:": { it: "Vicini aggiornati:" },
                "Position Updated:": { it: "Posizione aggiornata:" },
                "Unnamed Node": { it: "Nodo senza nome" },
                "Show Full Details": { it: "Mostra tutti i dettagli" },
                "Show Neighbours (Heard Us)": { it: "Mostra vicini (ci hanno sentito)" },
                "Show Neighbours (We Heard)": { it: "Mostra vicini (abbiamo sentito)" },
                "Expires:": { it: "Scadenza:" },
                "Lat/Lng:": { it: "Lat/Lon:" },
                "From ID:": { it: "ID origine:" },
                "From Hex ID:": { it: "ID esadecimale origine:" },
                "From Node:": { it: "Dal nodo:" },
                "From Node: ???": { it: "Dal nodo: ???" },
                "ID:": { it: "ID:" },
                "Updated:": { it: "Aggiornato:" },
                "Legend": { it: "Legenda" },
                "MQTT Connected": { it: "Connesso a MQTT" },
                "MQTT Disconnected": { it: "MQTT disconnesso" },
                "Offline Too Long": { it: "Offline da troppo tempo" },
                "Nodes": { it: "Nodi" },
                "Neighbours": { it: "Vicini" },
                "Waypoints": { it: "Waypoint" },
                "Position History": { it: "Storico posizioni" },
                "Clipboard not supported. Site must be served via https on iOS.": {
                        it: "Appunti non supportati. Il sito deve essere servito in HTTPS su iOS.",
                },
                "Link copied to clipboard!": { it: "Link copiato negli appunti!" },
                "day": { it: "giorno" },
                "days": { it: "giorni" },
                "Tiles &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> | Data from <a target=\"_blank\" href=\"https://meshtastic.org/docs/software/integrations/mqtt/\">Meshtastic</a>": {
                        it: "Tile &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> | Dati da <a target=\"_blank\" href=\"https://meshtastic.org/docs/software/integrations/mqtt/\">Meshtastic</a>",
                },
                "Tiles &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>": {
                        it: "Tile &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
                },
                "Tiles &copy; <a href=\"https://developers.arcgis.com/documentation/mapping-apis-and-services/deployment/basemap-attribution/\">Esri</a> | Data from <a target=\"_blank\" href=\"https://meshtastic.org/docs/software/integrations/mqtt/\">Meshtastic</a>": {
                        it: "Tile &copy; <a href=\"https://developers.arcgis.com/documentation/mapping-apis-and-services/deployment/basemap-attribution/\">Esri</a> | Dati da <a target=\"_blank\" href=\"https://meshtastic.org/docs/software/integrations/mqtt/\">Meshtastic</a>",
                },
                "Tiles &copy; Google | Data from <a target=\"_blank\" href=\"https://meshtastic.org/docs/software/integrations/mqtt/\">Meshtastic</a>": {
                        it: "Tile &copy; Google | Dati da <a target=\"_blank\" href=\"https://meshtastic.org/docs/software/integrations/mqtt/\">Meshtastic</a>",
                },
                "Terrain images from <a href=\"http://www.heywhatsthat.com\" target=\"_blank\">HeyWhatsThat.com</a>": {
                        it: "Immagini del terreno da <a href=\"http://www.heywhatsthat.com\" target=\"_blank\">HeyWhatsThat.com</a>",
                },
                "Could not find node:": { it: "Impossibile trovare il nodo:" },
        };

        const TEXT_NODE_CACHE = new WeakMap();

        function getStoredLanguage() {
                const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
                if (stored && LANGUAGE_OPTIONS.some((option) => option.code === stored)) {
                        return stored;
                }
                const browser = navigator.language ? navigator.language.slice(0, 2) : null;
                if (browser && LANGUAGE_OPTIONS.some((option) => option.code === browser)) {
                        return browser;
                }
                return DEFAULT_LANGUAGE;
        }

        function getTranslationValue(original, language) {
                const trimmed = original.trim();
                const entry = TEXT_TRANSLATIONS[trimmed];
                if (entry && entry[language]) {
                        return original.replace(trimmed, entry[language]);
                }
                return original;
        }

        function formatTemplate(value, params) {
                if (!params) {
                        return value;
                }
                return value.replace(/\{(\w+)\}/g, (_, key) => {
                        if (Object.prototype.hasOwnProperty.call(params, key)) {
                                return params[key];
                        }
                        return "";
                });
        }

        let isApplyingTranslations = false;

        function applyTextTranslations(language) {
                if (!document.body) {
                        return;
                }
                isApplyingTranslations = true;
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                let node;
                while ((node = walker.nextNode())) {
                        const value = node.nodeValue;
                        if (!value || !value.trim()) {
                                continue;
                        }
                        if (!TEXT_NODE_CACHE.has(node)) {
                                TEXT_NODE_CACHE.set(node, value);
                        }
                        const original = TEXT_NODE_CACHE.get(node);
                        const translated = getTranslationValue(original, language);
                        node.nodeValue = translated;
                }
                isApplyingTranslations = false;
        }

        let mutationObserver = null;

        function ensureObserver() {
                if (mutationObserver || !document.body) {
                        return;
                }
                mutationObserver = new MutationObserver(() => {
                        if (isApplyingTranslations) {
                                return;
                        }
                        requestAnimationFrame(() => applyTextTranslations(currentLanguage));
                });
                mutationObserver.observe(document.body, { childList: true, subtree: true });
        }

        function applyMetaTranslations(language) {
                document.title = META_TRANSLATIONS.title[language] || META_TRANSLATIONS.title.en;
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription) {
                        metaDescription.setAttribute(
                                "content",
                                META_TRANSLATIONS.description[language] || META_TRANSLATIONS.description.en,
                        );
                }
                const ogTitle = document.querySelector('meta[property="og:title"]');
                if (ogTitle) {
                        ogTitle.setAttribute(
                                "content",
                                META_TRANSLATIONS.title[language] || META_TRANSLATIONS.title.en,
                        );
                }
                const ogDescription = document.querySelector('meta[property="og:description"]');
                if (ogDescription) {
                        ogDescription.setAttribute(
                                "content",
                                META_TRANSLATIONS.description[language] || META_TRANSLATIONS.description.en,
                        );
                }
        }

        function applyLanguage(language) {
                document.documentElement.setAttribute("lang", language);
                applyMetaTranslations(language);
                ensureObserver();
                applyTextTranslations(language);
        }

        let currentLanguage = getStoredLanguage();

        function setLanguage(language) {
                currentLanguage = language;
                localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
                applyLanguage(language);
                window.dispatchEvent(
                        new CustomEvent("i18n:language-changed", { detail: { language } }),
                );
        }

        window.i18n = {
                get language() {
                        return currentLanguage;
                },
                setLanguage(language) {
                        if (!LANGUAGE_OPTIONS.some((option) => option.code === language)) {
                                return;
                        }
                        setLanguage(language);
                },
                refresh() {
                        applyLanguage(currentLanguage);
                },
                translateString(english) {
                        return TEXT_TRANSLATIONS[english]?.[currentLanguage] || english;
                },
                translateValue(english) {
                        return getTranslationValue(english, currentLanguage);
                },
                translateTemplate(template, params) {
                        const base = TEXT_TRANSLATIONS[template]?.[currentLanguage] || template;
                        return formatTemplate(base, params);
                },
                getLanguageOptions() {
                        return LANGUAGE_OPTIONS.map((option) => ({
                                code: option.code,
                                label: option.label[currentLanguage] || option.label.en,
                        }));
                },
        };

        if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => applyLanguage(currentLanguage));
        } else {
                applyLanguage(currentLanguage);
        }
})();
