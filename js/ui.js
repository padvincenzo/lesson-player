/*
Lesson Player
View your lessons, do not miss the mark.

Copyright (C) 2021  Vincenzo Padula

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

class UI {
  wrapper = null;
  classes = null;

  btnHome = null;
  btnNewClass = null;

  static init() {
    UI.wrapper = document.createElement("div");
    UI.wrapper.setAttribute("id", "container");
    document.body.appendChild(UI.wrapper);

    UI.btnNewClass = new Button(lang.newClass, () => {
      Class.form(Class.dummy());
    }, "newClass");

    UI.btnHome = new Button(lang.homePage, () => {
      UI.retrieveClasses();
    });

    UI.retrieveClasses().then(() => {
      let lastClass = Object.values(this.classes)[0];
      lastClass.dbGetNext().then(() => {
        if(lastClass.nextLesson != null)
          lastClass.nextLesson.play(false);
      });
    });

    let footer = document.createElement("footer");
    let text = document.createElement("div");
    text.innerText = "Developed by Vincenzo Padula";
    footer.appendChild(text);

    let credits = document.createElement("div");
    credits.innerHTML = "Credits: <div>Icons made by <a href='https://www.freepik.com' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a></div>";
    footer.appendChild(credits);

    document.body.appendChild(footer);
  }

  static clean() {
    UI.wrapper.innerHTML = "";
  }

  static append(_htmlElement) {
    UI.wrapper.appendChild(_htmlElement);
  }

  static display(_htmlElement) {
    UI.clean();
    UI.append(_htmlElement);
    window.scrollTo(0, 0);
  }

  static retrieveClasses() {
    return request("class.php", {request: "list"})
      .then((_classes) => {
        this.classes = {};
        _classes.forEach((c, i) => {
          UI.classes[c.idclass] = new Class(c);
        });

        UI.listClasses();
      })
      .catch((_message) => {
        Message.view("FAIL: " + _message);
      });
  }

  static listClasses() {
    const classes = document.createElement("div");
    classes.setAttribute("class", "cards");

    let i = 2;
    for(let idclass in UI.classes) {
      let c = UI.classes[idclass];
      let card = c.toCard();
      card.tabIndex = i;
      classes.appendChild(card);
      i++;
    };

    UI.display(classes);
    UI.br();
    UI.append(UI.btnNewClass.btn);
    document.title = `${lang.classList} | Lesson Player`;
  }

  static br() {
    UI.append(document.createElement("br"));
  }
}
