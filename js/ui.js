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

class UI {
  // wrapper, btnHome;

  static init() {
    UI.wrapper = document.getElementById("container");

    UI.listClasses().then(() => {
      Class.loadLast();
    });

    UI.btnHome = createButton(lang.homePage, () => {
      UI.listClasses();
    });

    document.getElementById("header-logo").addEventListener("click", () => {
      UI.listClasses();
    });

    UI.separator = ">";

    UI.getLocalIPAddress();
  }

  static display() {
    UI.wrapper.innerHTML = "";
    for(let i = 0; i < arguments.length; i++) {
      UI.wrapper.appendChild(arguments[i]);
    }

    window.scrollTo(0, 0);
  }

  static listClasses() {
    return Class.retrieve().then(() => {
      UI.display(Class.cards(), br(), Class.btnNewClass);
      document.title = `${lang.classList} | Lesson Player`;
    });
  }

  static setHeaderTitle(_class, _lesson) {
    document.title = `${_class}: ${_lesson}`;
    document.getElementById("header-class").innerText = _class;
    document.getElementById("header-lesson").innerText = _lesson;
  }

  static get separator() {
    return document.getElementById("header-separator").innerText;
  }

  static set separator(value) {
    document.getElementById("header-separator").innerText = value;
  }

  static get theme() {
    return document.head.querySelector("link#theme").href;
  }

  static set theme(value) {
    document.head.querySelector("link#theme").href = value;
  }

  static get themes() {
    let installedThemes = [];
    for(let i = 0; i < themes.length; i++) {
      installedThemes.push({
        value: themes[i],
        text: themes[i].match(/themes\/(.*)\.css/)[1],
        selected: UI.theme.match(themes[i]) != null
      });
    }
    return installedThemes;
  }

  static getLocalIPAddress() {
    return request("ui.php", {request: "ip"})
      .then((ip) => {
        document.querySelector("#ip-address").innerText = `${lang.IPAddress} ${ip}`;
      })
      .catch(() => {
        document.querySelector("#ip-address").innerText = lang.IPNotAvailable;
      });
  }

  static showCredits() {
    let credits = `<h2>${lang.credits}</h2>` +
		'<ul>' +
			'<li>Using <a href="https://videojs.com/" target="_blank">video.js</a> version 7.11.8 and a modified version of <a href="https://github.com/videojs/themes" target="_blank">theme City</a></li>' +
			'<li>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>' +
		'</ul>';

    Message.view(credits);
  }

  static showKeyboardShortcuts() {
    var html = `<h2>${lang.shortcuts}</h2><img src="img/keyboard.svg"><div class="shortcuts">`;
// ] o + (o =) 	Aumenta la velocità di riproduzione
// [ o - 	Diminuisci la velocità di riproduzione
// S 	Salta il silenzio in corso
// P 	Screenshot
// O 	Abilita/disabilita overlay
// X 	Ingrandisci/ripristina il video

    var shortcuts = [
      {
        keys: ["M"],
        action: lang.shortcut.mute
      }, {
        keys: ["F"],
        action: lang.shortcut.fullscreen
      }, {
        keys: ["O"],
        action: lang.shortcut.overlay
      }, {
        keys: ["P"],
        action: lang.shortcut.screenshot
      }, {
        keys: ["S"],
        action: lang.shortcut.skipSilence
      }, {
        keys: ["X"],
        action: lang.shortcut.zoom
      }, {
        keys: ["▲"],
        action: lang.shortcut.volumeUp
      }, {
        keys: ["▼"],
        action: lang.shortcut.volumeDown
      }, {
        keys: ["◄"],
        action: lang.shortcut.backward
      }, {
        keys: ["Ctrl", "◄"],
        action: lang.shortcut.longBackward
      }, {
        keys: ["►"],
        action: lang.shortcut.forward
      }, {
        keys: ["Ctrl", "►"],
        action: lang.shortcut.longForward
      }, {
        keys: ["["],
        action: lang.shortcut.slower
      }, {
        keys: ["]"],
        action: lang.shortcut.faster
      }, {
        keys: ["Spacebar"],
        action: lang.shortcut.play
      }
    ];

    html = shortcuts.reduce((html, shortcut) => html +
      '<div class="shortcut">' +
      shortcut.keys.reduce((html, key) => html + `<div class="key key${key}">${key}</div>`, "") +
      `<div class="action">${shortcut.action}</div></div>`
    , html);

    Message.view(html, false, lang.close);
  }

  static feedback() {
    var form = new Form();
    form.appendText("name", "", lang.yourName, 100);
    form.appendText("mail", "", lang.yourMail, 150);
    form.appendTextarea("feedback", "", lang.feedbackWrite, 1000);

    Message.view(form.wrapper, true, lang.feedbackSend).then(() => {
      let values = form.values();
      if(values == null) {
        return;
      }

      UI.sendFeedback(values).then(() => {
        Message.text(lang.feedbackThanks);
      }).catch((err) => {
        Message.view(err);
      });
    }).catch(() => {
      // do nothing
    });
  }

  static sendFeedback(_feedback) {
    return new Promise((_resolve, _reject) => {
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify(_feedback);

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          try {

            if(xhr.responseText == "Ok") {
              _resolve();
            } else {
              _reject(xhr.responseText);
            }
          }
          catch(err) {
            _reject(err.message + "<br><br>" + xhr.responseText);
          }
        }

        if(xhr.readyState == 4 && xhr.status > 299) {
          _reject("Server Error: " + xhr.statusText);
        }
      };

      xhr.onerror = () => {
        _reject("xmlHTTP Error: " + xhr.responseText);
      };

      xhr.open("POST", "https://vincenzopadula.altervista.org/projects/lesson-player/feedback.php", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(json);
    });
  }

  static settings() {
    var form = new Form();

    form.appendText("separator", UI.separator, lang.setting.separator, 10);
    form.appendSelect("theme", UI.themes, lang.setting.theme);

    form.appendSelect("remainingTime", [
      {value:true, text:lang.setting.timeDisplayReal, selected:Player.shouldDisplayRealRemainingTime},
      {value:false, text:lang.setting.timeDisplayCurr, selected:!Player.shouldDisplayRealRemainingTime}
    ], lang.setting.timeDisplay);

    // Language preferences
    form.appendText("dateFormat", lang.dateFormat, lang.setting.dateFormat);
    form.help(dictionaryTags(dateDictionary));

    form.appendText("screenshotName", lang.screenshotName, lang.setting.screenshotName);
    form.help(dictionaryTags(Lesson.dummy(Class.dummy()).dictionary()));

    // To add more

    Message.view(form.wrapper, true, lang.confirm).then(() => {
      let values = form.values();
      if(values == null) {
        return;
      }

      UI.separator = decodeString(values.separator);
      UI.theme = decodeString(values.theme);

      // console.log(values.remainingTime);
      Player.shouldDisplayRealRemainingTime = values.remainingTime;

      // Language preferences
      lang.dateFormat = decodeString(values.dateFormat);
      lang.screenshotName = decodeString(values.screenshotName);

      // To add more

    }).catch(() => {
      // do nothing
    });
  }
}
