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
  // static lesson, hasJustLoaded;
  // static minPlaybackRate, maxPlaybackRate;

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
      inactivityTimeout: 4000,
      plugins: {
        notifier: {
          defaultTimeout: 1500
        },
        lessonOverlay: {
          data: ["class", "date", "professor", "title"],
          doNotShowIf: () => {
            return Player.isSelectingArea() || Player.isWritingNote();
          }
        },
        silences: {
          fastRate: 8,
          normalRate: 1,
          displayRealRemainingTime: true,
          onSkip: (newTime) => {
            // Player.notify(secondsToTime(newTime));
          }
        },
        areaSelector: {},
        zoom: {
          beforeZoom: () => {
            Player.notify(lang.zoomArea, 3000);
          },
          onReset: () => {
            Player.notify(lang.zoomReseted);
          }
        },
        takeNotes: {
          onInsert: (note) => {
            // console.log("You have inserted: " + note);
          }
        }
      }
    });
    Player.wrapper = Player.player.el();
    Player.background = document.getElementById("my-p-background");
    Player.video = Player.wrapper.querySelector("video");

    Player.wrapper.parentNode.style.position = "relative";

    Player.initWrapperFunctions();
    Player.initShortcuts();
    Player.initLessonUpdater();
    Player.initUserActivity();
  }

  static unavailable() {
    return Player.lesson == null || Player.lesson == undefined;
  }

  static initWrapperFunctions() {
    // player's methods
    [
      "src",
      "play", "pause", "paused",
      "userActive",
      "seeking", "currentTime", "duration",
      "muted", "volume",
      "isFullscreen", "requestFullscreen", "exitFullscreen",
      "playbackRate", "defaultPlaybackRate",
      "videoWidth", "videoHeight"
    ].forEach((fn) => {
      Player[fn] = (_value) => {
        if(Player.unavailable())
          return;

        return Player.player[fn](_value);
      };
    });

    // Plugins
    [
      "notify",
      "isInSilence", "skipCurrentSilence", "setNormalRate", "getNormalRate", "getFastRate",
      "shouldDisplayRealRemainingTime", "setSilenceTimestamps",
      "select", "cancelSelection", "isSelectingArea",
      "zoom", "zoomReset", "isZoomed",
      "toggleNotes", "isWritingNote"
    ].forEach((fn) => {
      Player[fn] = Player.player[fn];
    });

    Player.lessonOverlay = Player.player.lessonOverlay;
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
          Player.cancelSelection();
        }
        return;
      }

      if(e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") {
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
          Player.skipCurrentSilence();
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
          Player.notify(Player.lessonOverlay.toggle() ? lang.overlayEnabled : lang.overlayDisabled);
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
        case "KeyW": {
          e.preventDefault();
          Player.toggleNotes();
          break;
        }
      }
    });

    document.body.addEventListener("keydown", (e) => {
      if(e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA" || Message.isBusy() || Player.isSelectingArea()) {
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

  static initLessonUpdater() {
    Player.on("ratechange", (event) => {
      // Prevent playbackRate change
      if(Player.hasJustLoaded) {
        Player.hasJustLoaded = false;
        return;
      }

      let rate = Player.playbackRate();
      if(!Player.isInSilence() && rate != Player.getNormalRate) {
        Player.lesson.dbRate(rate);
        Player.setNormalRate(rate);
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
    Player.setNormalRate(Player.lesson.playbackRate);

    // Restore lesson's time and playbackRate
    Player.currentTime(Player.lesson.mark);
    Player.defaultPlaybackRate(playbackRateBackup);

    Player.updateOverlay();
    Player.setSilenceTimestamps(Player.lesson.silences);
    Player.notify(`${Player.lesson.parentClass.name}:<br>${Player.lesson.title}`, 2000);

    if(_autoplay) {
      Player.play();
    }
  }

  static updateOverlay() {
    if(Player.unavailable()) {
      return;
    }

    UI.setHeaderTitle(Player.lesson.dictionaryReplace(lang.headerTitle));

    Player.lessonOverlay.update({
      class: Player.lesson.parentClass.name,
      date: formatDate(Player.lesson.dated),
      professor: Player.lesson.professor,
      title: Player.lesson.title
    });
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
    canvas.width = Player.videoWidth();
    canvas.height = Player.videoHeight();
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
    }).catch((err) => {
      // Automatically resume the video if the screenshot has been discarded
      if(wasPlaying) {
        Player.play();
      }
    });
  }

}
