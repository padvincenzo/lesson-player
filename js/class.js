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

class Class {
  idclass = null;
  name = null;
  professor = null;
  directory = null;
  lessons = null;
  nLessons = null;
  nWatched = null;

  btnResume = null;
  btnEdit = null;
  btnShow = null;
  btnAddLesson = null;

  nextLesson = null;

  constructor(_data) {
    this.idclass = _data.idclass;
    this.name = _data.name;
    this.professor = _data.professor;
    this.directory = _data.directory;
    this.nLessons = _data.nLessons;
    this.nWatched = _data.nWatched ? _data.nWatched : 0;
    this.lessons = {};

    this.btnResume = Button.small(lang.resume, () => { this.resume(); });
    this.btnEdit = Button.small(lang.edit, () => { this.edit(); });
    this.btnAddLesson = new Button(lang.newLesson, () => { this.newLesson(); });
    this.btnShow = Button.small(lang.show, () => { this.show(); });
  }

  toCard() {
    const card = document.createElement("div");
    card.setAttribute("class", "card class");

    const title = document.createElement("div");
    title.setAttribute("class", "title");

    const name = document.createElement("div");
    name.innerText = this.name;
    const professor = document.createElement("div");
    professor.innerText = this.professor;

    title.appendChild(name);
    title.appendChild(professor);

    const progress = document.createElement("div");
    progress.innerText = `${this.nWatched} / ${this.nLessons}`;
    progress.setAttribute("class", "progress");

    const buttons = document.createElement("div");
    buttons.setAttribute("class", "buttons");
    buttons.appendChild(this.btnResume.btn);
    buttons.appendChild(this.btnShow.btn);
    buttons.appendChild(this.btnEdit.btn);

    card.appendChild(title);
    card.appendChild(progress);
    card.appendChild(buttons);

    card.addEventListener("dblclick", () => {
      this.resume();
    });

    card.addEventListener("keyup", (e) => {
      if(e.code == "Enter") {
        this.resume();
      }
    });

    return card;
  }

  retrieveLessons() {
    return request("lesson.php", {request:"list", idclass:this.idclass})
      .then((_lessons) => {
        this.lessons = {};
        _lessons.forEach((l) => {
          this.lessons[l.idlesson] = new Lesson(l, this);
        });
      })
      .catch((_message) => {
        Message.view("FAIL: " + _message);
      });
  }

  show() {
    return this.retrieveLessons().then(() => {
      UI.display(this.listLessons());
      UI.br();
      UI.append(UI.btnHome.btn);
      UI.append(this.btnAddLesson.btn);
      document.title = `${this.name} | Lesson Player`;
    });
  }

  resume() {
    return this.dbGetNext().then(() => {
      if(this.nextLesson == null)
        Message.view(lang.classCompleted);
      else
        this.nextLesson.play();
    });
  }

  listLessons() {
    const lessons = document.createElement("div");
    lessons.setAttribute("class", "cards");

    let i = 2;
    for(let idlesson in this.lessons) {
      let l = this.lessons[idlesson];
      let card = l.toCard();
      card.tabIndex = i;
      lessons.appendChild(card);
      i++;
    };

    return lessons;
  }

  edit() {
    Class.form(this);
  }

  newLesson() {
    Lesson.form(Lesson.dummy(this));
  }

  static dummy() {
    return {
      idclass: null,
      name: "",
      professor: "",
      directory: ""
    };
  }

  static isDummy(_class) {
    return _class.idclass == null;
  }

  static form(_class) {
    const form = new Form();
    form.appendText("className", _class.name, lang.className);
    form.appendText("professor", _class.professor, lang.professor);
    form.appendText("directory", _class.directory, lang.classDirectory);

    form.appendButton(lang.confirm, () => {
      if(Class.isDummy(_class)) {
        Class.dbAdd(form.values());
      } else {
        _class.dbEdit(form.values());
      }
    });

    UI.display(form.wrapper);
    UI.append(UI.btnHome.btn);
  }

  dbGetNext() {
    return request("lesson.php", {request:"getNext", idclass:this.idclass})
      .then((_lesson) => {
        if(_lesson == null) {
          this.nextLesson = null;
          return;
        }

        this.lessons[_lesson.idlesson] = new Lesson(_lesson, this);
        this.nextLesson = this.lessons[_lesson.idlesson];
      });
  }

  static dbAdd(_data) {
    _data.request = "add";
    return request("class.php", _data)
      .then((_class) => {
        UI.classes[_class.idclass] = new Class(_class);
        Message.view(lang.classAdded);
      })
      .catch((_message) => {
        Message.view("FAIL: " + _message);
      });
  }

  dbEdit(_data) {
    _data.request = "edit";
    _data.idclass = this.idclass;
    return request("class.php", _data)
      .then((_class) => {
        this.name = _class.name;
        this.professor = _class.professor;
        this.directory = _class.directory;

        Message.view(lang.classEdited);
        UI.listClasses();
      })
      .catch((_message) => {
        Message.view("FAIL: " + _message);
      });
  }
}
