**Creato da:** [Liam Cottle](https://liamcottle.com)\
**Fork di:** [Tilen Komel](https://github.com/KomelT)\
**Fork di:** [Niccolò Malenotti](https://github.com/folletto95)


<h2 align="center">Mappa Meshtastic</h2>

Una mappa di tutti i nodi Meshtastic ricevuti tramite MQTT.

La versione pubblica della mappa è disponibile all'indirizzo http://smpisa.ddns:9090


<img src="./screenshot.png" alt="Anteprima della Mappa Meshtastic">

## Come funziona?

- Un [client MQTT](./mqtt/src/mqtt.ts) resta connesso a `smpisa.ddns:1883` e sottoscrive il topic `msh/#`.
- Tutti i messaggi ricevuti vengono decodificati come pacchetti [ServiceEnvelope](https://buf.build/meshtastic/protobufs/docs/main:meshtastic#meshtastic.ServiceEnvelope).
- Se un pacchetto è cifrato, si tenta la decifratura con la chiave predefinita `AQ==`.
- I pacchetti che non possono essere decodificati come `ServiceEnvelope` vengono ignorati.
- I pacchetti `NODEINFO_APP` aggiungono un nodo al database.
- I pacchetti `POSITION_APP` aggiornano la posizione del nodo nel database.
- I pacchetti `NEIGHBORINFO_APP` registrano i vicini ascoltati da un nodo nel database.
- I pacchetti `TELEMETRY_APP` aggiornano le metriche di batteria e tensione di un nodo nel database.
- I pacchetti `TRACEROUTE_APP` memorizzano tutti i traceroute effettuati da un nodo nel database.
- I pacchetti `MAP_REPORT_APP` vengono salvati nel database ma, poiché poco diffusi, non sono ancora utilizzati.
- Il database è un server MySQL e un server Express Node.js espone un'API che fornisce i dati all'interfaccia della mappa.

## Funzionalità

- [x] Connessione a mqtt.meshtastic.org per raccogliere nodi e metriche.
- [x] Visualizzazione dei nodi sulla mappa quando inviano una posizione valida.
- [x] Barra di ricerca per trovare nodi per ID, ID esadecimale, nome corto o nome lungo.
- [x] Passa il mouse sui nodi per vedere informazioni di base e un'immagine di anteprima.
- [x] Clicca sui nodi per aprire una barra laterale con altre informazioni, come grafici di telemetria e traceroute.
- [x] Possibilità di condividere un link diretto a un nodo. La mappa si posizionerà automaticamente.
- [x] Elenco dei dispositivi per vedere quali modelli hardware sono più diffusi.
- [x] Layout ottimizzato per dispositivi mobili.
- [x] Impostazioni per nascondere i nodi che non vengono aggiornati da tempo.
- [x] Interfaccia in tempo reale per visualizzare i pacchetti `TEXT_MESSAGE_APP` non appena arrivano.
- [x] Cronologia delle posizioni di un nodo con intervallo temporale selezionabile.
- [x] Layer "Neighbours" che mostra linee di connessione blu tra nodi che si sono ascoltati a vicenda.
  - Le informazioni provengono dai pacchetti `NEIGHBORINFO_APP`.
  - Alcune linee possono risultare errate.
  - Le versioni del firmware Meshtastic precedenti alla [v2.3.2](https://github.com/meshtastic/firmware/releases/tag/v2.3.2.63df972) riportano i nodi MQTT come vicini.
  - Il problema è stato risolto in [meshtastic/firmware#3457](https://github.com/meshtastic/firmware/pull/3457), ma l'adozione potrebbe essere lenta.

## Sviluppo

Clona il repository:

```
git clone https://github.com/folletto95/meshtastic-map-ITA.git
cd meshtastic-map-ITA
```

Compila le immagini Docker:

```
docker compose -f docker-compose.dev.yaml build
```

Configura le variabili d'ambiente copiando il file di esempio e modificandolo se necessario:

```
cp .env.example .env
nano .env
```

Il file `.env.example` elenca tutte le variabili supportate; Docker Compose leggerà automaticamente i valori definiti in `.env`.

Elenco variabili d'ambiente:

- [MQTT](./mqtt/src/settings.ts)
- [API](./api/src/settings.ts)
- [APP](./app/index.js)

Avvia i servizi:

```
docker compose -f docker-compose.dev.yaml up
```

## Esecuzione

Clona il repository:

```
git clone https://github.com/folletto95/meshtastic-map-ITA.git

cd meshtastic-map-ITA
```

Compila le immagini Docker:

```
docker compose build
```

Configura le variabili d'ambiente copiando il file di esempio e modificandolo se necessario:


```
cp .env.example .env
nano .env
```
Il file `.env.example` elenca tutte le variabili supportate; Docker Compose leggerà automaticamente i valori definiti in `.env`.

Elenco variabili d'ambiente:

- [MQTT](./mqtt/src/settings.ts)
- [API](./api/src/settings.ts)
- [APP](./app/index.js)

Avvia i servizi:

```
docker compose up
```

## Aggiornamenti

È sufficiente eseguire `git pull` o scaricare l'immagine aggiornata da Docker Hub. Le migrazioni gestiranno automaticamente l'aggiornamento del database.

## Test

Per eseguire i test unitari:

```
npm run test
```

## Contribuire

Se vuoi proporre una nuova funzionalità o hai trovato un bug, [apri una issue](https://github.com/folletto95/meshtastic-map-ITA.git/issues) su GitHub.

## Licenza

MIT

## Note legali

Questo progetto non è affiliato né approvato dal progetto Meshtastic.
Il logo Meshtastic è un marchio registrato di Meshtastic LLC.

IL SOFTWARE È FORNITO "COSÌ COM'È", SENZA ALCUN TIPO DI GARANZIA, ESPRESSA O IMPLICITA, INCLUSE MA NON LIMITATE ALLE GARANZIE DI COMMERCIABILITÀ, IDONEITÀ A UNO SCOPO SPECIFICO E NON VIOLAZIONE. IN NESSUN CASO GLI AUTORI O I TITOLARI DEL COPYRIGHT POTRANNO ESSERE RITENUTI RESPONSABILI PER QUALSIASI RECLAMO, DANNO O ALTRA RESPONSABILITÀ, SIA IN UN'AZIONE CONTRATTUALE, CIVILE O DI ALTRO TIPO, DERIVANTE DA, O CONNESSA A, IL SOFTWARE O L'USO O ALTRE OPERAZIONI NEL SOFTWARE.
