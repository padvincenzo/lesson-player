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

window.addEventListener("load", () => {
  UI.init();
  Player.init();
});

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
    const table = document.createElement("table");
    table.setAttribute("id", "classes");
    const tr = document.createElement("tr");
    const name = document.createElement("td");
    name.innerText = lang.class;
    const professor = document.createElement("td");
    professor.innerText = lang.professor;
    const n = document.createElement("td");
    n.innerText = lang.progress;

    tr.appendChild(name);
    tr.appendChild(professor);
    tr.appendChild(n);
    table.appendChild(tr);

    for(let idclass in UI.classes) {
      let c = UI.classes[idclass];
      table.appendChild(c.toLine());
    };

    UI.display(table);
    UI.append(UI.btnNewClass.btn);
  }
}

class Button {
  btn = null;

  constructor(_text = "", _click = null, _id = null) {
    this.btn = document.createElement("button");
    this.btn.innerText = _text;

    if(_click != null) {
      this.btn.addEventListener("click", _click);
    }

    if(_id != null) {
      this.btn.setAttribute("id", _id);
    }
  }

  static small(_text = "", _click = null, _id = null) {
    const btn = new Button(_text, _click, _id);
    btn.btn.setAttribute("class", "btnSmall");
    return btn;
  }
}

function request(_to, _data) {
  return new Promise((_resolve, _reject) => {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        try {
          var response = JSON.parse(xhr.responseText);

          if(response.result) {
            _resolve(response.data);
          } else {
            _reject(response.message);
          }
        }
        catch(err) {
          _reject(err.message + "<br><br>" + xhr.responseText);
        }
      }

      if(xhr.readyState == 4 && xhr.status > 299) {
        _reject("Server Error: " + xhr.statusText);
      }
    };

    xhr.onerror = () => {
      _reject("xmlHTTP Error: " + xhr.responseText);
    };

    xhr.open("POST", _to, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("data=" + JSON.stringify(_data));
  });
}

function randomString(_length = 4) {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let str = "";
  for (let i = 0; i < _length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}
