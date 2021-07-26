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

const DEBUG = false; // If set to TRUE, you will see data sent from/to the server, in the console.

window.addEventListener("load", () => {
  Player.init();
  UI.init();
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
    var json = JSON.stringify(_data);

    if(DEBUG)
      console.log(`Sending ${json} to ${_to}`);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        try {

          if(DEBUG)
            console.log(`Received ${xhr.responseText} from ${_to}`);

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

    xhr.open("POST", `ajax/${_to}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
  });
}

function encodeString(_string) {
  let output = "";
  try {
    output = encodeURIComponent(_string).replace(/[!'\(\)]/g, escape);
  }
  catch(err) {
    console.log(`Failed to encode: "${_string}"`);
  }
  finally {
    return output;
  }
}

function decodeString(_string) {
  let output = "";
  try {
    output = decodeURIComponent(_string);
  }
  catch(err) {
    console.log(`Failed to decode: "${_string}"`);
  }
  finally {
    return output;
  }
}

function randomString(_length = 4) {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let str = "";
  for (let i = 0; i < _length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}

function popup(url, w = 400, h = 300) {
  let left = (screen.width) ? (screen.width - w) / 2 : 10;
  let top = (screen.height) ? (screen.height - h) / 2 : 10;
  let popupWindow = window.open(url, 'popupWindow', `height=${h},width=${w},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no`);
}

function limit(_x, _min, _max) {
  if(+_x < +_min) return +_min;
  if(+_x > +_max) return +_max;
  return +_x;
}

function secondsToTime(seconds) {
  let hours = (Math.floor(seconds / 3600)).toString().padStart(2, "0");
  seconds %= 3600;
  let minutes = (Math.floor(seconds / 60)).toString().padStart(2, "0");
  seconds = (seconds % 60).toFixed(2).padStart(5, "0");
  return `${hours}:${minutes}:${seconds}`;
}

const dateDictionary = {
  "{YYYY}": (r) => r.substring(0, 4),
  "{YY}": (r) => r.substring(2, 4),
  "{MM}": (r) => r.substring(5, 7),
  "{M}": (r) => +r.substring(5, 7),
  "{DD}": (r) => r.substring(8),
  "{D}": (r) => +r.substring(8)
};

function formatDate(date) {
  if(lang.dateFormat == "default")
    return date;

  return dictionaryReplace(dateDictionary, lang.dateFormat, date);
}

function dictionaryReplace(dictionary, string, r = null) {
  return string.replace(/\{[A-Z]+\}/gi, (key) => {
    return dictionary.hasOwnProperty(key) ? dictionary[key](r) : key;
  });
}

function br() {
  return document.createElement("br");
}

function range(min = 0, max = 10, gap = 1, decimals = 0) {
  let n = Math.floor((max - min) / gap) + 1;
  return [...Array(n).keys()].map(x => (x * gap + min).toFixed(decimals));
}
