# Lesson Player [![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.com/paypalme/VincenzoPadula)
Guarda le tue videolezioni senza perdere il segno.

## Indice dei contenuti
  - [Installazione](#installazione)
  - [Contribuire](#contribuire)
  - [Crediti](#crediti)

## Installazione
Per installare il sito è necessario disporre di un server PHP (personalmente utilizzo [xampp](https://www.apachefriends.org/download.html)).
* Copia tutti i file all'interno di una directory (es: ``/lesson-player/``);
* Copia le videolezioni all'interno della directory del server (es: ``/lesson-player/corsi/``), ad ogni corso la sua cartella;
* Crea il database `lessons` utilizzando ``phpmyadmin`` (``http://localhost/phpmyadmin/``) ed esegui lo [script sql ``database.sql``](https://github.com/padvincenzo/lesson-player/blob/main/database.sql);
* Apri la pagina principale del sito e inizia a riempire il database, aggiungendo i corsi e le videolezioni;
* Per ogni lezione è possibile trovare e velocizzare i silenzi, tramite ``ffmpeg``:
  * Scarica e installa [ffmpeg](https://ffmpeg.org/) sul tuo PC;
  * Esegui per ogni videolezione ffmpeg con il filtro ``silencedetect``, come indicato nel form di creazione/modifica della videolezione. Si possono anche apportare modifiche al filtro, ma per un corretto funzionamento la durata minima dei silenzi (``d``) deve essere > 2.25.
    * Per velocizzare questa operazione ho creato un piccolo [script in _bash_](https://github.com/padvincenzo/lesson-player/blob/main/silences.sh) (utilizzabile solo da linux, per altri sistemi operativi è necessario modificarlo in base al linguaggio utilizzato) che esegue il filtro e salva il risultato in un file di testo dallo stesso nome della videolezione (va copiato ed eseguito dalla directory che contiene le lezioni).
  * Copia e incolla l'output di ffmpeg nel form di creazione/modifica della videolezione.

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
