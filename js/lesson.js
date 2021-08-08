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

class Lesson {

  static dummy(_class) {
    return new Lesson ({
      idlesson: null,
      idclass: _class.idclass,
      lastPlayed: "",
      mark: "",
      watched: false,
      playbackRate: "1",
      dated: "",
      title: "",
      professor: _class.professor,
      filename: ""
    }, _class);
  }

  static isDummy(_lesson) {
    return _lesson.idlesson == null;
  }

  static form(_lesson) {
    var form = new Form();
    var dated = form.appendDate("dated", _lesson.dated, lang.dated);
    var title = form.appendText("title", _lesson.title, lang.title);
    form.appendText("professor", _lesson.professor, lang.professor);
    var filename = form.appendText("filename", _lesson.filename, lang.filename, 200, _lesson.parentClass.directory);
    form.appendTextarea("silences", "", lang.ffmpegOutput);
    let url = Lesson.isDummy(_lesson) ? "<FILE>" : _lesson.url();
    var code = form.help(`${lang.ffmpegCopyPaste}: $ ffmpeg -hide_banner -nostats -vn -i "${url}" -af silencedetect=n=0.002:d=2.3 -f null -`);

    // Set the default value for the lesson title
    dated.addEventListener("focusout", () => {
      if(title.value == "" && dated.value != "") {
        title.value = _lesson.dictionaryReplace(lang.defaultLessonTitle, dated.value);
      }
    });

    // Change the value of <FILE> in the ffmpeg hint
    filename.addEventListener("focusout", () => {
      let url = filename.value == "" ? "<FILE>" : _lesson.parentClass.directory + filename.value;
      code.innerText = `${lang.ffmpegCopyPaste}: $ ffmpeg -hide_banner -nostats -vn -i "${url}" -af silencedetect=n=0.002:d=2.3 -f null -`;
    });

    Message.view(form.wrapper, true, lang.confirm).then(() => {
      let values = form.values();
      if(values == null) {
        return;
      }

      if(Lesson.isDummy(_lesson)) {
        Lesson.dbAdd(values, _lesson.parentClass);
        _lesson = undefined;
      } else {
        _lesson.dbEdit(values);
      }
    }).catch(() => {
      if(Lesson.isDummy(_lesson)) {
        _lesson = undefined;
      }
    })
  }

  static dbAdd(_data, _class) {
    _data.request = "add";
    _data.idclass = _class.idclass;
    return request("lesson.php", _data)
      .then((lessonData) => {
        var lesson = new Lesson(lessonData, _class);
        _class.lessons.push(lesson);
        _class.show();
        Message.view(lesson.dictionaryReplace(lang.lessonAdded), true, lang.newLesson, lang.close).then(() => {
          Lesson.form(Lesson.dummy(_class));
        }).catch(() => {
          // do nothing
        });
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  static compareByDated(l1, l2) {
    if(l1.dated < l2.dated)
      return -1;
    if(l1.dated > l2.dated)
      return 1;

    return l1.idlesson - l2.idlesson;
  }

  // idlesson, idclass, dated, title, professor, lastPlayed, mark, watched, filename, parentClass, silences, playbackRate;
  // card, removed;
  // btnPlay, btnEdit, btnSetAsWatched, btnSetToBeWatched;

  constructor(_data, _class) {
    this.idlesson = _data.idlesson;
    this.parentClass = _class;
    this.idclass = _data.idclass;
    this.lastPlayed = _data.lastPlayed;

    this.update(_data);
  }

  update(_data) {
    this.dated = _data.dated;
    this.title = decodeString(_data.title);
    this.professor = decodeString(_data.professor);
    this.filename = decodeString(_data.filename);
    this.mark = _data.mark;
    this.watched = _data.watched == true;
    this.playbackRate = (+_data.playbackRate).toFixed(1);

    if(!Player.unavailable() && this.isPlaying()) {
      Player.updateOverlay();
    }

    if(this.card != null) {
      this.card.title.innerText = this.title;
      this.card.professor.innerText = this.professor;
    }
  }

  isPlaying() {
    return !Player.unavailable() && Player.lesson.idlesson == this.idlesson;
  }

  dictionary(r) {
    return {
      "{lessonTitle}": (r) => this.title,
      "{lessonClass}": (r) => this.parentClass.name,
      "{lessonProfessor}": (r) => this.professor,
      "{lessonDated}": (r) => formatDate(r == null ? this.dated : r),
      "{lessonMark}": (r) => secondsToTime(this.mark)
    };
  }

  dictionaryReplace(string, r = null) {
    return dictionaryReplace(this.dictionary(r), string, r);
  }

  url() {
    return this.parentClass.directory + this.filename;
  }

  contains(str) {
    return (this.dated.search(str) != -1 || this.title.toLowerCase().search(str) != -1 || this.professor.toLowerCase().search(str) != -1 || this.filename.toLowerCase().search(str) != -1);
  }

  createCard() {
    if(this.card != null) {
      return;
    }

    this.btnPlay = Button.small(this.mark == 0 ? lang.play : lang.resume, () => { this.play(); });
    this.btnEdit = Button.small(lang.edit, () => { Lesson.form(this); });
    this.btnSetAsWatched = Button.small(lang.setAsWatched, () => { this.dbSetAsWatched(); });
    this.btnSetToBeWatched = Button.small(lang.setToBeWatched, () => { this.dbSetToBeWatched(); });
    this.btnRemove = Button.small(lang.remove, () => { this.askToRemove(); });

    this.card = {};

    this.card.dom = document.createElement("div");
    this.card.dom.classList.add("card", "lesson");

    this.card.title = document.createElement("div");
    this.card.title.innerText = this.title;
    this.card.title.classList.add("title");
    this.card.dom.appendChild(this.card.title);

    this.card.professor = document.createElement("div");
    this.card.professor.innerText = this.professor;
    this.card.professor.classList.add("professor");
    this.card.dom.appendChild(this.card.professor);

    this.card.progress = document.createElement("div");
    this.card.progress.innerText = this.watched ? lang.watched : (this.mark > 0 ? lang.started : lang.toBeWatched);
    this.card.progress.classList.add("progress");
    this.card.dom.appendChild(this.card.progress);

    this.card.buttons = document.createElement("div");
    this.card.buttons.setAttribute("class", "buttons");
    this.card.buttons.appendChild(this.btnPlay.btn);
    this.card.buttons.appendChild(this.btnEdit.btn);
    this.card.buttons.appendChild(this.btnSetToBeWatched.btn);
    this.card.buttons.appendChild(this.btnSetAsWatched.btn);
    this.card.buttons.appendChild(this.btnRemove.btn);
    this.card.dom.appendChild(this.card.buttons);

    if(this.watched) {
      this.card.dom.classList.add("watched");
      this.btnSetAsWatched.btn.style.display = "none";
    } else {
      this.btnSetToBeWatched.btn.style.display = "none";
    }

    this.card.dom.addEventListener("dblclick", () => {
      this.play();
    });

    this.card.dom.addEventListener("keyup", (e) => {
      switch(e.code) {
        case "Enter": {
          this.play();
          break;
        }
        case "Delete": {
          this.askToRemove();
          break;
        }
      }
    });

    // Hide the card
    this.card.hide = () => {
      this.card.dom.style.display = "none";
    }

    // Show the card
    this.card.show = () => {
      this.card.dom.style.display = "";
    }
  }

  toCard(tabIndex = 0) {
    if(this.card == null || this.card == undefined) {
      this.createCard();
    }

    this.card.dom.tabIndex = tabIndex;

    return this.card.dom;
  }

  play(_autoplay = true) {
    this.dbGetSilences().then(() => {
      Player.load(this, _autoplay);
    });
  }

  playNext() {
    this.parentClass.dbGetNext().then(() => {
      if(this.parentClass.nextLesson != null) {
        this.parentClass.nextLesson.play();
      } else {
        Message.view(lang.classCompleted);
      }
    });
  }

  getSilenceByTime(time) {
    if(this.silences == null || this.silences == undefined)
      return null;

    return this.silences.find((s) => {
      return +s.t_start <= +time && +s.t_end >= +time;
    });
  }

  isInSilence(time) {
    return this.getSilenceByTime(time) != undefined;
  }

  getEndOfSilence(time) {
    let silence = this.getSilenceByTime(time);
    return silence ? silence.t_end : null;
  }

  dbEdit(_data) {
    _data.request = "edit";
    _data.idlesson = this.idlesson;
    return request("lesson.php", _data)
      .then((_lesson) => {
        this.update(_lesson);
        Message.view(this.dictionaryReplace(lang.lessonEdited));
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  dbGetSilences() {
    return request("lesson.php", {request: "getSilences", idlesson: this.idlesson})
      .then((_silences) => {
        this.silences = _silences;
      })
  }

  dbMark(_mark) {
    this.mark = _mark;
    if(this.card != null && !this.watched) {
      this.btnPlay.btn.innerText = lang.resume;
      this.card.progress.innerText = lang.started;
    }
    return request("lesson.php", {request: "mark", idlesson: this.idlesson, mark: _mark});
  }

  dbSetToBeWatched() {
    this.watched = false;
    if(this.card != null) {
      this.card.dom.classList.remove("watched");
      this.btnSetAsWatched.btn.style.display = "inline-block";
      this.btnSetToBeWatched.btn.style.display = "none";
      this.card.progress.innerText = lang.toBeWatched;
      this.btnPlay.btn.innerText = lang.resume;
    }
    return request("lesson.php", {request: "setToBeWatched", idlesson: this.idlesson});
  }

  dbSetAsWatched() {
    this.watched = true;
    this.mark = 0;
    if(this.card != null) {
      this.card.dom.classList.add("watched");
      this.btnSetAsWatched.btn.style.display = "none";
      this.btnSetToBeWatched.btn.style.display = "inline-block";
      this.card.progress.innerText = lang.watched;
      this.btnPlay.btn.innerText = lang.play;
    }
    return request("lesson.php", {request: "setAsWatched", idlesson: this.idlesson});
  }

  dbRate(_rate) {
    this.playbackRate = (+_rate).toFixed(1);
    return request("lesson.php", {request: "rate", idlesson: this.idlesson, rate: this.playbackRate});
  }

  askToRemove() {
    Message.view(this.dictionaryReplace(lang.removeThisLesson), true, lang.remove).then(() => {
      this.dbRemove();
    }).catch(() => {
      console.log(lang.lessonNotRemoved);
    });
  }

  dbRemove() {
    let data = {request: "remove", idlesson: this.idlesson};
    return request("lesson.php", data)
      .then((_response) => {
        this.removed = true;
        this.parentClass.show();
        console.log(this.dictionaryReplace(lang.lessonRemoved));
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  askToDelete() {
    Message.view(this.dictionaryReplace(lang.deleteThisLesson), true, lang.delete).then(() => {
      this.dbDelete();
    }).catch(() => {
      console.log(lang.lessonNotDeleted);
    });
  }

  dbDelete() {
    let data = {request: "delete", idlesson: this.idlesson};
    return request("lesson.php", data)
      .then((_response) => {
        this.removed = true; // To be changed later
        this.parentClass.show();
        console.log(this.dictionaryReplace(lang.lessonDeleted));
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }
}
