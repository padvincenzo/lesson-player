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

function lessonOverlay(options) {
  const dom = document.createElement("div");
  dom.classList.add("vjs-lesson-overlay");

  const data = {};

  if(options.data) {
    options.data.forEach((id) => {
      data[id] = document.createElement("div");
      data[id].classList.add(id);
      dom.appendChild(data[id]);
    });
  }

  this.el().appendChild(dom);

  var doNotShowIf = options.doNotShowIf ?? null;

  this.lessonOverlay = {
    enabled: true,
    update: (_data) => {
      for(const id in data) {
        data[id].innerText = _data[id] ?? "";
      }
    },
    hide: () => {
      dom.style.display = "none";
    },
    show: () => {
      if(this.lessonOverlay.enabled && (doNotShowIf == null || !doNotShowIf())) {
        dom.style.display = "flex";
      }
    },
    toggle: () => {
      this.userActive(true);
      if(this.lessonOverlay.enabled) {
        this.lessonOverlay.enabled = false;
        this.lessonOverlay.hide();
      } else {
        this.lessonOverlay.enabled = true;
      }

      return this.lessonOverlay.enabled;
    }
  };

  dom.addEventListener("click", () => {
    this.lessonOverlay.hide();
    this.play();
    this.userActive(true);
  });

  this.on("useractive", () => {
    this.lessonOverlay.hide();
  });

  this.on("userinactive", () => {
    if(this.paused()) {
      this.lessonOverlay.show();
    } else {
      // do nothing
    }
  });

  this.on("pause", () => {
    this.userActive(true);
  });

  this.on("play", () => {
    this.userActive(true);
  });
}

videojs.registerPlugin("lessonOverlay", lessonOverlay);
