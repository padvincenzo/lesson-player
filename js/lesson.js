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

  btnPlay = null;
  btnEdit = null;

  constructor(_data, _class) {
    this.idlesson = _data.idlesson;
    this.idclass = _data.idclass;
    this.dated = _data.dated;
    this.title = _data.title;
    this.professor = _data.professor;
    this.lastPlayed = _data.lastPlayed;
    this.mark = _data.mark;
    this.watched = _data.watched;
    this.filename = _data.filename;
    this.playbackRate = _data.playbackRate;
    this.parentClass = _class;

    this.btnPlay = Button.small(this.mark == 0 ? lang.play : lang.resume, () => { this.play(); });
    this.btnEdit = Button.small(lang.edit, () => { Lesson.form(this); });
  }

  url() {
    return this.parentClass.directory + this.filename;
  }

  toCard() {
    const card = document.createElement("div");
    card.setAttribute("class", "card lesson");

    // const dated = document.createElement("div");
    // dated.innerText = this.dated;

    const cardTitle = document.createElement("div");
    cardTitle.setAttribute("class", "title");

    const title = document.createElement("div");
    title.innerText = this.title;
    const professor = document.createElement("div");
    professor.innerText = this.professor;

    cardTitle.appendChild(title);
    cardTitle.appendChild(professor);

    const progress = document.createElement("div");
    progress.innerText = this.watched == true ? lang.watched : (this.mark > 0 ? lang.started : lang.toBeWatched);
    progress.setAttribute("class", "progress");

    const buttons = document.createElement("div");
    buttons.setAttribute("class", "buttons");
    buttons.appendChild(this.btnPlay.btn);
    buttons.appendChild(this.btnEdit.btn);

    // card.appendChild(dated);
    card.appendChild(cardTitle);
    card.appendChild(progress);
    card.appendChild(buttons);

    card.addEventListener("dblclick", () => {
      this.play();
    });

    card.addEventListener("keyup", (e) => {
      if(e.code == "Enter") {
        this.play();
      }
    });

    return card;
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

  isInSilence(_time) {
    if(this.silences == null)
      return false;

    return this.silences.filter((silence) => {
      if(silence.t_start <= _time && silence.t_end >= _time)
        return true;

      return false;
    }).length == 1;
  }

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
        Message.view(lang.invalidData);
        return;
      }

      if(Lesson.isDummy(_lesson)) {
        Lesson.dbAdd(values, _lesson.parentClass);
      } else {
        _lesson.dbEdit(values);
      }
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

    UI.display(form.wrapper);
    UI.append(UI.btnHome.btn);
  }

  static dbAdd(_data, _class) {
    _data.request = "add";
    _data.idclass = _class.idclass;
    console.log(_data.idclass);
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

  dbEdit(_data) {
    _data.request = "edit";
    _data.idlesson = this.idlesson;
    return request("lesson.php", _data)
      .then((_lesson) => {
        this.dated = _lesson.dated;
        this.title = _lesson.title;
        this.professor = _lesson.professor;
        this.filename = _lesson.filename;

        Message.view(lang.lessonEdited);
      })
      .catch((_message) => {
        Message.view(`${lang.failed}: ${_message}`);
      })
      .then(() => {
        this.parentClass.show();
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
    return request("lesson.php", {request: "mark", idlesson: this.idlesson, mark: _mark});
  }

  dbSetAsWatched() {
    this.watched = true;
    return request("lesson.php", {request: "setAsWatched", idlesson: this.idlesson});
  }

  dbRate(_rate) {
    this.playbackRate = _rate;
    return request("lesson.php", {request: "rate", idlesson: this.idlesson, rate: this.playbackRate});
  }
}
