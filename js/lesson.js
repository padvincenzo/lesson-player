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
  playbackRate = 1.5;

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
    this.parentClass = _class;

    this.btnPlay = Button.small(this.mark == 0 ? lang.play : lang.resume, () => { this.play(); });
    this.btnEdit = Button.small(lang.edit, () => { Lesson.form(this); });
  }

  url() {
    return this.parentClass.directory + this.filename;
  }

  toLine() {
    const tr = document.createElement("tr");

    const dated = document.createElement("td");
    dated.innerText = this.dated;

    const title = document.createElement("td");
    title.innerText = this.title;

    const professor = document.createElement("td");
    professor.innerText = this.professor;

    const progress = document.createElement("td");
    progress.innerText = this.watched == true ? lang.watched : (this.mark > 0 ? lang.started : lang.toBeWatched);

    const buttons = document.createElement("td");
    buttons.appendChild(this.btnPlay.btn);
    buttons.appendChild(this.btnEdit.btn);

    tr.appendChild(dated);
    tr.appendChild(title);
    tr.appendChild(professor);
    tr.appendChild(progress);
    tr.appendChild(buttons);

    return tr;
  }

  play(_autoplay = true) {
    this.dbGetSilences().then(() => {
      Player.load(this, _autoplay);
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
      class: _class
    };
  }

  static isDummy(_lesson) {
    return _lesson.idlesson == null;
  }

  static form(_lesson) {
    const form = new Form();
    form.appendDate("dated", _lesson.dated, lang.dated);
    form.appendText("title", _lesson.title, lang.title);
    form.appendText("professor", _lesson.professor, lang.professor);
    form.appendText("filename", _lesson.filename, lang.filename);
    form.appendTextarea("silences", "", lang.ffmpegOutput);
    form.appendLabel("", "$ ffmpeg -hide_banner -nostats -vn -i <FILE> -af silencedetect=n=0.002:d=2 -f null -");

    form.appendButton(lang.confirm, () => {
      if(Lesson.isDummy(_lesson)) {
        Lesson.dbAdd(form.values(), _lesson.class);
      } else {
        _lesson.dbEdit(form.values());
      }
    });

    UI.display(form.wrapper);
    UI.append(UI.btnHome.btn);
  }

  static dbAdd(_data, _class) {
    _data.request = "add";
    _data.idclass = _class.idclass;
    return request("lesson.php", _data)
      .then((_lesson) => {
        _class.lessons[_lesson.idlesson] = new Lesson(_lesson, _class);
        Message.view(lang.lessonAdded);
      })
      .catch((_message) => {
        Message.view("FAILED: " + _message);
      })
      .then(() => {
        _class.show();
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
        Message.view("FAILED edit: " + _message);
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
}
