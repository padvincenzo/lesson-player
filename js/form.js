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

class Form {
  wrapper = null;
  form = null;
  prefix = "";

  constructor() {
    this.wrapper = document.createElement("form");
    this.form = [];
    this.prefix = randomString() + "_";
  }

  appendLabel(_for, _text = "") {
    if(_text == "")
      return;

    const label = document.createElement("label");
    label.innerText = _text;
    if(_for != "")
      label.setAttribute("for", _for);
    this.wrapper.appendChild(label);
    return label;
  }

  appendText(_name = "", _value = "", _placeholder = "", _maxlength = 150) {
    let id = this.prefix + _name;
    this.appendLabel(id, _placeholder);
    const text = document.createElement("input");
    text.type = "text";
    text.name = _name;
    text.id = id;
    text.value = _value;
    text.placeholder = _placeholder;

    text.checkValidity = () => {
      return encodeString(text.value).length <= _maxlength;
    };

    this.wrapper.appendChild(text);
    this.form.push({name: _name, dom: text});
    return text;
  }

  appendDate(_name = "", _value = "", _placeholder = "Data") {
    let id = this.prefix + _name;
    this.appendLabel(id, _placeholder);
    const date = document.createElement("input");
    date.type = "date";
    date.name = _name;
    date.id = id;
    date.value = _value;

    date.checkValidity = () => {
      return true;
    };

    this.wrapper.appendChild(date);
    this.form.push({name: _name, dom: date});
    return date;
  }

  appendTextarea(_name = "", _value = "", _placeholder = "") {
    let id = this.prefix + _name;
    this.appendLabel(id, _placeholder);
    const text = document.createElement("textarea");
    text.name = _name;
    text.id = id;
    text.innerText = _value;

    text.checkValidity = () => {
      return true;
    };

    this.wrapper.appendChild(text);
    this.form.push({name: _name, dom: text});
    return text;
  }

  appendButton(_text, _click) {
    const btn = document.createElement("button");
    btn.innerText = _text;
    btn.type = "button";
    btn.addEventListener("click", _click);
    this.wrapper.appendChild(btn);
    return btn;
  }

  help(_message = "") {
    if(_message == "")
      return;

    const div = document.createElement("div");
    div.innerText = _message;
    this.wrapper.appendChild(div);
    return div;
  }

  values() {
    var values = {};
    var errors = [];

    for(let i = 0; i < this.form.length; i++) {
      let name = this.form[i].name;
      let obj = this.form[i].dom;

      if(! obj.validity.valid || ! obj.checkValidity()) {
        errors.push(name);
      } else {
        values[name] = encodeString(obj.value);
      }
    };

    if(errors.length > 0) {
      Message.view(`${lang.invalidData}: ${errors.join("; ")}.`);
      return null;
    }

    return values;
  }
}
