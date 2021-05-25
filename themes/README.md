## Themes

[*English below*](#english)

In questa cartella saranno caricati i temi. Per applicare un tema diverso da quello di default, apri il file ``index.php`` e modifica:

```html
<!-- Cambia qui il tema del sito. Se non fornito, il tema di default è dark.css -->
<link href="themes/nome_tema.css" rel="stylesheet">
```

Una volta fatto, è sufficiente ricaricare la pagina.

Puoi anche **creare un tuo tema personale**:

* Per cambiare i colori, partendo da un tema preesistente, modifica i valori delle variabili *(con altri colori, nel formato RGB/A)*:

```css
--background:             #222;   /* Colore di sfondo principale */
--background-opaque:      #000C;  /* Colore di sfondo in trasparenza */
--background-focused:     #111;   /* Colore di sfondo selezionato */
--color-primary:          #FFF;   /* Colore principale */
--color-primary-opaque:   #FFFA;  /* Colore principale in trasparenza */
--color-secondary:        #DDD;   /* Colore secondario */
--color-secondary-opaque: #DDD2;  /* Colore secondario in trasparenza */
--shadow:                 #111;   /* Colore dell'ombra */
```

* Puoi anche aggiungere ulteriori *regole di stile*, se hai dimestichezza con il linguaggio *css*.
* Una volta terminato il tuo tema, puoi dargli un nome e aprire una nuova pull request.
* Per qualsiasi dubbio, o se hai richieste da fare, scrivimi a *padvincenzo@gmail.com*


---

#### English
Themes are placed in this folder. To apply a different theme from the default one, open ``index.php`` and edit:

```html
<!-- Change the theme of the site. If not provided, default is dark.css -->
<link href="themes/theme_name.css" rel="stylesheet">
```

Once done, reload the page.

You can also **create your own theme**:

* To change colors, starting from a pre-existent theme, change variables' values *(with other colors, in RGB/A format)*:

```css
--background:             #222;   /* Main background color */
--background-opaque:      #000C;  /* Main background color, in transparency */
--background-focused:     #111;   /* Main background color selected */
--color-primary:          #FFF;   /* Main color */
--color-primary-opaque:   #FFFA;  /* Main color, in transparency */
--color-secondary:        #DDD;   /* Secondary color */
--color-secondary-opaque: #DDD2;  /* Secondary color, in transparency */
--shadow:                 #111;   /* Shadow's color */
```

* You can also add other *css rules*, if you know *css*.
* Once you finish your theme, choose a name and open pull request.
* If in doubt, or you have requests, write me at *padvincenzo@gmail.com*
