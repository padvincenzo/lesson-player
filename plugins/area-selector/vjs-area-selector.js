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

  const dom = document.createElement("div");
  dom.hidden = true;
  dom.classList.add("vjs-area-selector");

  background.appendChild(dom);
  this.el().appendChild(background);

  const video = this.el().querySelector("video");

  const coordinates = {
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

  const update = () => {
    Object.assign(dom.style, {
      top: `${coordinates.top()}px`,
      left: `${coordinates.left()}px`,
      width: `${coordinates.width()}px`,
      height: `${coordinates.height()}px`
    });
  };

  const listeners = ["mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend"];

  const limit = {
    x: (x) => {
      if(x < coordinates.offset.left) {
        return coordinates.offset.left;
      }
      if(x > coordinates.offset.right) {
        return coordinates.offset.right;
      }
      return x;
    },
    y: (y) => {
      if(y < coordinates.offset.top) {
        return coordinates.offset.top;
      }
      if(y > coordinates.offset.bottom) {
        return coordinates.offset.bottom;
      }
      return y;
    }
  };

  const handleEvent = (e) => {
    switch(e.type) {
      case "mousedown": {
        dom.hidden = false;
        coordinates.x1 = coordinates.x2 = limit.x(e.clientX) - coordinates.offset.left;
        coordinates.y1 = coordinates.y2 = limit.y(e.clientY) - coordinates.offset.top;
        update();
        break;
      }
      case "touchstart": {
        e.preventDefault();
        dom.hidden = false;
        coordinates.x1 = coordinates.x2 = limit.x(e.changedTouches[0].pageX) - coordinates.offset.left;
        coordinates.y1 = coordinates.y2 = limit.y(e.changedTouches[0].pageY) - coordinates.offset.top;
        update();
        break;
      }
      case "mousemove": {
        coordinates.x2 = limit.x(e.clientX) - coordinates.offset.left;
        coordinates.y2 = limit.y(e.clientY) - coordinates.offset.top;
        update();
        break;
      }
      case "touchmove": {
        e.preventDefault();
        coordinates.x2 = limit.x(e.changedTouches[0].pageX) - coordinates.offset.left;
        coordinates.y2 = limit.y(e.changedTouches[0].pageY) - coordinates.offset.top;
        update();
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
    reject: null,
    anyway: (wasPlaying) => {
      listeners.forEach((listener) => {
        document.body.removeEventListener(listener, handleEvent, false);
      });

      dom.hidden = true;
      this.controls(true);

      background.style.display = "none";

      if(wasPlaying) {
        this.play();
      }
    }
  };

  this.videoCoordinates = () => {
    // From https://stackoverflow.com/a/39326690

    // Ratio of the video's intrisic dimensions
    var videoRatio = video.videoWidth / video.videoHeight;

    // The width and height of the video element
    var width = video.offsetWidth, height = video.offsetHeight;

    // The ratio of the element's width to its height
    var elementRatio = width / height;

    if(elementRatio > videoRatio) { // The video element is short and wide
      width = height * videoRatio;
    } else {                        // It is tall and thin, or exactly equal to the original ratio
      height = width / videoRatio;
    }

    // var offsetTop = ();

    // var offset = video.getBoundingClientRect();

    return {
      width: width,
      height: height
    };
  };

  this.select = () => {
    return new Promise((_resolve, _reject) => {
      coordinates.offset = video.getBoundingClientRect();
      coordinates.video = {
        width: this.videoWidth(),
        height: this.videoHeight()
      };

      background.style.display = "block";

      var wasPlaying = !this.paused();
      this.pause();
      this.userActive(true);
      this.controls(false);

      listeners.forEach((listener) => {
        document.body.addEventListener(listener, handleEvent, false);
      });

      promise.resolve = () => {
        promise.anyway(wasPlaying);

        if(coordinates.width() <= 1 || coordinates.height() <= 1) {
          _reject("Nothing selected");
        } else {
          _resolve(coordinates.get());
        }

        promise.resolve = promise.reject = null;
      };

      promise.reject = (cause) => {
        promise.anyway(wasPlaying);

        _reject(cause);
        promise.resolve = promise.reject = null;
      };
    });
  };

  this.cancelSelection = () => {
    if(promise.reject != null) {
      promise.reject("Canceled");
    }
  };

  this.isSelectingArea = () => {
    return promise.resolve != null;
  };
}

videojs.registerPlugin("areaSelector", areaSelector);
