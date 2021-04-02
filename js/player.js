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
  static shortcuts = {
    keyup: {
      "Space": {
        name: "Space",
        description: "Play/Pause",
        action: () => {
          if(Player.paused()) {
            Player.play();
            Player.notify(lang.playing);
          } else {
            Player.pause();
            Player.notify(lang.paused);
          }
        }
      },
      "KeyM": {
        name: "M",
        description: "Mute/unmute",
        action: () => {
          if(Player.muted()) {
            Player.muted(false);
            Player.notify(lang.soundOn);
          } else {
            Player.muted(true);
            Player.notify(lang.soundOff);
          }
        }
      },
      "KeyF": {
        name: "F",
        description: "Toggle fullscreen",
        action: () => {
          if(Player.isFullscreen()) {
            Player.exitFullscreen();
          } else {
            Player.requestFullscreen();
          }
        }
      }
    },
    keydown: {
      "ArrowLeft": {
        name: "←",
        description: "Rewind 5 seconds",
        action: () => { Player.changeTime(-5); }
      },
      "ArrowRight": {
        name: "→",
        description: "Skip 5 seconds",
        action: () => { Player.changeTime(+5); }
      },
      "ArrowUp": {
        name: "↑",
        description: "Volume up",
        action: () => { Player.changeVolume(+0.05); }
      },
      "ArrowDown": {
        name: "↓",
        description: "Volume down",
        action: () => { Player.changeVolume(-0.05); }
      },
      "BracketLeft": {
        name: "[",
        description: "Slower by 0.1x",
        action: () => { Player.changePlaybackRate(-0.1); }
      },
      "BracketRight": {
        name: "]",
        description: "Faster by 0.1x",
        action: () => { Player.changePlaybackRate(+0.1); }
      },
      "Space": {
        name: "Space",
        description: "Do nothing",
        action: () => {}
      }
    }
  };
  static overlay = null;
  static overlayData = null;
  static notice = null;
  static noticeTimeout = null;
  static fastSilence = null;
  static lesson = null;

  static init() {
    Player.player = videojs("my-player");
    Player.wrapper = document.getElementById("my-player");

    Player.player.el().parentNode.style.position = "relative";
    Player.initKeyListeners();
    Player.initOverlay();
    Player.initNotifier();
    Player.initLessonUpdater();
  }

  static initKeyListeners() {
    Player.wrapper.addEventListener("keyup", (e) => {
      if(Player.shortcuts.keyup.hasOwnProperty(e.code)) {
        e.preventDefault();
        Player.shortcuts.keyup[e.code].action();
      }
    });

    Player.wrapper.addEventListener("keydown", (e) => {
      if(Player.shortcuts.keydown.hasOwnProperty(e.code)) {
        e.preventDefault();
        Player.shortcuts.keydown[e.code].action();
      }
    });
  }

  static initOverlay() {
    Player.overlay = Player.appendLayer("my-p-overlay");

    Player.overlayData = {
      class: null,
      date: null,
      professor: null,
      title: null,
      description: null
    };

    Object.keys(Player.overlayData).forEach((id) => {
      Player.overlayData[id] = document.createElement("div");
      Player.overlayData[id].id = id;
      Player.overlayData[id].innerText = "";
      Player.overlay.appendChild(Player.overlayData[id]);
    });

    Player.on("pause", () => {
      if (!Player.seeking() && Player.paused())
        Player.overlay.style.display = "";
    });

    Player.on("playing", () => {
      Player.overlay.style.display = "none";
    });

    Player.overlay.onclick = () => {
      Player.overlay.style.display = "none";
      Player.play();
    };

    Player.on("useractive", () => {
      // console.log("active");
    });

    Player.on("userinactive", () => {
      // console.log("inactive");
    });
  }

  static initNotifier() {
    Player.notice = Player.appendLayer("notice");
    Player.fastSilence = Player.appendLayer("fastSilence");
    Player.fastSilence.innerText = "»";
  }

  static initLessonUpdater() {
    Player.on("timeupdate", () => {
      let currentTime = Player.currentTime();

      if(Player.lesson.isInSilence(currentTime)) {
        Player.playbackRate(8);
        Player.fastSilence.style.display = "inline-block";
      } else {
        Player.playbackRate(Player.lesson.playbackRate);
        Player.fastSilence.style.display = "none";
      }

      if(Player.lesson != null)
        Player.lesson.dbMark(currentTime);
    });

    Player.on("ended", () => {
      Player.lesson.dbSetAsWatched();
      Player.lesson.parentClass.dbGetNext().then(() => {
        Player.load(Player.lesson.parentClass.nextLesson);
      });
    });
  }

  static on(_event, _function) {
    return Player.player.on(_event, _function);
  }

  static load(_lesson, _autoplay = true) {
    if(_lesson == null)
      return;

    Player.lesson = _lesson;

    Player.player.src(Player.lesson.url());
    Player.currentTime(Player.lesson.mark);

    Player.overlayData.class.innerText = Player.lesson.parentClass.name;
    Player.overlayData.date.innerText = Player.lesson.dated;
    Player.overlayData.professor.innerText = Player.lesson.professor;
    Player.overlayData.title.innerText = Player.lesson.title;
    Player.overlayData.description.innerText = "";

    if(_autoplay)
      Player.play();
  }

  static play() {
    Player.wrapper.focus();
    return Player.player.play();
  }

  static pause() {
    return Player.player.pause();
  }

  static paused() {
    return Player.player.paused();
  }

  static seeking() {
    return Player.player.seeking();
  }

  static currentTime(_time = null) {
    return _time == null ? Player.player.currentTime() : Player.player.currentTime(_time);
  }

  static duration() {
    return Player.player.duration();
  }

  static muted(_muted = null) {
    return _muted == null ? Player.player.muted() : Player.player.muted(_muted);
  }

  static isFullscreen() {
    return Player.player.isFullscreen();
  }

  static exitFullscreen() {
    return Player.player.exitFullscreen();
  }

  static requestFullscreen() {
    return Player.player.requestFullscreen();
  }

  static playbackRate(_rate = null) {
    return _rate == null ? Player.player.playbackRate() : Player.player.playbackRate(_rate);
  }

  static volume(_volume = null) {
    return _volume == null ? Player.player.volume() : Player.player.volume(_volume);
  }

  static currentTime(_time = null) {
    return _time == null ? Player.player.currentTime() : Player.player.currentTime(_time);
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
    let currentVolume = Player.volume();
    let newVolume = limit(+currentVolume + +_amount, 0, 1);

    Player.volume(newVolume);
    Player.notify(`${lang.volume} ${(newVolume * 100).toFixed(0)}%`);
  }

  static changePlaybackRate(_amount) {
    let currentPlaybackRate = Player.playbackRate();
    let newPlaybackRate = limit(currentPlaybackRate + +_amount, 0.5, 2.5).toFixed(1);

    Player.playbackRate(newPlaybackRate);
    Player.notify(`${lang.rate} ${newPlaybackRate}x`);
  }

  static changeTime(_amount) {
    let currentTime = Player.currentTime();
    let newTime = limit(currentTime + +_amount, 0, Player.duration());

    Player.currentTime(newTime);
    Player.notify(secondsToTime(newTime));
  }
}

function limit(_x, _min, _max) {
  if(_x < _min) return _min;
  if(_x > _max) return _max;
  return _x;
}

function secondsToTime(seconds) {
  let hours = (Math.floor(seconds / 3600)).toString().padStart(2, "0");
  seconds %= 3600;
  let minutes = (Math.floor(seconds / 60)).toString().padStart(2, "0");
  seconds = (seconds % 60).toFixed(2).padStart(5, "0");
  return hours + ":" + minutes + ":" + seconds;
}
