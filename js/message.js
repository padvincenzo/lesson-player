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
  static content = null;
  static btn_cancel = null;
  static btn_dismiss = null;
  static wrapper = null;
  static background = null;

  static init() {
    Message.background = document.createElement("div");
    Message.background.setAttribute("id", "msg_background");
    Message.background.style.display = "none";

    Message.wrapper = document.createElement("div");
    Message.wrapper.setAttribute("id", "msg_wrapper");

    Message.content = document.createElement("div");
    Message.content.setAttribute("id", "msg_content");

    Message.btn_cancel = document.createElement("button");
    Message.btn_cancel.setAttribute("id", "msg_cancel");
    Message.btn_cancel.innerText = lang.cancel;
    Message.btn_cancel.setAttribute("onclick", "Message.dismiss();");

    Message.btn_dismiss = document.createElement("button");
    Message.btn_dismiss.setAttribute("id", "msg_dismiss");
    Message.btn_dismiss.innerText = lang.ok;
    Message.btn_dismiss.setAttribute("onclick", "Message.dismiss();");

    Message.background.appendChild(Message.wrapper);
    Message.wrapper.appendChild(Message.content);
    Message.wrapper.appendChild(Message.btn_cancel);
    Message.wrapper.appendChild(Message.btn_dismiss);
    document.body.appendChild(Message.background);
  }

  static view(msg, cancelable = false) {
    Message.content.innerHTML = msg;
    Message.btn_cancel.style.display = cancelable ? "inline-block" : "none";
    Message.btn_dismiss.onclick = Message.dismiss;

    Message.wrapper.style.display = "inline-block";
    Message.background.style.display = "block";

    Message.btn_dismiss.focus();
  }

  static dismiss() {
    Message.background.style.display = "none";
    Message.btn_cancel.onclick = null;
    Message.btn_dismiss.onclick = null;
  }
}

window.addEventListener("load", Message.init, true);
