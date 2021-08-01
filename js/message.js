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

class Message {
  // static content;
  // static btnReject;
  // static btnResolve;
  // static wrapper;
  // static background;
  //
  // static currentResolve;
  // static currentReject;

  static init() {
    Message.background = document.createElement("div");
    Message.background.id = "msg_background";
    Message.background.style.display = "none";

    Message.wrapper = document.createElement("div");
    Message.wrapper.id = "msg_wrapper";

    Message.content = document.createElement("div");
    Message.content.id = "msg_content";

    Message.btnReject = document.createElement("button");
    Message.btnReject.innerText = lang.cancel;

    Message.btnResolve = document.createElement("button");

    Message.background.appendChild(Message.wrapper);
    Message.wrapper.appendChild(Message.content);
    Message.wrapper.appendChild(Message.btnReject);
    Message.wrapper.appendChild(Message.btnResolve);
    document.body.appendChild(Message.background);
  }

  static view(html = null, cancelable = false, resolveText = "", rejectText = "") {
    if(html == null) {
      return Promise.reject("Nothing to view.");
    }

    if(Message.isBusy()) {
      return Promise.reject("Busy.");
    }

    return new Promise((_resolve, _reject) => {
      // Set new reject and resolve
      Message.currentResolve = () => {
        Message.dismiss();
        _resolve();
      };
      Message.currentReject = (err = "Canceled") => {
        Message.dismiss();
        _reject(err);
      };

      if(typeof html === 'string' || html instanceof String) {
        Message.content.innerHTML = html;
      } else {
        try {
          Message.content.innerHTML = "";
          Message.content.appendChild(html);
        } catch(err) {
          // Something failed
          Message.currentReject(err);
          return;
        }
      }

      Message.btnResolve.innerText = resolveText == "" ? lang.ok : resolveText;

      if(cancelable) {
        Message.btnReject.innerText = rejectText == "" ? lang.cancel : rejectText;
        Message.btnReject.style.display = "inline-block";
        Message.btnReject.addEventListener("click", Message.currentReject);
        Message.btnResolve.addEventListener("click", Message.currentResolve);
      } else {
        Message.btnReject.style.display = "none";
        Message.btnResolve.addEventListener("click", Message.currentResolve);
      }

      Message.wrapper.style.display = "inline-block";
      Message.background.style.display = "block";

      if(cancelable) {
        Message.btnReject.focus();
      } else {
        Message.btnResolve.focus();
      }
    });
  }

  static isBusy() {
    return Message.background.style.display == "block";
  }

  static dismiss() {
    Message.background.style.display = "none";
    Message.content.innerHTML = "";

    // Remove old reject and resolve
    Message.btnReject.removeEventListener("click", Message.currentReject);
    Message.currentReject = null;
    Message.btnResolve.removeEventListener("click", Message.currentResolve);
    Message.currentResolve = null;
  }

  static isCancelable() {
    return Message.btnReject.style.display == "inline-block";
  }

  static close() {
    if(! Message.isBusy()) {
      return;
    }

    if(Message.isCancelable()) {
      Message.currentReject();
    } else {
      Message.currentResolve();
    }
  }
}

window.addEventListener("load", Message.init, true);
