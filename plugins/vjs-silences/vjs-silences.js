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

function silences(options) {
  const skipSilenceBtn = document.createElement("div");
  skipSilenceBtn.classList.add("vjs-skip-silence");
  this.el().appendChild(skipSilenceBtn);

  skipSilenceBtn.addEventListener("click", () => {
    this.skipCurrentSilence();
  });

  const fastRate = (+(options.fastRate ?? 8)).toFixed(1);
  var normalRate = (+(options.normalRate ?? 1)).toFixed(1);

  var timestamps = [];
  var nextEnd = 0;
  var displayRealRemainingTime = options.displayRealRemainingTime ?? true;

  // Set up a custom element that displays the actually remaining time
  const remainingTimeDisplay = document.createElement("span");
  remainingTimeDisplay.classList.add("vjs-remaining-time-display-custom");
  var currentRemainingTimeDisplay;

  // Replace and hide the original remaining time display
  this.ready(() => {
    currentRemainingTimeDisplay = this.el().querySelector(".vjs-remaining-time-display");
    currentRemainingTimeDisplay.parentNode.insertBefore(remainingTimeDisplay, currentRemainingTimeDisplay);
    if(displayRealRemainingTime) {
      currentRemainingTimeDisplay.style.display = "none";
    } else {
      remainingTimeDisplay.style.display = "none";
    }
  });

  this.skipCurrentSilence = () => {
    if(nextEnd != 0) {
      this.currentTime(nextEnd);
      if(options.onSkip) {
        options.onSkip(nextEnd);
      }
    }
  }

  this.on("timeupdate", (e) => {
    if(e.manuallyTriggered) {
      return;
    }

    let currentTime = +this.currentTime();
    let currentSilence = getCurrent(currentTime);

    if(currentSilence != undefined) {
      this.playbackRate(fastRate);
      skipSilenceBtn.style.display = "inline-block";
      nextEnd = currentSilence.t_end;
    } else {
      this.playbackRate(normalRate);
      skipSilenceBtn.style.display = "none";
      nextEnd = 0;
    }

    if(displayRealRemainingTime) {
      // Assuming that silences' timestamp are correct
      let remainingSilences = timestamps.filter((silence) => silence.t_end > currentTime);
      let remainingSilenceSeconds = 0;

      if(remainingSilences.length > 0) {
        // Eventually correct currentSilence
        if(currentTime > remainingSilences[0].t_start) {
          remainingSilenceSeconds -= currentTime - remainingSilences[0].t_start;
        }

        remainingSilenceSeconds += remainingSilences.reduce((seconds, silence) => seconds + (silence.t_end - silence.t_start), 0);
      }

      let remainingSpokenSeconds = this.duration() - currentTime - remainingSilenceSeconds;
      let realRemainingSeconds = (remainingSpokenSeconds / +normalRate) + (remainingSilenceSeconds / +fastRate);

      remainingTimeDisplay.innerText = secondsToTime(realRemainingSeconds);
    }
  });

  this.shouldDisplayRealRemainingTime = (should) => {
    if(should == undefined) {
      return displayRealRemainingTime;
    }

    should = should == "true" || should === true;
    displayRealRemainingTime = should;

    if(should) {
      remainingTimeDisplay.style.display = "inline";
      currentRemainingTimeDisplay.style.display = "none";
    } else {
      remainingTimeDisplay.style.display = "none";
      currentRemainingTimeDisplay.style.display = "inline";
    }

    return displayRealRemainingTime;
  };

  this.setSilenceTimestamps = (_timestamps) => {
    timestamps = _timestamps
      .map((silence) => { return {t_start: +silence.t_start, t_end: +silence.t_end} })  // Make sure timestamps are numbers
      .filter((silence) => silence.t_end > silence.t_start)                             // Remove no sense silences
      .sort((silence1, silence2) => silence1.t_start - silence2.t_start);               // Sort timestamps to improve read speed

    nextEnd = 0;
  };

  this.setNormalRate = (_normalRate) => {
    normalRate = (+_normalRate).toFixed(1);
  };

  this.getNormalRate = () => {
    return normalRate;
  }

  this.getFastRate = () => {
    return fastRate;
  }

  getCurrent = (needle = 0) => {
    if(timestamps == null) {
      return undefined;
    }

    // Silences are in order, so just check for the first silence that comes after the needle
    let current = timestamps.find((silence) => needle <= silence.t_end);
    return (current && current.t_start <= needle) ? current : undefined;
  };

  this.isInSilence = () => {
    return nextEnd != 0;
  };

}

videojs.registerPlugin("silences", silences);
