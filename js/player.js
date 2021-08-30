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
  // static player, wrapper, background, video;
  // static overlay;
  // static silences, fastSilenceButton;
  // static notice, noticeTimeout;
  // static lesson, hasJustLoaded;
  // static minPlaybackRate, maxPlaybackRate;
  // static areaSelectorWrapper, areaSelector, areaCoordinates, areaSelectorListeners;

  static init() {
    /* Editable configuration */
    Player.minPlaybackRate = 0.5; // Lowest playbackRate
    Player.maxPlaybackRate = 3;   // Highest playbackRate

    Player.player = videojs("my-player", {
      fluid: true,
      controls: true,
      autoplay: false,
      preload: "auto",
      playbackRates: ["0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3"],
      rewind: true,
      inactivityTimeout: 4000
    });
    Player.wrapper = Player.player.el();
    Player.background = document.getElementById("my-p-background");
    Player.video = Player.wrapper.childNodes[0];

    Player.wrapper.parentNode.style.position = "relative";
    Player.notice = Player.appendLayer("notice");

    Player.initWrapperFunctions();
    Player.initShortcuts();
    Player.initOverlay();
    Player.initSilences();
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
          /* Skip silence */
          Player.silences.skipCurrent((t_end) => {
            Player.notify(secondsToTime(t_end));
          });
          break;
        }
        case "KeyP": {
          e.preventDefault();
          /* Take a screenshot */
          Player.screenshot();
          break;
        }
        case "KeyO": {
          e.preventDefault();
          /* Toggle overlay On/Off */
          Player.overlay.toggle((enabled) => {
            Player.notify(enabled ? lang.overlayEnabled : lang.overlayDisabled);
          });
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

  static initSilences() {
    Player.silences = {
      timestamps: [],
      button: null,
      fastRate: "8",
      normalRate: "1",
      nextEnd: 0,
      skipCurrent: null,
      init: function(_player, _button, _fastRate = "8", _normalRate = "1") {
        this.button = _button;
        this.fastRate = (+_fastRate).toFixed(1);
        this.normalRate = (+_normalRate).toFixed(1);
        this.nextEnd = 0;

        this.skipCurrent = (_callback) => {
          if(this.nextEnd != 0) {
            _player.currentTime(this.nextEnd);
            if(_callback != null) {
              _callback(this.nextEnd);
            }
          }
        }

        _player.on("timeupdate", () => {
          let currentSilence = this.getCurrent(_player.currentTime());

          if(currentSilence != null) {
            _player.playbackRate(this.fastRate);
            this.button.style.display = "inline-block";
            this.nextEnd = currentSilence.t_end;
          } else {
            _player.playbackRate(this.normalRate);
            this.button.style.display = "none";
            this.nextEnd = 0;
          }
        });
      },
      setTimestamps: function(_timestamps) {
        this.timestamps = _timestamps;
        this.nextEnd = 0;
      },
      setNormalRate: function(_normalRate) {
        this.normalRate = (+_normalRate).toFixed(1);
      },
      getCurrent: function(needle = 0) {
        if(this.timestamps == null) {
          return null;
        }

        return this.timestamps.find((ts) => {
          return (+ts.t_start <= +needle) && (+ts.t_end >= +needle);
        });
      },
      isInSilence: function() {
        return this.nextEnd != 0;
      }
    };


    Player.fastSilenceButton = Player.appendLayer("fastSilence");
    Player.fastSilenceButton.innerText = "»";

    Player.fastSilenceButton.addEventListener("click", () => {
      Player.silences.skipCurrent((t_end) => {
        Player.notify(secondsToTime(t_end));
      });
    });

    Player.silences.init(Player, Player.fastSilenceButton);
  }

  static initOverlay() {

    Player.overlay = {
      dom: null,
      data: {},
      enabled: true,
      init: function(_player, _dom, _data) {
        this.dom = _dom;

        for(const id in _data) {
          this.data[id] = document.createElement("div");
          this.data[id].id = id;
          this.data[id].innerText = _data[id];
          this.dom.appendChild(this.data[id]);
        };

        this.dom.addEventListener("click", () => {
          this.hide();
          _player.play();
          _player.userActive(true);
        });

        _player.on("useractive", () => {
          this.hide();
        });

        _player.on("userinactive", () => {
          if(_player.paused()) {
            this.show();
          } else {
            // do nothing
          }
        });

        _player.on("pause", () => {
          this.hide();
          _player.userActive(true);
        });

        _player.on("play", () => {
          this.hide();
          _player.userActive(true);
        });
      },
      update: function(_data) {
        for(const id in this.data) {
          this.data[id].innerText = _data[id];
        }
      },
      hide: function() {
        this.dom.style.display = "none";
      },
      show: function() {
        if(this.enabled && !Player.isSelectingArea()) {
          this.dom.style.display = "";
        }
      },
      toggle: function(_callback = null) {
        if(this.enabled) {
          this.enabled = false;
          this.hide();
        } else {
          this.enabled = true;
        }

        if(_callback != null) {
          _callback(this.enabled);
        }
      }
    }

    Player.overlay.init(
      Player,
      Player.appendLayer("my-p-overlay"),
      {
        class: "",
        date: "",
        professor: "",
        title: ""
      }
    );

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

    Player.areaSelectorListeners = {
      "mousedown": (e) => {
        Player.areaSelector.hidden = false;
        let offset = Player.wrapper.getBoundingClientRect();
        Player.areaCoordinates.x1 = Player.areaCoordinates.x2 = e.clientX - offset.x;
        Player.areaCoordinates.y1 = Player.areaCoordinates.y2 = e.clientY - offset.y;
        Player.areaSelectorUpdate();
      },
      "mousemove": (e) => {
        let offset = Player.wrapper.getBoundingClientRect();
        Player.areaCoordinates.x2 = e.clientX - offset.x;
        Player.areaCoordinates.y2 = e.clientY - offset.y;
        Player.areaSelectorUpdate();
      },
      "mouseup": (e) => {
        Player.zoomArea();
        Player.areaSelector.hidden = true;
      }
    };
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

    let relativeWidth = offset.width / Player.areaCoordinates.width();
    let relativeHeight = offset.height / Player.areaCoordinates.height();

    // Do nothing if selected area width or height is less than 10%
    if(relativeWidth < 0.1 || relativeHeight < 0.1) {
      return;
    }

    let relativeTop = Player.areaCoordinates.top() / Player.areaCoordinates.height() * 100;
    let relativeLeft = Player.areaCoordinates.left() / Player.areaCoordinates.width() * 100;

    // Zoom the video using relative position and size
    Player.video.style.transform = `translate(${-relativeLeft}%, ${-relativeTop}%) scale(${relativeWidth}, ${relativeHeight})`;

    Player.areaSelectorWrapper.style.display = "none";

    Player.areaSelectorWrapper.removeEventListener("mousedown", Player.areaSelectorListeners.mousedown);
    Player.areaSelectorWrapper.removeEventListener("mousemove", Player.areaSelectorListeners.mousemove);
    Player.areaSelectorWrapper.removeEventListener("mouseup", Player.areaSelectorListeners.mouseup);
  }

  static zoomReset() {
    Player.video.style.transform = "none";
    Player.notify(lang.zoomReseted);
  }

  static isZoomed() {
    return style.transform != "none";
  }

  static selectArea() {
    Player.pause();
    Player.overlay.hide();

    Player.areaSelectorWrapper.addEventListener("mousedown", Player.areaSelectorListeners.mousedown);
    Player.areaSelectorWrapper.addEventListener("mousemove", Player.areaSelectorListeners.mousemove);
    Player.areaSelectorWrapper.addEventListener("mouseup", Player.areaSelectorListeners.mouseup);

    Player.notify(lang.zoomArea);
    Player.areaSelectorWrapper.style.display = "block";
  }

  static isSelectingArea() {
    Player.areaSelectorWrapper.style.display == "block";
  }

  static initLessonUpdater() {
    Player.on("ratechange", (event) => {
      // Prevent playbackRate change
      if(Player.hasJustLoaded) {
        Player.hasJustLoaded = false;
        return;
      }

      let rate = Player.playbackRate();
      if(!Player.silences.isInSilence() && rate != Player.silences.normalRate) {
        Player.lesson.dbRate(rate);
        Player.silences.setNormalRate(rate);
      }
    });

    Player.on("timeupdate", () => {
      Player.lesson.dbMark(Player.currentTime());
    });

    Player.on("ended", () => {
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
    // When fullscreen, set the landscape orientation on mobile
    Player.wrapper.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        screen.orientation.lock('landscape').catch(err => {
          // do nothing
        });
      }
    });
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
    if(_lesson == null || _lesson == undefined) {
      return;
    }

    if(!Player.unavailable() && Player.lesson.isEqualTo(_lesson)) {
      Player.play();
      return;
    }

    Player.pause();
    Player.zoomReset();

    // Save the lesson playbackRate before anything change
    let playbackRateBackup = _lesson.playbackRate;

    Player.hasJustLoaded = true;
    Player.lesson = _lesson;
    Player.src(Player.lesson.url());
    Player.updateOverlay();
    Player.silences.setTimestamps(Player.lesson.silences);
    Player.silences.setNormalRate(Player.lesson.playbackRate);

    document.title = `${Player.lesson.parentClass.name}: ${Player.lesson.title}`;

    Player.currentTime(Player.lesson.mark);

    // Restore the lesson playbackRate
    Player.defaultPlaybackRate(playbackRateBackup);

    if(_autoplay) {
      Player.play();
    }
  }

  static updateOverlay() {
    if(Player.unavailable()) {
      return;
    }

    Player.overlay.update({
      class: Player.lesson.parentClass.name,
      date: formatDate(Player.lesson.dated),
      professor: Player.lesson.professor,
      title: Player.lesson.title
    });
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

    Player.playbackRate(newPlaybackRate);
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
    canvas.getContext('2d').drawImage(Player.video, 0, 0, canvas.width, canvas.height);

    // Canvas to base64 encoded data
    var dataURI = canvas.toDataURL('image/jpeg');

    if(Player.isFullscreen()) {
      Player.exitFullscreen();
    }

    let screenshotName = Player.lesson.dictionaryReplace(lang.screenshotName) + ".jpg";

    Message.view(`<p>${screenshotName}</p><img src="${dataURI}" />`, true, "Download").then(() => {
      var a = document.createElement("a");
      a.href = dataURI;
      a.download = screenshotName;
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

}
