# Lesson Player [![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.com/paypalme/VincenzoPadula)
Watch your video lessons on LAN, do not miss the mark and speed up during silences.

*Read this in other languages: [English](README.md), [Italian](README.it.md).*

## Getting started

### Installation
  * Download, install and run [xampp](https://www.apachefriends.org/download.html);
  * Open xampp folder:
    * On Linux: ``/opt/lampp/htdocs/``
    * On Windows: ``C:\\xampp\htdocs\``
    * On Mac: mount Xampp volume and open the folder ``htdocs``
  * Create a new folder (e.g.: ``lesson-player/``) and copy all files inside;
  * Open the browser at ``http://localhost/phpmyadmin/`` and create a new database (e.g.: ``lessons``);
  * From the xampp folder, open ``_connect.php`` and update the database credentials (and maybe the language);
  * From the browser go to ``http://localhost/<folder_name>/install.php`` (e.g.: ``http://localhost/lesson-player/install.php``);
  * (Optional) Make xampp run at pc startup by default.

### Inserting video lessons
  * In the folder ``.../htdocs/lesson-player`` create a subdirectory (e.g.: ``classes/``) and copy all your video lessons inside, arranged in a structure like:

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
        _connect.php
        _language.php
        ...
```

  * Note: folders and videos inside ``classes`` may also be links.
  * Open the browser at ``http://localhost/lesson-player/``;
  * Insert all your classes: name, professor, folder name (e.g.: ``classes/Physics I/``);
  * Go back to the homepage:
    * Select a class and press ``Show`` (_``Mostra`` in italian_);
    * Insert all lessons of the selected class: date of the lesson, title, file name (e.g.: ``Lesson 01.mp4``);

### Speed up silences
For each lesson it's possible to find and speed up silences, using ``ffmpeg``:
  * Download and install [ffmpeg](https://ffmpeg.org/);
  * Open the terminal (or prompt);
  * Move to the folder ``.../lesson-player/`` (e.g. using ``cd <xampp_folder>/htdocs/lesson-player/``);
  * Run ffmpeg with ``silencedetect`` filter, as shown in the form of creation/edit of a lesson. E.g.:

```
    ffmpeg -hide_banner -nostats -vn -i "classes/Physics I/Lesson 01.mp4" -af silencedetect=n=0.002:d=2.3 -f null -
```

  * Copy & paste the output in the form of creation/edit of the lesson. Example of a ffmpeg output:

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

  * You can also edit the filter, but in order to ensure the success of the program, the minimum duration of silences (``d``) must be > 2.25.

With the aim of saving time, I've written a little [script in _bash_](https://github.com/padvincenzo/lesson-player/blob/main/silences.sh) that run the filter on every video in the same folder where the script is executed, and save the result in a file with the same name of the video (so the script should be executed in the folder that contains the videos).
It is useful for linux users, other operative systems need the script to be rewritten in other languages.

## Contributions
Anyone can contribute to this project, in many ways:
* Translating the project in other languages (by adding new files in the ``languages/`` folder);
* Finding and/or fixing [bugs](https://github.com/padvincenzo/lesson-player/issues);
* Suggesting new ideas;
* Implementing new functionalities.

For For any doubt or perplexity we can [discuss here](https://github.com/padvincenzo/lesson-player/discussions).

## Credits
* The website makes use of [``video.js``](https://videojs.com/) and a modified version of [theme _city_](https://github.com/videojs/themes);
* Icons are from [www.flaticon.com](https://www.flaticon.com/).
