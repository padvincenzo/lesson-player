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

function notifier(options) {
  const dom = document.createElement("div");
  dom.classList.add("vjs-notice");
  this.el().appendChild(dom);

  const defaultTimeout = options.defaultTimeout ?? 1500;
  var noticeTimeout = null;

  this.notify = (notice, timeout) => {
    if(noticeTimeout != null) {
      clearTimeout(noticeTimeout)
    }

    dom.innerHTML = notice;
    dom.style.display = "inline-block";

    noticeTimeout = setTimeout(() => {
      dom.style.display = "none";
      dom.innerText = "";
    }, timeout ?? defaultTimeout);
  };
}

videojs.registerPlugin("notifier", notifier);
