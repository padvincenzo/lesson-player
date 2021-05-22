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

class Player {
  static player = null;
  static wrapper = null;
  static background = null;
  static overlay = null;
  static overlayData = null;
  static notice = null;
  static noticeTimeout = null;
  static fastSilence = null;
  static lesson = null;

  static fastPlaybackRate = 8;
  static minPlaybackRate = 0.5;
  static maxPlaybackRate = 2.5;

  static init() {
    Player.player = videojs("my-player");
    Player.wrapper = document.getElementById("my-player");
    Player.background = document.getElementById("my-p-background");

    Player.player.el().parentNode.style.position = "relative";
    Player.initWrapperFunctions();
    Player.initShortcuts();
    Player.initOverlay();
    Player.initNotifier();
    Player.initLessonUpdater();
    Player.removeTabIndexes();
    Player.initUserActivity();
  }

  static initWrapperFunctions() {
    let wrapperFunctions = [
      "src",
      "play",
      "pause",
      "paused",
      "userActive",
      "seeking",
      "currentTime",
      "duration",
      "muted",
      "isFullscreen",
      "requestFullscreen",
      "exitFullscreen",
      "playbackRate",
      "defaultPlaybackRate",
      "volume",
      "currentTime"
    ];

    for(let i = 0; i < wrapperFunctions.length; i++) {
      Player[wrapperFunctions[i]] = (_value) => {
        if(Player.lesson == null)
          return;

        return Player.player[wrapperFunctions[i]](_value);
      };
    }
  }

  static initShortcuts() {
    Player.background.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "Space": {
          e.preventDefault();
          if(Player.paused()) {
            Player.play();
            Player.notify(lang.playing);
          } else {
            Player.pause();
            Player.notify(lang.paused);
          }
          break;
        }
        case "KeyM": {
          e.preventDefault();
          if(Player.muted()) {
            Player.muted(false);
            Player.notify(lang.soundOn);
          } else {
            Player.muted(true);
            Player.notify(lang.soundOff);
          }
          break;
        }
        case "KeyF": {
          e.preventDefault();
          if(Player.isFullscreen()) {
            Player.exitFullscreen();
          } else {
            Player.requestFullscreen();
          }
          break;;
        }
      }
    });

    Player.background.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "Space": {
          e.preventDefault();
          break;
        }
        case "ArrowLeft":
        case "KeyA": {
          e.preventDefault();
          Player.changeTime(e.ctrlKey || e.metaKey ? -60 : -5);
          break;
        }
        case "ArrowRight":
        case "KeyD": {
          e.preventDefault();
          Player.changeTime(e.ctrlKey || e.metaKey ? +60 : +5);
          break;
        }
        case "ArrowUp":
        case "KeyW": {
          e.preventDefault();
          Player.changeVolume(+0.05);
          break;
        }
        case "ArrowDown":
        case "KeyS": {
          e.preventDefault();
          Player.changeVolume(-0.05);
          break;
        }
        case "BracketLeft":
        case "NumpadSubtract":
        case "Minus": {
          e.preventDefault();
          Player.changePlaybackRate(-0.1);
          break;
        }
        case "BracketRight":
        case "NumpadAdd":
        case "Equal": {
          e.preventDefault();
          Player.changePlaybackRate(+0.1);
          break;
        }
      }
    });

    for(let i = 0; i < Player.wrapper.childNodes.length; i++) {
      Player.wrapper.childNodes[i].tabIndex = -1;
    }
  }

  static initOverlay() {
    Player.overlay = Player.appendLayer("my-p-overlay");

    Player.overlayData = {
      class: null,
      date: null,
      professor: null,
      title: null
    };

    Object.keys(Player.overlayData).forEach((id) => {
      Player.overlayData[id] = document.createElement("div");
      Player.overlayData[id].id = id;
      Player.overlayData[id].innerText = "";
      Player.overlay.appendChild(Player.overlayData[id]);
    });

    Player.overlay.onclick = () => {
      Player.hideOverlay();
      Player.play();
      Player.userActive(true);
    };
  }

  static initNotifier() {
    Player.notice = Player.appendLayer("notice");
    Player.fastSilence = Player.appendLayer("fastSilence");
    Player.fastSilence.innerText = "»";
  }

  static initLessonUpdater() {
    Player.on("ratechange", () => {
      if(Player.lesson == null)
        return;

      let rate = Player.playbackRate();
      if(rate != Player.fastPlaybackRate && rate != Player.lesson.playbackRate) {
        Player.lesson.dbRate(rate);
      }
    });

    Player.on("timeupdate", () => {
      if(Player.lesson == null)
        return;

      let currentTime = Player.currentTime();
      let rate = Player.playbackRate();

      if(currentTime == null || rate == null)
        return;

      if(Player.lesson.isInSilence(currentTime)) {
        if(rate != Player.fastPlaybackRate) {
          Player.playbackRate(Player.fastPlaybackRate);
          Player.fastSilence.style.display = "inline-block";
        }
      } else {
        if(rate == Player.fastPlaybackRate) {
          Player.playbackRate(Player.lesson.playbackRate);
          Player.fastSilence.style.display = "none";
        }
      }

      if(Player.lesson != null)
        Player.lesson.dbMark(currentTime);
    });

    Player.on("ended", () => {
      Player.lesson.dbSetAsWatched();
      Player.lesson.playNext();
    });
  }

  static removeTabIndexes() {
    let controls = Player.wrapper.querySelectorAll("[tabindex='0'], button");
    for(let i = 0; i < controls.length; i++) {
      controls[i].tabIndex = -1;
    }
  }

  static initUserActivity() {
    Player.on("pause", () => {
      Player.userActive(true);
    });

    Player.on("playing", () => {
      Player.userActive(true);
    });

    Player.on("useractive", () => {
      Player.hideOverlay();
    });

    Player.on("userinactive", () => {
      if(Player.paused()) {
        Player.showOverlay();
      } else {
        // ...
      }
    });
  }

  static showOverlay() {
    Player.overlay.style.display = "";
  }

  static hideOverlay() {
    Player.overlay.style.display = "none";
  }

  static on(_event, _function) {
    return Player.player.on(_event, _function);
  }

  static hide() {
    Player.pause();
    Player.background.style.display = "none";
  }

  static show() {
    Player.background.style.display = "block";
  }

  static load(_lesson, _autoplay = true) {
    if(_lesson == null)
      return;

    Player.lesson = _lesson;

    Player.src(Player.lesson.url());

    Player.overlayData.class.innerText = Player.lesson.parentClass.name;
    Player.overlayData.date.innerText = formatDate(Player.lesson.dated);
    Player.overlayData.professor.innerText = Player.lesson.professor;
    Player.overlayData.title.innerText = Player.lesson.title;

    document.title = `${Player.lesson.parentClass.name}: ${Player.lesson.title}`;

    Player.currentTime(Player.lesson.mark);
    Player.defaultPlaybackRate(Player.lesson.playbackRate);

    if(_autoplay)
      Player.play();
  }

  static appendLayer(_id) {
    const layer = document.createElement("div");
    layer.id = _id;
    Player.wrapper.appendChild(layer);
    return layer;
  }

  static notify(_notice) {
    if(Player.noticeTimeout != null) {
      clearTimeout(Player.noticeTimeout)
    }
    Player.notice.innerHTML = _notice;
    Player.notice.style.display = "inline-block";
    Player.noticeTimeout = setTimeout(() => {
      Player.notice.style.display = "none";
      Player.notice.innerText = "";
    }, 1500);
  }

  static changeVolume(_amount) {
    if(Player.lesson == null)
      return;

    let currentVolume = Player.volume();
    let newVolume = limit(+currentVolume + +_amount, 0, 1);

    Player.volume(newVolume);
    Player.notify(`${lang.volume} ${(newVolume * 100).toFixed(0)}%`);
  }

  static changePlaybackRate(_amount) {
    if(Player.lesson == null)
      return;

    let currentPlaybackRate = Player.lesson.playbackRate;
    let newPlaybackRate = limit(currentPlaybackRate + +_amount, Player.minPlaybackRate, Player.maxPlaybackRate).toFixed(1);

    Player.playbackRate(newPlaybackRate);
    Player.notify(`${lang.rate} ${newPlaybackRate}x`);
  }

  static changeTime(_amount) {
    if(Player.lesson == null)
      return;

    let currentTime = Player.currentTime();
    let newTime = limit(currentTime + +_amount, 0, Player.duration());

    Player.currentTime(newTime);
    Player.notify(secondsToTime(newTime));
  }
}
