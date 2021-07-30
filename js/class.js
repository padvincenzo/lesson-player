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
  classes = null;
  btnNewClass = null;

  static retrieve() {
    if(Class.classes == null) {
      Class.classes = [];
    }

    if(Class.btnNewClass == null) {
      Class.btnNewClass = new Button(lang.newClass, () => {
        Class.form(Class.dummy());
      }, "newClass");
    }

    return request("class.php", {request: "list"})
      .then((classes) => {
        classes.forEach((c, i) => {
          // Check if the class is already in memory
          var _class = Class.getById(c.idclass);
          if(_class) {
            _class.update(c);
          } else {
            Class.classes.push(new Class(c));
          }
        });
      })
      .catch((_message) => {
        Message.view("FAIL: " + _message);
      });
  }

  static loadLast() {
    if(Class.classes.length == 0)
      return;

    Class.classes[0].dbGetNext().then(() => {
      if(Class.classes[0].nextLesson != null)
        Class.classes[0].nextLesson.play(false);
    });
  }

  static getById(idclass = null) {
    if(idclass == null) {
      return null;
    }

    return Class.classes.find((c) => {
      return c.idclass == idclass;
    });
  }

  static cards() {
    var cards = document.createElement("div");
    cards.classList.add("cards");

    Class.classes = Class.classes.filter((c) => !c.removed);

    for(let i = 0; i < Class.classes.length; i++) {
      cards.appendChild(Class.classes[i].toCard(i + 2));
    }

    return cards;
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
    var directory = form.appendText("directory", _class.directory, lang.classDirectory);

    directory.addEventListener("focusout", () => {
      if(directory.value != "" && directory.value.slice(-1) != "/")
        directory.value += "/";
    });

    // form.appendButton(lang.confirm, () => {
    //   let values = form.values();
    //   if(values == null) {
    //     return;
    //   }
    //
    //   if(Class.isDummy(_class)) {
    //     Class.dbAdd(values);
    //   } else {
    //     _class.dbEdit(values);
    //   }
    // });

    // Permanently delete class will reappear when trash bin will be ready
    // if(! Class.isDummy(_class)) {
    //   form.appendButton(lang.delete, () => {
    //     _class.askToDelete();
    //   });
    // }

    // form.appendButton(lang.cancel, () => {
    //   UI.listClasses();
    // });

    Message.view(form.wrapper, true, lang.confirm).then(() => {
      let values = form.values();
      if(values == null) {
        return;
      }

      if(Class.isDummy(_class)) {
        Class.dbAdd(values);
      } else {
        _class.dbEdit(values);
      }
    }).catch(() => {
      // do nothing
    });
  }

  static dbAdd(_data) {
    _data.request = "add";
    return request("class.php", _data)
      .then((classData) => {
        var c = new Class(classData);
        Class.classes.push(c);
        UI.listClasses();
        Message.view(c.dictionaryReplace(lang.classAdded), true, lang.newClass, lang.close).then(() => {
          Class.form(Class.dummy());
        }).catch(() => {
          // do nothing
        });
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  idclass = null;
  name = null;
  professor = null;
  directory = null;
  lessons = null;
  nLessons = null;
  nWatched = null;

  card = null;
  removed = false;
  searchBox = null;

  btnResume = null;
  btnEdit = null;
  btnShow = null;
  btnAddLesson = null;

  nextLesson = null;

  constructor(_data) {
    this.idclass = _data.idclass;
    this.update(_data);
    this.lessons = [];
  }

  update(_data) {
    this.name = decodeString(_data.name);
    this.professor = decodeString(_data.professor);
    this.directory = decodeString(_data.directory);
    this.nLessons = _data.nLessons;
    this.nWatched = _data.nWatched ? _data.nWatched : 0;

    if(this.card != null) {
      this.card.name.innerText = this.name;
      this.card.professor.innerText = this.professor;
      this.card.progress.innerText = `${this.nWatched} / ${this.nLessons}`;
    }
  }

  // Currently, reference variable r is not used
  dictionary(r) {
    return {
      "{className}": (r) => this.name,
      "{classProfessor}": (r) => this.professor,
      "{classDirectory}": (r) => this.directory
    };
  }

  dictionaryReplace(string, r = null) {
    return dictionaryReplace(this.dictionary(r), string, r);
  }

  createCard() {
    if(this.card != null) {
      return;
    }

    this.btnResume = Button.small(lang.resume, () => { this.resume(); });
    this.btnEdit = Button.small(lang.edit, () => { this.edit(); });
    this.btnAddLesson = new Button(lang.newLesson, () => { this.newLesson(); });
    this.btnShow = Button.small(lang.show, () => { this.show(); });
    this.btnRemove = Button.small(lang.remove, () => { this.askToRemove(); });

    this.card = {};

    this.card.dom = document.createElement("div");
    this.card.dom.classList.add("card", "class");

    this.card.name = document.createElement("div");
    this.card.name.innerText = this.name;
    this.card.dom.appendChild(this.card.name);

    this.card.professor = document.createElement("div");
    this.card.professor.innerText = this.professor;
    this.card.dom.appendChild(this.card.professor);

    this.card.progress = document.createElement("div");
    this.card.progress.innerText = `${this.nWatched} / ${this.nLessons}`;
    this.card.progress.classList.add("progress");
    this.card.dom.appendChild(this.card.progress);

    this.card.buttons = document.createElement("div");
    this.card.buttons.setAttribute("class", "buttons");
    this.card.buttons.appendChild(this.btnResume.btn);
    this.card.buttons.appendChild(this.btnShow.btn);
    this.card.buttons.appendChild(this.btnEdit.btn);
    this.card.buttons.appendChild(this.btnRemove.btn);
    this.card.dom.appendChild(this.card.buttons);

    this.card.dom.addEventListener("dblclick", () => {
      this.resume();
    });

    this.card.dom.addEventListener("keyup", (e) => {
      switch(e.code) {
        case "Enter": {
          this.resume();
          break;
        }
        case "Delete": {
          this.askToRemove();
          break;
        }
      }
    });

    this.searchBox = document.createElement("input");
    this.searchBox.type = "text";
    this.searchBox.classList.add("searchBox");
    this.searchBox.placeholder = lang.search;

    this.searchBox.addEventListener("keyup", () => {
      this.searchLessons(this.searchBox.value);
    });
  }

  toCard(tabIndex = 0) {
    if(this.card == null) {
      this.createCard();
    }

    this.card.dom.tabIndex = tabIndex;
    return this.card.dom;
  }

  getLessonById(idlesson) {
    if(this.lessons == null) {
      return null;
    }

    return this.lessons.find((l) => {
      return l.idlesson == idlesson;
    });
  }

  retrieveLessons() {
    return request("lesson.php", {request:"list", idclass:this.idclass})
      .then((lessons) => {
        lessons.forEach((l) => {
          // Check if the lesson is already in memory
          let lesson = this.getLessonById(l.idlesson);
          if(lesson) {
            lesson.update(l);
          } else {
            this.lessons.push(new Lesson(l, this));
          }
        });
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  searchLessons(needle = "") {
    needle = needle.toLowerCase();
    this.lessons.forEach((lesson, index) => {
      if(needle == "" || lesson.contains(needle)) {
        lesson.card.show();
      } else {
        lesson.card.hide();
      }
    });

  }

  show() {
    return this.retrieveLessons().then(() => {
      UI.display(this.listLessons(), br(), UI.btnHome.btn, this.btnAddLesson.btn);
      document.title = `${this.name} | Lesson Player`;
    });
  }

  resume() {
    return this.dbGetNext().then(() => {
      if(this.nextLesson == null) {
        Message.view(lang.classCompleted);
      } else {
        this.nextLesson.play();
      }
    });
  }

  listLessons() {
    var lessons = document.createElement("div");
    lessons.classList.add("cards");

    lessons.appendChild(this.searchBox);
    lessons.appendChild(br());

    this.lessons = this.lessons.filter((lesson) => !lesson.removed);
    this.lessons.sort(Lesson.compareByDated);

    for(let i = 0; i < this.lessons.length; i++) {
      lessons.appendChild(this.lessons[i].toCard(i + 2));
    }

    return lessons;
  }

  edit() {
    Class.form(this);
  }

  newLesson() {
    Lesson.form(Lesson.dummy(this));
  }

  askToRemove() {
    Message.view(this.dictionaryReplace(lang.removeThisClass), true, lang.remove).then(() => {
      this.dbRemove();
    }).catch(() => {
      console.log(lang.classNotRemoved);
    });
  }

  dbRemove() {
    let data = {request: "remove", idclass: this.idclass};
    return request("class.php", data)
      .then((_response) => {
        this.removed = true;
        UI.listClasses();
        Message.view(this.dictionaryReplace(lang.classRemoved));
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  askToDelete() {
    Message.view(this.dictionaryReplace(lang.deleteThisClass), true, lang.delete).then(() => {
      this.dbDelete();
    }).catch(() => {
      console.log(lang.classNotDeleted);
    });
  }

  dbDelete() {
    let data = {request: "delete", idclass: this.idclass};
    return request("class.php", data)
      .then((_response) => {
        this.removed = true; // To be changed later
        UI.listClasses();
        Message.view(this.dictionaryReplace(lang.classDeleted));
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  dbGetNext() {
    return request("lesson.php", {request:"getNext", idclass:this.idclass})
      .then((_lesson) => {
        if(_lesson == null) {
          this.nextLesson = null;
          return;
        }

        this.nextLesson = this.getLessonById(_lesson.idlesson);
        if(this.nextLesson) {
          this.nextLesson.update(_lesson);
        } else {
          let i = this.lessons.push(new Lesson(_lesson, this));
          this.nextLesson = this.lessons[i - 1];
        }
      });
  }

  dbEdit(_data) {
    _data.request = "edit";
    _data.idclass = this.idclass;
    return request("class.php", _data)
      .then((_class) => {
        _class.nLessons = this.nLessons;
        _class.nWatched = this.nWatched;
        this.update(_class);

        Message.view(this.dictionaryReplace(lang.classEdited));
        UI.listClasses();
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }
}
