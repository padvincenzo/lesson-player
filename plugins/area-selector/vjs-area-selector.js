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

function areaSelector(options) {
  const background = document.createElement("div");
  background.classList.add("vjs-area-selector-background");

  const rectangle = {};
  rectangle.dom = document.createElement("div");
  rectangle.dom.hidden = true;
  rectangle.dom.classList.add("vjs-area-selector-rectangle");

  background.appendChild(rectangle.dom);
  this.el().appendChild(background);

  this.ready(() => {
    this.el().querySelector(".vjs-fullscreen-control").style.order = 5;
  });

  rectangle.coordinates = {
    offset: {width: 0, height: 0},  // player wrapper's getBoundingClientRect()
    video: {width: 0, height: 0},   // video's absolute width and height
    x1: 0, x2: 0, y1: 0, y2: 0,
    left: function() {
      return Math.min(this.x1, this.x2);
    },
    top: function() {
      return Math.min(this.y1, this.y2);
    },
    width: function() {
      return Math.max(this.x1, this.x2) - this.left();
    },
    height: function() {
      return Math.max(this.y1, this.y2) - this.top();
    },
    relativeWidth: function() {
      return this.offset.width / this.width();
    },
    relativeHeight: function() {
      return this.offset.height / this.height();
    },
    relativeLeft: function() {
      return this.left() / this.width();
    },
    relativeTop: function() {
      return this.top() / this.height();
    },
    absoluteWidth: function() {
      return this.width() * this.video.width / this.offset.width;
    },
    absoluteHeight: function() {
      return this.height() * this.video.height / this.offset.height;
    },
    absoluteLeft: function() {
      return this.left() * this.video.width / this.offset.width;
    },
    absoluteTop: function() {
      return this.top() * this.video.width / this.offset.width;
    },
    get: function() {
      return {
        left: this.left(),
        top: this.top(),
        width: this.width(),
        height: this.height(),
        relativeLeft: this.relativeLeft(),
        relativeTop: this.relativeTop(),
        relativeWidth: this.relativeWidth(),
        relativeHeight: this.relativeHeight(),
        absoluteLeft: this.absoluteLeft(),
        absoluteTop: this.absoluteTop(),
        absoluteWidth: this.absoluteWidth(),
        absoluteHeight: this.absoluteHeight()
      };
    }
  };

  rectangle.update = () => {
    Object.assign(rectangle.dom.style, {
      top: `${rectangle.coordinates.top()}px`,
      left: `${rectangle.coordinates.left()}px`,
      width: `${rectangle.coordinates.width()}px`,
      height: `${rectangle.coordinates.height()}px`
    });
  };

  const listeners = ["mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend"];
  const handleEvent = (e) => {
    switch(e.type) {
      case "mousedown": {
        rectangle.dom.hidden = false;
        rectangle.coordinates.x1 = rectangle.coordinates.x2 = e.clientX - rectangle.coordinates.offset.x;
        rectangle.coordinates.y1 = rectangle.coordinates.y2 = e.clientY - rectangle.coordinates.offset.y;
        rectangle.update();
        break;
      }
      case "touchstart": {
        e.preventDefault();
        rectangle.dom.hidden = false;
        rectangle.coordinates.x1 = rectangle.coordinates.x2 = e.changedTouches[0].pageX - rectangle.coordinates.offset.x;
        rectangle.coordinates.y1 = rectangle.coordinates.y2 = e.changedTouches[0].pageY - rectangle.coordinates.offset.y;
        rectangle.update();
        break;
      }
      case "mousemove": {
        rectangle.coordinates.x2 = e.clientX - rectangle.coordinates.offset.x;
        rectangle.coordinates.y2 = e.clientY - rectangle.coordinates.offset.y;
        rectangle.update();
        break;
      }
      case "touchmove": {
        e.preventDefault();
        rectangle.coordinates.x2 = e.changedTouches[0].pageX - rectangle.coordinates.offset.x;
        rectangle.coordinates.y2 = e.changedTouches[0].pageY - rectangle.coordinates.offset.y;
        rectangle.update();
        break;
      }
      case "mouseup": {
        if(promise.resolve != null) {
          promise.resolve();
        }
        break;
      }
      case "touchend": {
        e.preventDefault();
        if(promise.resolve != null) {
          promise.resolve();
        }
        break;
      }
    }
  };

  const promise = {
    resolve: null,
    reject: null
  };

  this.select = () => {
    return new Promise((_resolve, _reject) => {
      rectangle.coordinates.offset = this.el().childNodes[0].getBoundingClientRect();
      rectangle.coordinates.video = {
        width: this.videoWidth(),
        height: this.videoHeight()
      };

      var wasPlaying = !this.paused();
      this.pause();
      this.userActive(true);
      this.controls(false);

      listeners.forEach((listener) => {
        background.addEventListener(listener, handleEvent, false);
      });

      background.style.display = "block";

      promise.resolve = () => {
        listeners.forEach((listener) => {
          background.removeEventListener(listener, handleEvent, false);
        });

        if(rectangle.coordinates.width() <= 1 || rectangle.coordinates.height() <= 1) {
          _reject("Nothing selected");
        } else {
          _resolve(rectangle.coordinates.get());
        }

        promise.resolve = promise.reject = null;

        if(wasPlaying) {
          this.play();
        }

        rectangle.dom.hidden = true;
        background.style.display = "none";
        this.controls(true);
      };

      promise.reject = (cause) => {
        listeners.forEach((listener) => {
          background.removeEventListener(listener, this, false);
        });

        _reject(cause);
        promise.resolve = promise.reject = null;

        if(wasPlaying) {
          this.play();
        }

        rectangle.dom.hidden = true;
        background.style.display = "none";
        this.controls(true);
      };
    });
  };

  this.cancelSelection = () => {
    if(promise.reject != null) {
      promise.reject("Canceled");
    }
  };

  this.isSelectingArea = () => {
    return background.style.display == "block";
  };
}

videojs.registerPlugin("areaSelector", areaSelector);
