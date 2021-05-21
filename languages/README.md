## Languages
In this folder are placed the languages that can be used in the program. To change the current language, edit the file ``_connect.php`` in the main folder:

```php
include("languages/<language_file>.php");
```

Of course, you can add or edit whatever you want, according to your preferences.
And if you think that something can be improved, just do a pull request (motivating your intentions).

Or upload a new language, that would be great (and appreciated).


Just one important notice about the entry ``dateFormat``:
I wrote a tiny function to mimic a dictionary, it accept (~replace) only the following keys:
* ``{YYYY}``: four-digit year;
* ``{YY}``: two-digit year;
* ``{MM}``: two-digit month;
* ``{M}``: one-digit month for months below 10;
* ``{DD}``: two-digit day of the month;
* ``{D}``: one-digit day of the month for days below 10.

If is set to ``default``, the format is ``{YYYY}-{MM}-{DD}``.
