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
  // static player, wrapper, background;
  // static overlay, overlayData, overlayEnabled;
  // static notice, noticeTimeout, fastSilence;
  // static lesson;
  // static fastPlaybackRate, minPlaybackRate, maxPlaybackRate;
  // static areaSelectorWrapper, areaSelector, areaCoordinates;

  static init() {
    /* Editable configuration */
    Player.fastPlaybackRate = 8;  // PlaybackRate on silences
    Player.minPlaybackRate = 0.5; // Lowest playbackRate
    Player.maxPlaybackRate = 3;   // Highest playbackRate

    Player.overlayEnabled = true;

    Player.player = videojs("my-player", {
      fluid: true,
      controls: true,
      autoplay: false,
      preload: "auto",
      playbackRates: range(Player.minPlaybackRate, Player.maxPlaybackRate, 0.25, 2),
      rewind: true,
      inactivityTimeout: 4000
    });
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
    Player.initAreaSelector();
  }

  static unavailable() {
    return Player.lesson == null || Player.lesson == undefined;
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
        if(Player.unavailable())
          return;

        return Player.player[wrapperFunctions[i]](_value);
      };
    }
  }

  static initShortcuts() {
    document.body.addEventListener("keyup", (e) => {
      if(e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA" || Message.isBusy()) {
        if(e.code == "Escape") {
          e.preventDefault();
          Message.close();
        }
        return;
      }

      switch (e.code) {
        case "Space": {
          /* Pause/play the video */
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
          /* Mute/unmute the video */
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
          /* Toggle fullscreen */
          e.preventDefault();
          if(Player.isFullscreen()) {
            Player.exitFullscreen();
          } else {
            Player.requestFullscreen();
          }
          break;
        }
        case "KeyS": {
          e.preventDefault();
          if(e.shiftKey) {
            /* Take a screenshot */
            Player.screenshot();
          } else {
            /* Skip silence */
            Player.skipSilence();
          }
          break;
        }
        case "KeyO": {
          e.preventDefault();
          /* Toggle overlay On/Off */
          Player.toggleOverlayEnabled();
          break;
        }
        case "KeyX": {
          e.preventDefault();
          if(Player.isZoomed()) {
            Player.zoomReset();
          } else {
            Player.selectArea();
          }
          break;
        }
      }
    });

    document.body.addEventListener("keydown", (e) => {
      if(e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA" || Message.isBusy()) {
        return;
      }

      switch (e.code) {
        case "Space": {
          /* Do nothing */
          e.preventDefault();
          break;
        }
        case "ArrowLeft": {
          /* Go back 5s (or 1m with Ctrl) */
          e.preventDefault();
          Player.changeTime(e.ctrlKey || e.metaKey ? -60 : -5);
          break;
        }
        case "ArrowRight": {
          /* Skip 5s (or 1m with Ctrl) */
          e.preventDefault();
          Player.changeTime(e.ctrlKey || e.metaKey ? +60 : +5);
          break;
        }
        case "ArrowUp": {
          /* Increase volume by 5% */
          e.preventDefault();
          Player.changeVolume(+0.05);
          break;
        }
        case "ArrowDown": {
          /* Decrease volume by 5% */
          e.preventDefault();
          Player.changeVolume(-0.05);
          break;
        }
        case "BracketLeft":
        case "NumpadSubtract":
        case "Minus": {
          if(e.ctrlKey || e.metaKey) {
            break;
          }
          /* Decrease playback rate by 0.1 */
          e.preventDefault();
          Player.changePlaybackRate(-0.1);
          break;
        }
        case "BracketRight":
        case "NumpadAdd":
        case "Equal": {
          if(e.ctrlKey || e.metaKey) {
            break;
          }
          /* Increase playback rate by 0.1 */
          e.preventDefault();
          Player.changePlaybackRate(+0.1);
          break;
        }
      }
    });
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

  static initAreaSelector() {
    Player.areaSelectorWrapper = Player.appendLayer("my-p-area-selector-wrapper");
    Player.areaSelector = document.createElement("div");
    Player.areaSelector.id = "my-p-area-selector";
    Player.areaSelector.hidden = true;
    Player.areaSelectorWrapper.appendChild(Player.areaSelector);

    Player.areaCoordinates = {
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
      }
    };

    Player.areaSelectorWrapper.addEventListener("mousedown", (e) => {
      Player.areaSelector.hidden = false;
      let offset = Player.wrapper.getBoundingClientRect();
      Player.areaCoordinates.x1 = Player.areaCoordinates.x2 = e.clientX - offset.x;
      Player.areaCoordinates.y1 = Player.areaCoordinates.y2 = e.clientY - offset.y;
      Player.areaSelectorUpdate();
    });

    Player.areaSelectorWrapper.addEventListener("mousemove", (e) => {
      let offset = Player.wrapper.getBoundingClientRect();
      Player.areaCoordinates.x2 = e.clientX - offset.x;
      Player.areaCoordinates.y2 = e.clientY - offset.y;
      Player.areaSelectorUpdate();
    });

    Player.areaSelectorWrapper.addEventListener("mouseup", (e) => {
      Player.zoomArea();
      Player.areaSelector.hidden = true;
    });

    Player.zoomReset();
  }

  static areaSelectorUpdate() {
    Object.assign(Player.areaSelector.style, {
      top: `${Player.areaCoordinates.top()}px`,
      left: `${Player.areaCoordinates.left()}px`,
      width: `${Player.areaCoordinates.width()}px`,
      height: `${Player.areaCoordinates.height()}px`
    });
  }

  static zoomArea() {
    let offset = Player.wrapper.getBoundingClientRect();

    let relativeWidth = offset.width / Player.areaCoordinates.width() * 100;
    let relativeHeight = offset.height / Player.areaCoordinates.height() * 100;

    // Do nothing if selected area width or height is less than 10%
    if(relativeWidth < 10 || relativeHeight < 10) {
      return;
    }

    let relativeTop = Player.areaCoordinates.top() / Player.areaCoordinates.height() * 100;
    let relativeLeft = Player.areaCoordinates.left() / Player.areaCoordinates.width() * 100;

    // Zoom the video using relative position and size
    Object.assign(Player.player.el().childNodes[0].style, {
      top: `${-relativeTop}%`,
      left: `${-relativeLeft}%`,
      width: `${relativeWidth}%`,
      height: `${relativeHeight}%`
    });

    Player.areaSelectorWrapper.style.display = "none";
  }

  static zoomReset() {
    Object.assign(Player.player.el().childNodes[0].style, {
      top: 0, left: 0, width: "100%", height: "100%"
    });
    Player.notify(lang.zoomReseted);
  }

  static isZoomed() {
    let style = Player.player.el().childNodes[0].style;
    return style.top != "0px" || style.left != "0px" || style.width != "100%" || style.height != "100%";
  }

  static selectArea() {
    Player.pause();
    Player.hideOverlay();
    Player.notify(lang.zoomArea);
    Player.areaSelectorWrapper.style.display = "block";
  }

  static isSelectingArea() {
    Player.areaSelectorWrapper.style.display == "block";
  }

  static initNotifier() {
    Player.notice = Player.appendLayer("notice");
    Player.fastSilence = Player.appendLayer("fastSilence");
    Player.fastSilence.innerText = "»";

    // Skip silence on click
    Player.fastSilence.addEventListener("click", () => {
      Player.skipSilence();
    });
  }

  static initLessonUpdater() {
    Player.on("ratechange", () => {
      if(Player.unavailable()) {
        return;
      }

      let rate = Player.playbackRate();
      if(rate != Player.fastPlaybackRate && rate != Player.lesson.playbackRate) {
        Player.lesson.dbRate(rate);
      }
    });

    Player.on("timeupdate", () => {
      if(Player.unavailable()) {
        return;
      }

      let currentTime = Player.currentTime();

      if(Player.lesson.isInSilence(currentTime)) {
        Player.goFast();
      } else {
        Player.goRegular();
      }

      Player.lesson.dbMark(currentTime);
    });

    Player.on("ended", () => {
      if(Player.unavailable()) {
        return;
      }

      Player.lesson.dbSetAsWatched().then(() => {
        Player.lesson.playNext();
      });
    });
  }

  static removeTabIndexes() {
    let controls = Player.wrapper.querySelectorAll("[tabindex='0'], button");
    for(let i = 0; i < controls.length; i++) {
      controls[i].tabIndex = -1;

      controls[i].addEventListener("click", () => {
        Player.focus();
      });
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
        // do nothing
      }
    });

    // When fullscreen, set the landscape orientation on mobile
    Player.wrapper.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        screen.orientation.lock('landscape').catch(err => {
          // do nothing
        });
      }
    });
  }

  static showOverlay() {
    if(Player.overlayEnabled && !Player.isSelectingArea()) {
      Player.overlay.style.display = "";
    }
  }

  static hideOverlay() {
    Player.overlay.style.display = "none";
  }

  static on(_event, _function) {
    return Player.player.on(_event, _function);
  }

  static focus() {
    Player.background.focus();
  }

  static hide() {
    Player.pause();
    Player.background.style.display = "none";
  }

  static show() {
    Player.background.style.display = "block";
  }

  static load(_lesson, _autoplay = true) {
    if(_lesson == null) {
      return;
    }

    Player.lesson = _lesson;
    Player.src(Player.lesson.url());
    Player.updateOverlay();

    document.title = `${Player.lesson.parentClass.name}: ${Player.lesson.title}`;

    Player.defaultPlaybackRate(Player.lesson.playbackRate);
    Player.currentTime(Player.lesson.mark);

    if(_autoplay) {
      Player.play();
    }
  }

  static updateOverlay() {
    if(Player.unavailable()) {
      return;
    }

    Player.overlayData.class.innerText = Player.lesson.parentClass.name;
    Player.overlayData.date.innerText = formatDate(Player.lesson.dated);
    Player.overlayData.professor.innerText = Player.lesson.professor;
    Player.overlayData.title.innerText = Player.lesson.title;
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

  static skipSilence() {
    if(Player.unavailable()) {
      return;
    }

    let t_end = Player.lesson.getEndOfSilence(Player.currentTime());
    if(t_end != null) {
      Player.currentTime(t_end);
      Player.notify(secondsToTime(t_end));
    }
  }

  static goFast() {
    if(Player.unavailable()) {
      return;
    }

    Player.playbackRate(Player.fastPlaybackRate);
    Player.fastSilence.style.display = "inline-block";
  }

  static goRegular() {
    if(Player.unavailable()) {
      return;
    }

    Player.playbackRate(Player.lesson.playbackRate);
    Player.fastSilence.style.display = "none";
  }

  static changeVolume(_amount) {
    if(Player.unavailable()) {
      return;
    }

    let newVolume = limit(+Player.volume() + +_amount, 0, 1);

    Player.volume(newVolume);
    Player.notify(`${lang.volume} ${(newVolume * 100).toFixed(0)}%`);
  }

  static changePlaybackRate(_amount) {
    if(Player.unavailable()) {
      return;
    }

    let newPlaybackRate = limit(+Player.lesson.playbackRate + +_amount, Player.minPlaybackRate, Player.maxPlaybackRate).toFixed(1);

    Player.playbackRate(+newPlaybackRate);
    Player.notify(`${lang.rate} ${newPlaybackRate}x`);
  }

  static changeTime(_amount) {
    if(Player.unavailable()) {
      return;
    }

    let newTime = limit(+Player.currentTime() + +_amount, 0, Player.duration());

    Player.currentTime(newTime);
    Player.notify(secondsToTime(newTime));
  }

  static screenshot() {
    if(Player.unavailable()) {
      return;
    }

    // Pause the video
    var wasPlaying = !Player.paused();
    if(wasPlaying) {
      Player.pause();
    }

    // Save the timestamp
    var timestamp = Player.currentTime()

    // Screenshot to canvas
    var canvas = document.createElement('canvas');
    canvas.width = Player.player.videoWidth();
    canvas.height = Player.player.videoHeight();
    canvas.getContext('2d').drawImage(Player.player.el().childNodes[0], 0, 0, canvas.width, canvas.height);

    // Canvas to base64 encoded data
    var dataURI = canvas.toDataURL('image/jpeg');

    if(Player.isFullscreen()) {
      Player.exitFullscreen();
    }

    Message.view(`<img src="${dataURI}" />`, true, "Download").then(() => {
      var a = document.createElement("a");
      a.href = dataURI;
      a.download = Player.lesson.dictionaryReplace(lang.screenshotName) + ".jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }).catch((err = "") => {
      if(err != "") {
        console.log(err);
      }

      // Automatically resume the video if the screenshot has been discarded
      if(wasPlaying) {
        Player.play();
      }
    });
  }

  static toggleOverlayEnabled() {
    if(Player.overlayEnabled) {
      Player.overlayEnabled = false;
      Player.hideOverlay();
      Player.notify(lang.overlayDisabled);
    } else {
      Player.overlayEnabled = true;
      Player.notify(lang.overlayEnabled);
    }
  }
}
