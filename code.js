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
