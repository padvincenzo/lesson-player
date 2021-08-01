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
  // wrapper;
  // btnHome;

  static init() {
    UI.wrapper = document.getElementById("container");

    UI.btnHome = new Button(lang.homePage, () => {
      UI.listClasses();
    });

    UI.listClasses().then(() => { Class.loadLast(); });
  }

  static display() {
    UI.wrapper.innerHTML = "";
    for(let i = 0; i < arguments.length; i++) {
      UI.wrapper.appendChild(arguments[i]);
    }

    window.scrollTo(0, 0);
  }

  static listClasses() {
    return Class.retrieve().then(() => {
      UI.display(Class.cards(), br(), Class.btnNewClass.btn);
      document.title = `${lang.classList} | Lesson Player`;
    });
  }
}
