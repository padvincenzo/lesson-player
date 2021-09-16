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

function takeNotes(options) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("vjs-take-notes-wrapper");
  wrapper.style.display = "none";

  const header = document.createElement("div");
  header.classList.add("vjs-take-notes-header");

  const dragBtn = document.createElement("div");
  dragBtn.classList.add("vjs-take-notes-dragBtn");

  // Mouse events
  dragBtn.addEventListener("mousedown", (e) => {
    e = e || window.event;
    e.preventDefault();

    // get the mouse cursor position at startup:
    var pos3 = e.clientX;
    var pos4 = e.clientY;

    document.onmouseup = (e) => {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    };

    // call a function whenever the cursor moves:
    document.onmousemove = (e) => {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      var pos1 = pos3 - e.clientX;
      var pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      wrapper.style.top = (wrapper.offsetTop - pos2) + "px";
      wrapper.style.left = (wrapper.offsetLeft - pos1) + "px";
    };
  });

  // Touch events
  dragBtn.addEventListener("touchstart", (e) => {
    e = e || window.event;
    e.preventDefault();

    // get the touch position at startup:
    var pos3 = e.changedTouches[0].pageX;
    var pos4 = e.changedTouches[0].pageY;

    document.ontouchend = (e) => {
      /* stop moving when touch is released:*/
      document.ontouchend = null;
      document.ontouchmove = null;
    };

    // call a function whenever the touch moves:
    document.ontouchmove = (e) => {
      e = e || window.event;
      e.preventDefault();
      // calculate the new touch position:
      var pos1 = pos3 - e.changedTouches[0].pageX;
      var pos2 = pos4 - e.changedTouches[0].pageY;
      pos3 = e.changedTouches[0].pageX;
      pos4 = e.changedTouches[0].pageY;
      // set the element's new position:
      wrapper.style.top = (wrapper.offsetTop - pos2) + "px";
      wrapper.style.left = (wrapper.offsetLeft - pos1) + "px";
    };
  });

  const screenBtn = document.createElement("div");
  screenBtn.classList.add("vjs-take-notes-screenBtn");

  screenBtn.addEventListener("click", (e) => {
    e.preventDefault();

    this.select().then((coordinates) => {
      // Do nothing if selected area width or height is less than 10%
      if(coordinates.relativeWidth < 0.1 || coordinates.relativeHeight < 0.1) {
        return;
      }

      var canvas = document.createElement('canvas');
      canvas.width = coordinates.absoluteWidth;
      canvas.height = coordinates.absoluteHeight;
      canvas.getContext('2d').drawImage(this.el().childNodes[0],
        coordinates.absoluteLeft, coordinates.absoluteTop, coordinates.absoluteWidth, coordinates.absoluteHeight, // Source
        0, 0, canvas.width, canvas.height);                                                                       // Destination

      // Canvas to base64 encoded data
      var image = document.createElement("img");
      image.src = canvas.toDataURL('image/jpeg');

      notes.appendChild(image);
    }).catch((err) => {
      console.log(err);
    });
  });

  header.appendChild(dragBtn);
  header.appendChild(screenBtn);

  const notes = document.createElement("div");
  notes.classList.add("vjs-take-notes-notes");

  const textbox = document.createElement("textarea");
  textbox.classList.add("vjs-take-notes-textbox");

  textbox.addEventListener("keyup", (e) => {
    if(e.code == "Enter" && !e.shiftKey) {
      e.preventDefault();
      insertNote(textbox.value);
      textbox.value = "";
    }
  });

  wrapper.appendChild(header);
  wrapper.appendChild(notes);
  wrapper.appendChild(textbox);
  this.el().appendChild(wrapper);

  const notesBtn = document.createElement("button");
  notesBtn.classList.add("vjs-take-notes-control", "vjs-control", "vjs-button");
  notesBtn.type = "button";
  notesBtn.title = "Take notes";
  notesBtn.tabIndex = "-1";
  notesBtn.style.order = 4;
  let notesText = document.createElement("span");
  notesText.innerText = "📝";
  notesBtn.appendChild(notesText);

  this.ready(() => {
    this.el().querySelector(".vjs-control-bar").appendChild(notesBtn);
    notesBtn.addEventListener("click", () => {
      this.toggleNotes();
    });
  })

  const insertNote = (text = "") => {
    text = text.replace(/^(\s|\n)*|(\s|\n)*$/g, "").replace(/ {2,}/g, " ").replace(/\n{2,}/g, "\n");

    const note = document.createElement("div");
    note.innerText = text;
    notes.appendChild(note);

    if(options.onInsert) {
      options.onInsert(text);
    }
  };

  this.toggleNotes = () => {
    wrapper.style.display = wrapper.style.display == "none" ? "flex" : "none";
  };

  this.isWritingNote = () => {
    return wrapper.style.display != "none";
  };
}

videojs.registerPlugin("takeNotes", takeNotes);
