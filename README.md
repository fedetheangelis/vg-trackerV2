# Game Tracker Pro

Un'applicazione web per tenere traccia dei giochi giocati, di quelli nel backlog, e importare la tua libreria da un file TSV. Le copertine dei giochi vengono recuperate automaticamente tramite l'API di RAWG.

Questa applicazione è costruita con React, TypeScript, e Tailwind CSS (via CDN). Utilizza `esbuild` per il processo di build.

## Caratteristiche

*   Visualizzazione separata per giochi giocati e backlog.
*   Aggiunta, modifica ed eliminazione di giochi.
*   Importazione di giochi da file TSV, con recupero automatico delle copertine da RAWG.io.
*   Utilizzo di `localStorage` per la persistenza dei dati nel browser.
*   Ordinamento dei giochi per vari criteri.
*   Interfaccia utente responsiva.

## Prerequisiti

*   [Node.js](https://nodejs.org/) (che include npm).

## Setup e Installazione Locale

1.  **Clona il repository (o scarica i file):**
    ```bash
    git clone <URL_DEL_TUO_REPOSITORY>
    cd <NOME_DELLA_CARTELLA_DEL_PROGETTO>
    ```

2.  **Installa le dipendenze:**
    Esegui il seguente comando nella directory principale del progetto per installare React, ReactDOM e `esbuild`.
    ```bash
    npm install
    ```

## Script Disponibili

Nella directory del progetto, puoi eseguire:

### `npm run build`

Compila l'applicazione per la produzione nella cartella principale.
Crea il file `bundle.js` che contiene tutto il codice JavaScript necessario.
Questo è il comando da eseguire prima di fare il deployment.

La chiave API di RAWG (fornita nello script `build` dentro `package.json`) viene inclusa nel `bundle.js` generato.

### `npm run start` (per sviluppo locale)

Esegue l'applicazione in modalità sviluppo.
Avvia un server di sviluppo locale (solitamente su `http://localhost:8000` o una porta simile indicata da `esbuild`) e ricarica automaticamente la pagina quando apporti modifiche ai file sorgente.

## Deployment su GitHub Pages

1.  **Assicurati che il repository sia su GitHub.**

2.  **Compila l'applicazione:**
    Esegui il comando di build per generare il file `bundle.js` aggiornato.
    ```bash
    npm run build
    ```

3.  **Commit e Push dei file:**
    Assicurati che i seguenti file siano committati e pushati sul tuo repository GitHub (solitamente sulla branch `main` o `master`):
    *   `index.html`
    *   `bundle.js` (generato dal comando `npm run build`)
    *   `package.json`
    *   `metadata.json`
    *   Tutti i file sorgente (`.ts`, `.tsx`) nelle cartelle `components`, `services`, `hooks`, ecc.
    *   `.gitignore`
    *   `README.md` (questo file)

4.  **Configura GitHub Pages:**
    *   Vai nelle impostazioni del tuo repository su GitHub (`Settings > Pages`).
    *   Nella sezione "Build and deployment", sotto "Source", seleziona "Deploy from a branch".
    *   Scegli la branch da cui fare il deployment (es. `main`).
    *   Scegli la cartella `/ (root)`.
    *   Clicca su "Save".

    Potrebbe volerci qualche minuto prima che il tuo sito sia live all'URL fornito da GitHub Pages (solitamente `https://<TUO_USERNAME>.github.io/<NOME_REPOSITORY>/`).

    **Importante:** Poiché `index.html` fa riferimento a `bundle.js` con un percorso relativo (`src="bundle.js"`), dovrebbe funzionare correttamente quando GitHub Pages serve i file dalla root della branch configurata.

## Struttura del Progetto

```
/
├── components/      # Componenti React UI
├── hooks/           # Custom React Hooks
├── services/        # Logica per API esterne, parsing, ecc.
├── App.tsx          # Componente principale dell'applicazione
├── constants.ts     # Costanti globali (es. chiavi API, URL)
├── index.html       # File HTML principale
├── index.tsx        # Punto di ingresso React
├── metadata.json    # Metadati dell'applicazione
├── package.json     # Dipendenze e script NPM
├── README.md        # Questo file
├── types.ts         # Definizioni TypeScript globali
└── .gitignore       # File da ignorare per Git
```

## API Utilizzate

*   [RAWG Video Games Database API](https://rawg.io/apidocs) - Per recuperare le informazioni sui giochi, incluse le copertine.

---

Modifica liberamente questo `README.md` per adattarlo meglio alle tue esigenze.
