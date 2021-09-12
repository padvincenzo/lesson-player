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
  // static areaSelector;

  static init() {
    /* Editable configuration */
    Player.minPlaybackRate = 0.5; // Lowest playbackRate
    Player.maxPlaybackRate = 3;   // Highest playbackRate

    Player.player = videojs("my-player", {
      fluid: true,
      controls: true,
      autoplay: false,
      preload: "auto",
      playbackRates: ["0.5", "0.6", "0.7", "0.8", "0.9", "1", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2", "2.2", "2.5", "2.8", "3"],
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
      if(Message.isBusy()) {
        if(e.code == "Escape") {
          e.preventDefault();
          Message.close();
        }
        return;
      }

      if(Player.isSelectingArea()) {
        if(e.code == "Escape") {
          e.preventDefault();
          Player.areaSelector.promise.reject("Canceled");
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
            // Player.notify(secondsToTime(t_end));
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
            Player.zoom();
          }
          break;
        }
      }
    });

    document.body.addEventListener("keydown", (e) => {
      if(Message.isBusy() || Player.isSelectingArea()) {
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
      currentRemainingTimeDisplay: null,
      remainingTimeDisplay: null,
      displayRealRemainingTime: true,
      init: function(_player, _button, _fastRate = "8", _normalRate = "1") {
        this.player = _player;
        this.button = _button;
        this.fastRate = (+_fastRate).toFixed(1);
        this.normalRate = (+_normalRate).toFixed(1);

        // Set up a custom element that displays the actually remaining time
        this.currentRemainingTimeDisplay = document.querySelector(".vjs-remaining-time-display");
        this.remainingTimeDisplay = document.createElement("span");
        this.remainingTimeDisplay.classList.add("vjs-remaining-time-display-custom");
        this.currentRemainingTimeDisplay.parentNode.insertBefore(this.remainingTimeDisplay, this.currentRemainingTimeDisplay);
        this.currentRemainingTimeDisplay.style.display = "none";

        this.skipCurrent = (_callback) => {
          if(this.nextEnd != 0) {
            _player.currentTime(this.nextEnd);
            if(_callback != null) {
              _callback(this.nextEnd);
            }
          }
        }

        _player.on("timeupdate", (e) => {
          if(e.manuallyTriggered) {
            return;
          }

          let currentTime = +_player.currentTime();
          let currentSilence = this.getCurrent(currentTime);

          if(currentSilence != undefined) {
            _player.playbackRate(this.fastRate);
            this.button.style.display = "inline-block";
            this.nextEnd = currentSilence.t_end;
          } else {
            _player.playbackRate(this.normalRate);
            this.button.style.display = "none";
            this.nextEnd = 0;
          }

          if(this.displayRealRemainingTime) {
            // Assuming that silences' timestamp are correct
            let remainingSilences = this.timestamps.filter((silence) => silence.t_end > currentTime);
            let remainingSilenceSeconds = 0;

            if(remainingSilences.length > 0) {
              // Eventually correct currentSilence
              if(currentTime > remainingSilences[0].t_start) {
                remainingSilenceSeconds -= currentTime - remainingSilences[0].t_start;
              }

              remainingSilenceSeconds += remainingSilences.reduce((seconds, silence) => seconds + (silence.t_end - silence.t_start), 0);
            }

            let remainingSpokenSeconds = _player.duration() - currentTime - remainingSilenceSeconds;
            let realRemainingSeconds = (remainingSpokenSeconds / +this.normalRate) + (remainingSilenceSeconds / +this.fastRate);

            this.remainingTimeDisplay.innerText = secondsToTime(realRemainingSeconds);
          }
        });
      },
      shouldDisplayRealRemainingTime: function(should = true) {
        this.displayRealRemainingTime = should;

        if(should) {
          this.remainingTimeDisplay.style.display = "inline";
          this.currentRemainingTimeDisplay.style.display = "none";
        } else {
          this.remainingTimeDisplay.style.display = "none";
          this.currentRemainingTimeDisplay.style.display = "inline";
        }
      },
      setTimestamps: function(_timestamps) {
        this.timestamps = _timestamps
          .map((silence) => { return {t_start: +silence.t_start, t_end: +silence.t_end} })  // Make sure timestamps are numbers
          .filter((silence) => silence.t_end > silence.t_start)                             // Remove no sense silences
          .sort((silence1, silence2) => silence1.t_start - silence2.t_start);               // Sort timestamps to improve read speed

        this.nextEnd = 0;
      },
      setNormalRate: function(_normalRate) {
        this.normalRate = (+_normalRate).toFixed(1);
      },
      getCurrent: function(needle = 0) {
        if(this.timestamps == null) {
          return undefined;
        }

        // Silences are in order, so just check for the first silence that comes after the needle
        let current = this.timestamps.find((silence) => needle <= silence.t_end);
        return (current && current.t_start <= needle) ? current : undefined;
      },
      isInSilence: function() {
        return this.nextEnd != 0;
      }
    };


    Player.fastSilenceButton = Player.appendLayer("fastSilence");
    Player.fastSilenceButton.innerText = "»";

    Player.fastSilenceButton.addEventListener("click", () => {
      Player.silences.skipCurrent((t_end) => {
        // Player.notify(secondsToTime(t_end));
      });
    });

    Player.silences.init(Player, Player.fastSilenceButton);
  }

  static get shouldDisplayRealRemainingTime() {
    return Player.silences.displayRealRemainingTime;
  }

  static set shouldDisplayRealRemainingTime(should) {
    should = should == "true" || should === true;
    Player.silences.shouldDisplayRealRemainingTime(should);
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

    Player.areaSelector = {
      background: null,
      rectangle: {
        dom: null,
        coordinates: {
          offset: {width: 0, height: 0},  // player wrapper's getBoundingClientRect()
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
          get: function() {
            return {
              left: this.left(),
              top: this.top(),
              width: this.width(),
              height: this.height(),
              relativeLeft: this.relativeLeft(),
              relativeTop: this.relativeTop(),
              relativeWidth: this.relativeWidth(),
              relativeHeight: this.relativeHeight()
            };
          }
        },
        update: function() {
          Object.assign(this.dom.style, {
            top: `${this.coordinates.top()}px`,
            left: `${this.coordinates.left()}px`,
            width: `${this.coordinates.width()}px`,
            height: `${this.coordinates.height()}px`
          });
        }
      },
      player: null,
      init: function(_player) {
        this.player = _player;

        this.background = document.createElement("div");
        this.background.classList.add("vjs-area-selector-background");

        this.rectangle.dom = document.createElement("div");
        this.rectangle.dom.hidden = true;
        this.rectangle.dom.classList.add("vjs-area-selector-rectangle");

        this.background.appendChild(this.rectangle.dom);
        this.player.el().appendChild(this.background);
      },
      listeners: ["mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend"],
      handleEvent: function(e) {
        switch(e.type) {
          case "mousedown": {
            this.rectangle.dom.hidden = false;
            this.rectangle.coordinates.x1 = this.rectangle.coordinates.x2 = e.clientX - this.rectangle.coordinates.offset.x;
            this.rectangle.coordinates.y1 = this.rectangle.coordinates.y2 = e.clientY - this.rectangle.coordinates.offset.y;
            this.rectangle.update();
            break;
          }
          case "touchstart": {
            e.preventDefault();
            this.rectangle.dom.hidden = false;
            this.rectangle.coordinates.x1 = this.rectangle.coordinates.x2 = e.changedTouches[0].pageX - this.rectangle.coordinates.offset.x;
            this.rectangle.coordinates.y1 = this.rectangle.coordinates.y2 = e.changedTouches[0].pageY - this.rectangle.coordinates.offset.y;
            this.rectangle.update();
            break;
          }
          case "mousemove": {
            this.rectangle.coordinates.x2 = e.clientX - this.rectangle.coordinates.offset.x;
            this.rectangle.coordinates.y2 = e.clientY - this.rectangle.coordinates.offset.y;
            this.rectangle.update();
            break;
          }
          case "touchmove": {
            e.preventDefault();
            this.rectangle.coordinates.x2 = e.changedTouches[0].pageX - this.rectangle.coordinates.offset.x;
            this.rectangle.coordinates.y2 = e.changedTouches[0].pageY - this.rectangle.coordinates.offset.y;
            this.rectangle.update();
            break;
          }
          case "mouseup": {
            this.rectangle.dom.hidden = true;
            this.background.style.display = "none";
            if(this.promise.resolve != null) {
              this.promise.resolve();
            }
            break;
          }
          case "touchend": {
            e.preventDefault();
            this.rectangle.dom.hidden = true;
            this.background.style.display = "none";
            if(this.promise.resolve != null) {
              this.promise.resolve();
            }
            break;
          }
        }
      },
      promise: {
        resolve: null,
        reject: null
      },
      select: function() {
        return new Promise((_resolve, _reject) => {
          this.rectangle.coordinates.offset = this.player.el().getBoundingClientRect();

          var wasPlaying = !this.player.paused();
          this.player.pause();
          this.player.userActive(true);
          this.player.controls(false);

          this.listeners.forEach((listener) => {
            this.background.addEventListener(listener, this, false);
          });

          this.background.style.display = "block";

          this.promise.resolve = () => {
            this.listeners.forEach((listener) => {
              this.background.removeEventListener(listener, this, false);
            });

            _resolve(this.rectangle.coordinates.get());
            this.promise.resolve = this.promise.reject = null;

            if(wasPlaying) {
              this.player.play();
            }

            this.player.controls(true);
          };

          this.promise.reject = (cause) => {
            this.listeners.forEach((listener) => {
              this.background.removeEventListener(listener, this, false);
            });

            _reject(cause);
            this.promise.resolve = this.promise.reject = null;

            if(wasPlaying) {
              this.player.play();
            }

            this.player.controls(true);
          };
        });
      },
      isSelecting: function() {
        return this.background.style.display == "block";
      }
    };

    Player.areaSelector.init(Player.player);

    var zoomBtn = document.createElement("button");
    zoomBtn.classList.add("vjs-zoom-control", "vjs-control", "vjs-button");
    zoomBtn.type = "button";
    zoomBtn.title = "Zoom";
    zoomBtn.tabIndex = "-1";
    let zoomText = document.createElement("span");
    zoomText.innerText = "✂";
    zoomBtn.appendChild(zoomText);

    document.querySelector(".vjs-fullscreen-control").style.order = 5;
    zoomBtn.style.order = 4;

    document.querySelector(".vjs-control-bar").appendChild(zoomBtn);
    zoomBtn.addEventListener("click", () => {
      if(Player.isZoomed()) {
        Player.zoomReset();
      } else {
        Player.zoom();
      }
    });
  }

  static zoom() {
    Player.overlay.hide();
    Player.notify(lang.zoomArea);
    Player.areaSelector.select().then((coordinates) => {

      // Do nothing if selected area width or height is less than 10%
      if(coordinates.relativeWidth < 0.1 || coordinates.relativeHeight < 0.1) {
        return;
      }

      // Zoom the video using relative position and size
      Player.video.style.transform = `translate(${-coordinates.relativeLeft * 100}%, ${-coordinates.relativeTop * 100}%) scale(${coordinates.relativeWidth}, ${coordinates.relativeHeight})`;

    }).catch((err) => {
      console.log(err);
    });
  }

  static zoomReset() {
    Player.video.style.transform = "none";
    Player.notify(lang.zoomReseted);
  }

  static isZoomed() {
    return Player.video.style.transform != "none";
  }

  static isSelectingArea() {
    return Player.areaSelector.isSelecting();
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
    Player.silences.setNormalRate(Player.lesson.playbackRate);

    // Restore lesson's time and playbackRate
    Player.currentTime(Player.lesson.mark);
    Player.defaultPlaybackRate(playbackRateBackup);

    Player.updateOverlay();
    Player.silences.setTimestamps(Player.lesson.silences);
    Player.notify(`${Player.lesson.parentClass.name}:<br>${Player.lesson.title}`, 2000);

    if(_autoplay) {
      Player.play();
    }
  }

  static updateOverlay() {
    if(Player.unavailable()) {
      return;
    }

    UI.setHeaderTitle(Player.lesson.parentClass.name, Player.lesson.title);

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

  static notify(_notice, _timeout = 1500) {
    if(Player.noticeTimeout != null) {
      clearTimeout(Player.noticeTimeout)
    }

    Player.notice.innerHTML = _notice;
    Player.notice.style.display = "inline-block";

    Player.noticeTimeout = setTimeout(() => {
      Player.notice.style.display = "none";
      Player.notice.innerText = "";
    }, _timeout);
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

    let newTime = limit(+Player.currentTime() + +_amount, 0, Player.duration() - 0.1);

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
