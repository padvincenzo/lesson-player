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
  // static classes, btnNewClass;

  static retrieve() {
    if(Class.classes == null || Class.classes == undefined) {
      Class.classes = [];
    }

    if(Class.btnNewClass == null || Class.btnNewClass == undefined) {
      Class.btnNewClass = createButton(lang.newClass, () => {
        Class.form(Class.dummy());
      }, "btnAdd");
    }

    return request("class.php", {request: "list"})
      .then((classes) => {
        classes.forEach((c, i) => {
          // Check if the class is already in memory
          let existingClass = Class.getById(c.idclass);
          if(existingClass) {
            existingClass.update(c);
          } else {
            Class.classes.push(new Class(c));
          }
        });
      })
      .catch((message) => {
        if(message == lang.notYetInstalled) {
          Message.text(lang.notYetInstalled, true, lang.install).then(() => {
            window.location.href = "install.php";
          }).catch(() => {
            // do nothing
          })
        } else {
          Message.text(`FAIL: ${message}`);
        }
      });
  }

  static viewRemoved() {
    var removedClasses = [];

    return request("class.php", {request: "listRemoved"})
      .then((classes) => {
        classes.forEach((c, i) => {
          removedClasses.push(new Class(c));
        });

        var cards = document.createElement("div");
        cards.classList.add("cards");

        let title = document.createElement("h2");
        title.innerText = lang.trashBin;
        cards.appendChild(title);

        for(let i = 0; i < removedClasses.length; i++) {
          cards.appendChild(removedClasses[i].toCard());
        }

        Message.view(cards);
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
    return new Class({
      idclass: null,
      name: "",
      professor: "",
      directory: ""
    });
  }

  static isDummy(_class) {
    return _class.idclass == null;
  }

  static form(_class) {
    const form = new Form();

    form.insertTitle(Class.isDummy(_class) ? lang.newClass : lang.editClass);
    form.appendText("className", _class.name, lang.className);
    form.appendText("professor", _class.professor, lang.professor);
    var directory = form.appendText("directory", _class.directory, lang.classDirectory);

    directory.addEventListener("focusout", () => {
      if(directory.value != "" && directory.value.slice(-1) != "/")
        directory.value += "/";
    });

    // Permanently delete class will reappear when trash bin will be ready
    // if(! Class.isDummy(_class)) {
    //   form.appendButton(lang.delete, () => {
    //     _class.askToDelete();
    //   });
    // }

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
        Message.text(c.dictionaryReplace(lang.classAdded), true, lang.newClass, lang.close).then(() => {
          Class.form(Class.dummy());
        }).catch(() => {
          // do nothing
        });
      })
      .catch((_message) => {
        Message.text(`${lang.failed}: ${_message}`);
      });
  }


  // idclass, name, professor, directory, lessons, nLessons, nWatched;
  // card, removed, searchBox;
  // btnResume, btnEdit, btnShow, btnAddLesson, btnRemove, btnRestore;
  // nextLesson;

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
    this.removed = _data.removed == true;

    if(!Player.unavailable() && this.isPlaying()) {
      Player.updateOverlay();
    }

    if(this.card != null) {
      this.card.name.innerText = this.name;
      this.card.professor.innerText = this.professor;
      this.card.progress.innerText = this.dictionaryReplace(lang.classProgress);
    }
  }

  isPlaying() {
    return !Player.unavailable() && Player.lesson.idclass == this.idclass;
  }

  // Currently, reference variable r is not used
  dictionary(r) {
    return {
      "{className}": (r) => this.name,
      "{classProfessor}": (r) => this.professor,
      "{classDirectory}": (r) => this.directory,
      "{nLessons}": (r) => this.nLessons,
      "{nWatched}": (r) => this.nWatched,
      "{percentage}": (r) => Math.ceil(this.percentage) + "%"
    };
  }

  dictionaryReplace(string, r = null) {
    return dictionaryReplace(this.dictionary(r), string, r);
  }

  isEqualTo(anotherClass) {
    return this.idclass == anotherClass.idclass;
  }

  get percentage() {
    return this.nLessons == 0 ? 0 : (this.nWatched / this.nLessons * 100);
  }

  createCard() {
    if(this.card != null) {
      // The card already exists
      return;
    }

    this.btnAddLesson = createButton(lang.newLesson, () => { this.newLesson(); }, "btnAdd");
    this.btnRemovedLessons = createButton(lang.trashBin, () => { this.viewRemovedLessons(); }, "btnRemove");

    this.btnResume = createSmallButton(lang.resume, () => { this.resume(); }, "btnPlay");
    this.btnEdit = createSmallButton(lang.edit, () => { this.edit(); }, "btnEdit");
    this.btnShow = createSmallButton(lang.show, () => { this.show(); }, "btnShow");
    this.btnRemove = createSmallButton(lang.remove, () => { this.askToRemove(); }, "btnRemove");
    this.btnRestore = createSmallButton(lang.restore, (e) => { this.dbRestore(e); }, "btnRestore");

    this.card = {};

    this.card.dom = document.createElement("div");
    this.card.dom.classList.add("card", "class");
    if(this.removed) {
      this.card.dom.classList.add("removed");
    }

    this.card.name = document.createElement("div");
    this.card.name.innerText = this.name;
    this.card.dom.appendChild(this.card.name);

    this.card.professor = document.createElement("div");
    this.card.professor.innerText = this.professor;
    this.card.dom.appendChild(this.card.professor);

    this.card.progress = document.createElement("div");
    this.card.progress.innerText = this.dictionaryReplace(lang.classProgress);
    this.card.progress.classList.add("progress");
    this.card.dom.appendChild(this.card.progress);

    this.card.buttons = document.createElement("div");
    this.card.buttons.setAttribute("class", "buttons");
    this.card.buttons.appendChild(this.btnShow);
    this.card.buttons.appendChild(this.btnResume);
    this.card.buttons.appendChild(this.btnEdit);
    this.card.buttons.appendChild(this.btnRemove);
    this.card.buttons.appendChild(this.btnRestore);
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
    this.searchBox.placeholder = this.dictionaryReplace(lang.search);

    this.searchBox.addEventListener("keyup", () => {
      this.searchLessons(this.searchBox.value);
    });
  }

  toCard(tabIndex = 0) {
    if(this.card == null || this.card == undefined) {
      this.createCard();
    }

    this.card.dom.tabIndex = tabIndex;

    if(this.removed && !this.card.dom.classList.contains("removed")) {
      this.card.dom.classList.add("removed");
    }
    if(!this.removed && this.card.dom.classList.contains("removed")) {
      this.card.dom.classList.remove("removed");
    }

    return this.card.dom;
  }

  getLessonById(idlesson) {
    if(this.lessons == null || this.lessons == undefined) {
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
        Message.text(`${lang.failed}: ${_message}`);
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
      UI.display(this.listLessons(), br(), UI.btnHome, this.btnAddLesson, this.btnRemovedLessons);
    });
  }

  resume() {
    return this.dbGetNext().then(() => {
      if(this.nextLesson == null || this.nextLesson == undefined) {
        Message.text(this.dictionaryReplace(lang.classCompleted));
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

  viewRemovedLessons() {
    var removedLessons = [];

    return request("lesson.php", {request:"listRemoved", idclass:this.idclass})
      .then((lessons) => {
        lessons.forEach((l) => {
          removedLessons.push(new Lesson(l, this));
        });

        var cards = document.createElement("div");
        cards.classList.add("cards");

        let title = document.createElement("h2");
        title.innerText = lang.trashBin;
        cards.appendChild(title);

        for(let i = 0; i < removedLessons.length; i++) {
          cards.appendChild(removedLessons[i].toCard());
        }

        Message.view(cards);
      });
  }

  edit() {
    Class.form(this);
  }

  newLesson() {
    Lesson.form(Lesson.dummy(this));
  }

  askToRemove() {
    Message.text(this.dictionaryReplace(lang.removeThisClass), true, lang.remove).then(() => {
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
        Message.text(this.dictionaryReplace(lang.classRemoved), true, lang.restore, lang.ok)
          .then(() => {
            this.dbRestore();
          }).catch(() => {
            // Do nothing
          });
      })
      .catch((_message) => {
        Message.text(`${lang.failed}: ${_message}`);
      });
  }

  dbRestore(e) {
    let data = {request: "restore", idclass: this.idclass};
    return request("class.php", data)
      .then((_response) => {
        this.removed = false;
        if(e) {
          // Hide the card from trash bin's message window
          e.target.parentNode.parentNode.style.display = "none";
        }
        UI.listClasses();
        console.log(this.dictionaryReplace(lang.classRestored));
      })
      .catch((_message) => {
        console.log(`${lang.failed}: ${_message}`);
      });
  }

  askToDelete() {
    Message.text(this.dictionaryReplace(lang.deleteThisClass), true, lang.delete).then(() => {
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
        Message.text(this.dictionaryReplace(lang.classDeleted));
      })
      .catch((_message) => {
        Message.text(`${lang.failed}: ${_message}`);
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
        Message.text(this.dictionaryReplace(lang.classEdited));
      })
      .catch((_message) => {
        Message.text(`${lang.failed}: ${_message}`);
      });
  }
}
