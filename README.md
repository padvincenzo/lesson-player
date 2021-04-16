# Lesson Player [![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.com/paypalme/VincenzoPadula)
Guarda le tue videolezioni senza perdere il segno.


## Guida all'utilizzo

### Installazione
  * Scarica, installa e avvia [xampp](https://www.apachefriends.org/download.html);
  * Apri la cartella di xampp:
    * Su Linux: ``/opt/lampp/htdocs/``
    * Su Windows: ``C:\\xampp\htdocs\``
    * Su Mac: monta il volume Xampp e apri la cartella ``htdocs``
  * Crea una cartella (es: ``lesson-player/``) e copia tutti i file al suo interno;
  * Apri il browser all'indirizzo ``http://localhost/phpmyadmin/`` e crea un nuovo database (es: ``lessons``);
  * Dalla cartella di xampp apri il file ``_connect.php`` e aggiorna le credenziali del database;
  * Dal browser vai all'indirizzo ``http://localhost/<nome_cartella>/install.php`` (es: ``http://localhost/lesson-player/install.php``);
  * (Opzionale) Imposta xampp per l'avvio automatico all'avvio del pc.

### Inserimento videolezioni
  * Nella cartella ``htdocs/lessons`` crea una sottocartella (es: ``classes/``) e copia qui tuttle le videolezioni, organizzate in una struttura tipo:
```
    classes/
        Physics I/
            Lesson 01.mp4
            Lesson 02.mp4
            ...
        Chemistry/
            Lesson 2021-01-01.mp4
            Lesson 2021-01-02.mp4
            ...
        ...
```
  * Apri il browser all'indirizzo ``http://localhost/lesson-player/``;
  * Inserisci tutti i corsi: nome, professore, percorso della cartella (es: ``classes/Physics I/``);
  * Tornando alla pagina principale:
    * Seleziona un corso e premi il pulsante ``Mostra``;
    * Inserisci tutte le videolezioni appartenenti a quel corso: data, titolo, nome del file (es: ``Lesson 01.mp4``);

### Velocizzare i silenzi
Per ogni lezione è possibile trovare e velocizzare i silenzi, tramite ``ffmpeg``:
  * Scarica e installa [ffmpeg](https://ffmpeg.org/);
  * Apri il terminale (o il prompt dei comandi);
  * Spostati nella cartella ``lesson-player/`` tramite il comando ``cd cartella_xampp/lesson-player/``;
  * Esegui ffmpeg con il filtro ``silencedetect``, come indicato nel form di creazione/modifica della videolezione. Es:
```
    ffmpeg -hide_banner -nostats -vn \
    -i "classes/Physics I/Lesson 01.mp4" \
    -af silencedetect=n=0.002:d=2.3 \
    -f null -
```
  * Copia e incolla l'output nel form di modifica/aggiunta della videolezione.
  * Si possono anche apportare modifiche al filtro, ma per un corretto funzionamento la durata minima dei silenzi (``d``) deve essere > 2.25.

Per velocizzare questa operazione ho creato un piccolo [script in _bash_](https://github.com/padvincenzo/lesson-player/blob/main/silences.sh) che esegue il filtro su tutte le videolezioni presenti nella cartella in cui è eseguito, e salva il risultato in un file di testo dallo stesso nome della videolezione (va copiato ed eseguito dalla directory che contiene le lezioni).
È utilizzabile solo da linux, per altri sistemi operativi è necessario modificarlo in base al linguaggio utilizzato.

## Contribuire
Chiunque può contribuire a questo progetto, in diversi modi:
* Traducendo il progetto in altre lingue (è sufficiente tradurre la pagina [``_language.php``](https://github.com/padvincenzo/lesson-player/blob/main/_language.php));
* Scovando e segnalando/risolvendo [bug](https://github.com/padvincenzo/lesson-player/issues);
* Suggerendo nuove idee;
* Implementando nuove funzionalità.

Per qualunque dubbio o perplessità possiamo discuterne sulla [pagina apposita](https://github.com/padvincenzo/lesson-player/discussions).

## Crediti
* Il sito fa uso della libreria [``video.js``](https://videojs.com/) e una versione modificata del [tema _city_](https://github.com/videojs/themes);
* Le icone sono prese da [www.flaticon.com](https://www.flaticon.com/).
