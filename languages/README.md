## Languages

[*English below*](#english)

In questa cartella sono riposte le traduzioni che possono essere usate nel programma. Per cambiare la lingua in uso, modicica il file ``_connect.php`` nella cartella principale:

```php
include("languages/<linguaggio>.php");
```

Naturalmente puoi modificare ogni parola o frase, in base alle tue preferenze.
E se pensi che qualcosa possa essere migliorato, semplicemente apri una nuova pull request (motivando le tue scelte).

Oppure puoi caricare una nuova traduzione a sé stante, sarebbe fantastico (e apprezzato).


Solo una piccola ma importante nota riguardo la voce ``dateFormat``:
Ho scritto una piccola funzione che imita un dizionario, essa accetta (~sostituisce) solo le seguenti parole chiave:
* ``{YYYY}``: anno a quattro cifre;
* ``{YY}``: anno a due cifre;
* ``{MM}``: mese a due cifre;
* ``{M}``: mese a una cifra, se < 10;
* ``{DD}``: giorno a due cifre;
* ``{D}``: giorno a una cifra, se < 10.

Se impostato a ``default``, il formato sarà ``{YYYY}-{MM}-{DD}``.


---

#### English

In this folder are placed the languages that can be used in the program. To change the current language, edit the file ``_connect.php`` in the main folder:

```php
include("languages/<language_file>.php");
```

Of course, you can edit every word/sentence you want, according to your preferences.
And if you think that something can be improved, just do a pull request (motivating your intentions).

Or upload a new language, that would be great (and appreciated).


Just one little but important notice about the entry ``dateFormat``:
I wrote a tiny function to mimic a dictionary, it accept (~replace) only the following keys:
* ``{YYYY}``: four-digit year;
* ``{YY}``: two-digit year;
* ``{MM}``: two-digit month;
* ``{M}``: one-digit month for months below 10;
* ``{DD}``: two-digit day of the month;
* ``{D}``: one-digit day of the month for days below 10.

If is set to ``default``, the format is ``{YYYY}-{MM}-{DD}``.
