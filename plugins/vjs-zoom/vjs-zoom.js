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

function zoom(options) {
  const button = document.createElement("button");
  button.classList.add("vjs-zoom-control", "vjs-control", "vjs-button");
  button.type = "button";
  button.title = "Zoom";
  button.tabIndex = "-1";
  button.style.order = 4;

  this.ready(() => {
    this.el().querySelector(".vjs-control-bar").appendChild(button);
  });

  button.addEventListener("click", () => {
    if(this.isZoomed()) {
      this.zoomReset();
    } else {
      this.zoom();
    }
  });

  this.zoom = () => {
    if(options.beforeZoom) {
      options.beforeZoom();
    }

    this.select().then((coordinates) => {

      // Do nothing if selected area width or height is less than 10%
      if(coordinates.relativeWidth < 0.1 || coordinates.relativeHeight < 0.1) {
        return;
      }

      // Zoom the video using relative position and size
      this.el().querySelector("video").style.transform = `translate(${-coordinates.relativeLeft * 100}%, ${-coordinates.relativeTop * 100}%) scale(${coordinates.relativeWidth}, ${coordinates.relativeHeight})`;

    }).catch((err) => {
      console.log(err);
    });
  };

  this.isZoomed = () => {
    return this.el().querySelector("video").style.transform != "none";
  };

  this.zoomReset = () => {
    this.el().querySelector("video").style.transform = "none";
    if(options.onReset) {
      options.onReset();
    }
  };
}

videojs.registerPlugin("zoom", zoom);
