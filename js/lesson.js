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
    return {
      idlesson: null,
      idclass: _class.idclass,
      dated: "",
      title: "",
      professor: _class.professor,
      filename: "",
      parentClass: _class
    };
  }

  static isDummy(_lesson) {
    return _lesson.idlesson == null;
  }

  static form(_lesson) {
    var form = new Form();
    var dated = form.appendDate("dated", _lesson.dated, lang.dated);
    var title = form.appendText("title", _lesson.title, lang.title);
    form.appendText("professor", _lesson.professor, lang.professor);
    var filename = form.appendText("filename", _lesson.filename, lang.filename);
    form.appendTextarea("silences", "", lang.ffmpegOutput);
    let url = Lesson.isDummy(_lesson) ? "<FILE>" : _lesson.url();
    var code = form.help(`${lang.ffmpegCopyPaste}: $ ffmpeg -hide_banner -nostats -vn -i "${url}" -af silencedetect=n=0.002:d=2.3 -f null -`);

    form.appendButton(lang.confirm, () => {
      let values = form.values();
      if(values == null) {
        return;
      }

      if(Lesson.isDummy(_lesson)) {
        Lesson.dbAdd(values, _lesson.parentClass);
      } else {
        _lesson.dbEdit(values);
      }
    });

    form.appendButton(lang.cancel, () => {
      _lesson.parentClass.show();
    });

    dated.addEventListener("focusout", () => {
      if(title.value == "" && dated.value != "") {
        title.value = lang.defaultLessonTitle.replace("{dated}", formatDate(dated.value));
      }
    });

    filename.addEventListener("focusout", () => {
      let url = filename.value == "" ? "<FILE>" : _lesson.parentClass.directory + filename.value;
      code.innerText = `${lang.ffmpegCopyPaste}: $ ffmpeg -hide_banner -nostats -vn -i "${url}" -af silencedetect=n=0.002:d=2.3 -f null -`;
    });

    UI.display(form.wrapper, UI.btnHome.btn);
  }

  static dbAdd(_data, _class) {
    _data.request = "add";
    _data.idclass = _class.idclass;
    return request("lesson.php", _data)
      .then((_lesson) => {
        _class.lessons.push(new Lesson(_lesson, _class));
        Message.view(lang.lessonAdded);
        Lesson.form(Lesson.dummy(_class));
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      });
  }

  static compareByDate(l1, l2) {
    if(l1.dated < l2.dated)
      return -1;
    if(l1.dated > l2.dated)
      return 1;

    return l1.idlesson - l2.idlesson;
  }

  idlesson = null;
  idclass = null;
  dated = null;
  title = null;
  professor = null;
  lastPlayed = null;
  mark = null;
  watched = null;
  filename = null;
  parentClass = null;
  silences = null;
  playbackRate = null;

  card = null;

  btnPlay = null;
  btnEdit = null;
  btnSetAsWatched = null;
  btnSetToBeWatched = null;

  constructor(_data, _class) {
    this.idlesson = _data.idlesson;
    this.parentClass = _class;

    this.idclass = _data.idclass;
    this.lastPlayed = _data.lastPlayed;
    this.mark = _data.mark;
    this.watched = _data.watched == true;
    this.playbackRate = _data.playbackRate;

    this.update(_data);
  }

  update(_data) {
    this.dated = _data.dated;
    this.title = decodeURIComponent(_data.title);
    this.professor = decodeURIComponent(_data.professor);
    this.filename = decodeURIComponent(_data.filename);

    if(this.card != null) {
      this.card.title.innerText = this.title;
      this.card.professor.innerText = this.professor;
    }
  }

  url() {
    return this.parentClass.directory + this.filename;
  }

  createCard() {
    if(this.card != null) {
      return;
    }

    this.btnPlay = Button.small(this.mark == 0 ? lang.play : lang.resume, () => { this.play(); });
    this.btnEdit = Button.small(lang.edit, () => { Lesson.form(this); });
    this.btnSetAsWatched = Button.small(lang.setAsWatched, () => { this.dbSetAsWatched(); });
    this.btnSetToBeWatched = Button.small(lang.setToBeWatched, () => { this.dbSetToBeWatched(); });

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
      if(e.code == "Enter") {
        this.play();
      }
    });
  }

  toCard(tabIndex = 0) {
    if(this.card == null) {
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
      this.parentClass.nextLesson.play();
    });
  }

  getSilenceFromTimestamp(timestamp) {
    if(this.silences == null)
      return null;

    let silence = this.silences.filter((s) => {
      return s.t_start <= timestamp && s.t_end >= timestamp;
    });

    return silence.length == 1 ? silence[0] : null;
  }

  isInSilence(timestamp) {
    return this.getSilenceFromTimestamp(timestamp) != null;
  }

  getEndOfSilence(timestamp) {
    let silence = this.getSilenceFromTimestamp(timestamp);
    return silence != null ? silence.t_end : null;
  }

  dbEdit(_data) {
    _data.request = "edit";
    _data.idlesson = this.idlesson;
    return request("lesson.php", _data)
      .then((_lesson) => {
        this.update(_lesson);

        Message.view(lang.lessonEdited);
        this.parentClass.show();
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
    this.playbackRate = _rate;
    return request("lesson.php", {request: "rate", idlesson: this.idlesson, rate: this.playbackRate});
  }
}
