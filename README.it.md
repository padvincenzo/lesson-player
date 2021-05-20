# Lesson Player [![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.com/paypalme/VincenzoPadula)
Guarda le tue videolezioni sulla rete locale, non perdere il segno e accelera durante i silenzi.

*Leggi in altre lingue: [Inglese](README.md), [Italiano](README.it.md).*

## Guida all'utilizzo

### Installazione
  * Scarica, installa e avvia [xampp](https://www.apachefriends.org/download.html);
  * Apri la cartella di xampp:
    * Su Linux: ``/opt/lampp/htdocs/``
    * Su Windows: ``C:\\xampp\htdocs\``
    * Su Mac: monta il volume Xampp e apri la cartella ``htdocs``
  * Crea una cartella (es: ``lesson-player/``) e copia tutti i file al suo interno;
  * Apri il browser all'indirizzo ``http://localhost/phpmyadmin/`` e crea un nuovo database (es: ``lessons``);
  * Dalla cartella di xampp apri il file ``_connect.php`` e aggiorna le credenziali del database (e volendo anche la lingua);
  * Dal browser vai all'indirizzo ``http://localhost/<nome_cartella>/install.php`` (es: ``http://localhost/lesson-player/install.php``);
  * (Opzionale) Imposta xampp per l'avvio automatico all'avvio del pc.

### Inserimento videolezioni
  * Nella cartella ``.../htdocs/lesson-player/`` crea una sottocartella (es: ``classes/``) e copia qui tuttle le videolezioni, organizzate in una struttura tipo:

```
    lesson-player/
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

  * Nota: le cartelle e i file dentro la cartella ``classes`` possono anche essere collegamenti.
  * Apri il browser all'indirizzo ``http://localhost/lesson-player/``;
  * Inserisci tutti i corsi: nome, professore, percorso della cartella (es: ``classes/Physics I/``, notare lo ``/`` alla fine);
  * Tornando alla pagina principale:
    * Seleziona un corso e premi il pulsante ``Mostra``;
    * Inserisci tutte le videolezioni appartenenti a quel corso: data, titolo, nome del file (es: ``Lesson 01.mp4``);

### Velocizzare i silenzi
Per ogni lezione è possibile trovare e velocizzare i silenzi, tramite ``ffmpeg``:
  * Scarica e installa [ffmpeg](https://ffmpeg.org/);
  * Apri il terminale (o il prompt dei comandi);
  * Spostati nella cartella ``../lesson-player/`` tramite il comando ``cd <cartella_xampp>/htdocs/lesson-player/``;
  * Esegui ffmpeg con il filtro ``silencedetect``, come indicato nel form di creazione/modifica della videolezione. Es:

```
    ffmpeg -hide_banner -nostats -vn -i "classes/Physics I/Lesson 01.mp4" -af silencedetect=n=0.002:d=2.3 -f null -
```

  * Copia e incolla l'output nel form di modifica/aggiunta della videolezione. Esempio di output che ffmpeg genera:

```
    ...
    [silencedetect @ 0x56093ac71400] silence_start: 8.58428
    [silencedetect @ 0x56093ac71400] silence_end: 17.2754 | silence_duration: 8.69112
    [silencedetect @ 0x56093ac71400] silence_start: 2765.06
    [silencedetect @ 0x56093ac71400] silence_end: 2768.73 | silence_duration: 3.66969
    [silencedetect @ 0x56093ac71400] silence_start: 3653.35
    [silencedetect @ 0x56093ac71400] silence_end: 3657.01 | silence_duration: 3.66175
    [silencedetect @ 0x56093ac71400] silence_start: 4347.37
    [silencedetect @ 0x56093ac71400] silence_end: 4349.95 | silence_duration: 2.58562
    [silencedetect @ 0x56093ac71400] silence_start: 4424.87
    [silencedetect @ 0x56093ac71400] silence_end: 4429.57 | silence_duration: 4.69538
    [silencedetect @ 0x56093ac71400] silence_start: 4475.08
    [silencedetect @ 0x56093ac71400] silence_end: 4478.69 | silence_duration: 3.61456
    [silencedetect @ 0x56093ac71400] silence_start: 4961.04
    [silencedetect @ 0x56093ac71400] silence_end: 4965.18 | silence_duration: 4.14791
    ...
```

  * Si possono anche apportare modifiche al filtro, ma per un corretto funzionamento la durata minima dei silenzi (``d``) deve essere > 2.25.

Per velocizzare questa operazione ho creato un piccolo [script in _bash_](https://github.com/padvincenzo/lesson-player/blob/main/scripts/silences.sh) e uno [in _batch_](https://github.com/padvincenzo/lesson-player/blob/main/scripts/silences.bat). Entrambi eseguono il filtro su tutte le videolezioni presenti nella cartella in cui sono eseguiti, e salvano il risultato in un file di testo dallo stesso nome della videolezione (vanno copiati ed eseguiti dalla directory che contiene le lezioni).

## Scorciatoie da tastiera
|           **Tasto/i**          |               **Effetto**              |
|:------------------------------:| -------------------------------------- |
| ``Spazio``                     | Pausa/play                             |
| ``M``                          | Muto/sonoro                            |
| ``F``                          | Video a schermo intero                 |
| ``Freccia a sinistra`` o ``A`` | Riavvolgi 5s (1m con ``Ctrl``)         |
| ``Freccia a destra`` o ``D``   | Vai avanti di 5s (1m con ``Ctrl``)     |
| ``Freccia in alto`` o ``W``    | Alza il volume                         |
| ``Freccia in basso`` o ``S``   | Abbassa il volume                      |
| ``]`` o ``+`` (o ``=``)        | Aumenta la velocità di riproduzione    |
| ``[`` o ``-``                  | Diminuisci la velocità di riproduzione |

## Contribuire
Chiunque può contribuire a questo progetto, in diversi modi:
* Traducendo il progetto in altre lingue (aggiungendo nuovi file nella cartella ``languages/``);
* Scovando e segnalando/risolvendo [bug](https://github.com/padvincenzo/lesson-player/issues);
* Suggerendo nuove idee;
* Implementando nuove funzionalità.

In altre parole, crea una fork e divertiti a scrivere codice. Quando avrai qualcosa che possa migliorare il progetto, apri la tua pull request.

Per qualunque dubbio o perplessità possiamo discuterne sulla [pagina apposita](https://github.com/padvincenzo/lesson-player/discussions).

## Crediti
* Il sito fa uso della libreria [``video.js``](https://videojs.com/) e una versione modificata del [tema _city_](https://github.com/videojs/themes);
* Le icone sono prese da [www.flaticon.com](https://www.flaticon.com/).
