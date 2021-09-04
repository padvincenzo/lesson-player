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
  // wrapper, form;

  constructor() {
    this.wrapper = document.createElement("form");
    this.form = [];
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

  appendText(_name = "", _value = "", _placeholder = "", _maxlength = 150, _prefix = "") {
    this.appendLabel(_name, _placeholder);
    const text = document.createElement("input");
    text.type = "text";
    text.name = _name;
    text.value = _value;
    text.placeholder = _placeholder;

    text.checkValidity = () => {
      return encodeString(text.value).length <= _maxlength;
    };

    if(_prefix == "") {
      this.wrapper.appendChild(text);
    } else {
      let wrapper = document.createElement("span");
      wrapper.classList.add("inputWrapper");
      let span = document.createElement("span");
      span.innerText = _prefix;
      wrapper.appendChild(span);
      wrapper.appendChild(text);
      this.wrapper.appendChild(wrapper);
    }

    this.form.push({name: _name, dom: text});
    return text;
  }

  appendDate(_name = "", _value = "", _placeholder = "Data") {
    this.appendLabel(_name, _placeholder);
    const date = document.createElement("input");
    date.type = "date";
    date.name = _name;
    date.value = _value;

    date.checkValidity = () => {
      return true;
    };

    this.wrapper.appendChild(date);
    this.form.push({name: _name, dom: date});
    return date;
  }

  appendTextarea(_name = "", _value = "", _placeholder = "", _maxlength = 10000) {
    this.appendLabel(_name, _placeholder);
    const text = document.createElement("textarea");
    text.name = _name;
    text.innerText = _value;

    text.checkValidity = () => {
      return text.innerText.length <= _maxlength;
    };

    this.wrapper.appendChild(text);
    this.form.push({name: _name, dom: text});
    return text;
  }

  appendSelect(_name, _values = [], _placeholder = "") {
    this.appendLabel(_name, _placeholder);
    const wrapper = document.createElement("select");
    wrapper.name = _name;

    for(let i = 0; i < _values.length; i++) {
      let option = document.createElement("option");
      option.value = _values[i].value;
      option.innerText = _values[i].hasOwnProperty("text") ? _values[i].text : _values[i].value;
      option.selected = _values[i].hasOwnProperty("selected") ? _values[i].selected : false;
      wrapper.appendChild(option);
    }

    wrapper.checkValidity = () => {
      return true;
    };

    this.wrapper.appendChild(wrapper);
    this.form.push({name: _name, dom: wrapper});
    return wrapper;
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
    }

    if(errors.length > 0) {
      Message.view(`${lang.errInvalidData}: ${errors.join("; ")}.`);
      return null;
    }

    return values;
  }
}
