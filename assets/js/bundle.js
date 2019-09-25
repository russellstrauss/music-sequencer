(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {
      sequencer: {
        columns: 60,
        rows: 7
      }
    },
    init: function init() {
      var self = this; // setup a polyphonic sampler

      var keys = new Tone.Players({
        'A': './audio/casio/A1.[mp3|ogg]',
        'C#': './audio/casio/Cs2.[mp3|ogg]',
        'E': './audio/casio/E2.[mp3|ogg]',
        'F#': './audio/casio/Fs2.[mp3|ogg]',
        'G': './audio/casio/G2.[mp3|ogg]',
        'C': './audio/casio/C2.[mp3|ogg]',
        'Bb': './audio/casio/As2.[mp3|ogg]'
      }, {
        'volume': -10,
        'fadeOut': '64n'
      }).toMaster();
      var notes = ['D4', 'D4', 'D4', 'D4', 'D4', 'D4', 'Bb2'];
      var synth = new Tone.FMSynth().toMaster();
      var noteNames = ['D', 'C', 'G', 'F#', 'E', 'C#', 'Bb4'];
      var sequence = [];

      for (var i = 0; i < this.settings.sequencer.columns; i++) {
        sequence.push(i + 1);
      }

      var tss = document.querySelector('tone-step-sequencer');
      tss.columns = this.settings.sequencer.columns;
      tss.rows = this.settings.sequencer.rows;
      var sequencer = document.querySelector('tone-step-sequencer');
      var keys = Object.keys(sequencer);
      console.log(keys);
      console.log(sequencer.values);
      var loop = new Tone.Sequence(function (time, currentCol) {
        var column = document.querySelector('tone-step-sequencer').currentColumn;
        column.forEach(function (val, row) {
          console.log(column);

          if (val) {
            var vel = Math.random() * 0.5 + 0.5; // slightly randomized velocities
            //keys.get(noteNames[i]).start(time, 0, '32n', 0, vel); // 32n: note length

            synth.triggerAttackRelease(notes[row], '32n');
          }
        });
        Tone.Draw.schedule(function () {
          //set the column on the correct draw frame
          document.querySelector('tone-step-sequencer').setAttribute('highlight', currentCol);
        }, time);
      }, sequence, '16n').start(0); // sequence speed

      document.querySelector('tone-transport').bind(Tone.Transport);
      Tone.Transport.on('stop', function () {
        setTimeout(function () {
          document.querySelector('tone-step-sequencer').setAttribute('highlight', '-1');
        }, 100);
      }); // Removed scoped custom styles

      var toneContentStyle = document.querySelector('tone-content').shadowRoot.querySelector('style');
      toneContentStyle.remove();
      setTimeout(function () {
        self.addRowClasses();
      }, 0);
    },
    addRowClasses: function addRowClasses() {
      var self = this;
      var sequencer = document.querySelector('tone-step-sequencer');
      var columns = sequencer.shadowRoot.querySelectorAll('.column');
      columns.forEach(function (column) {
        var columnIndex = Array.prototype.indexOf.call(column.parentNode.children, column);
        column.setAttribute('column', columnIndex);
        var rows = column.querySelectorAll('.row');
        rows.forEach(function (row) {
          var rowIndex = Array.prototype.indexOf.call(column.children, row);
          row.setAttribute('row', rowIndex);
        });
      });
      self.highlightInterval(6, 0, 2);
      self.highlightInterval(5, 1, 4);
    },
    highlightInterval: function highlightInterval(rowIndex, startingColumn, interval) {
      var sequencer = document.querySelector('tone-step-sequencer');
      var cells = sequencer.shadowRoot.querySelectorAll('[row="' + rowIndex + '"]');
      var startingIndex = startingColumn;

      while (startingIndex > 0) {
        var newVal = startingIndex - interval;
        if (newVal > 0) startingIndex = newVal;else break;
      }

      for (var i = startingIndex; i < cells.length; i += interval) {
        sequencer.values[i][rowIndex] = true;
        cells[i].classList.add('filled');
      }
    },
    addEvents: function addEvents() {}
  };
};

},{}],2:[function(require,module,exports){
"use strict";

var Sequencer = require('./components/sequencer.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    Sequencer().init();
  });
})();

},{"./components/sequencer.js":1,"./utils.js":3}],3:[function(require,module,exports){
"use strict";

(function () {
  var appSettings;

  window.utils = function () {
    return {
      appSettings: {
        breakpoints: {
          mobileMax: 767,
          tabletMin: 768,
          tabletMax: 991,
          desktopMin: 992,
          desktopLargeMin: 1200
        }
      },
      mobile: function mobile() {
        return window.innerWidth < this.appSettings.breakpoints.tabletMin;
      },
      tablet: function tablet() {
        return window.innerWidth > this.appSettings.breakpoints.mobileMax && window.innerWidth < this.appSettings.breakpoints.desktopMin;
      },
      desktop: function desktop() {
        return window.innerWidth > this.appSettings.breakpoints.desktopMin;
      },
      getBreakpoint: function getBreakpoint() {
        if (window.innerWidth < this.appSettings.breakpoints.tabletMin) return 'mobile';else if (window.innerWidth < this.appSettings.breakpoints.desktopMin) return 'tablet';else return 'desktop';
      },
      debounce: function debounce(func, wait, immediate) {
        var timeout;
        return function () {
          var context = this,
              args = arguments;

          var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };

          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },

      /* Purpose: Detect if any of the element is currently within the viewport */
      anyOnScreen: function anyOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      },

      /* Purpose: Detect if an element is vertically on screen; if the top and bottom of the element are both within the viewport. */
      allOnScreen: function allOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.bottom < bounds.top && viewport.top > bounds.bottom);
      },
      secondsToMilliseconds: function secondsToMilliseconds(seconds) {
        return seconds * 1000;
      },

      /*
      * Purpose: This method allows you to temporarily disable an an element's transition so you can modify its proprties without having it animate those changing properties.
      * Params:
      * 	-element: The element you would like to modify.
      * 	-cssTransformation: The css transformation you would like to make, i.e. {'width': 0, 'height': 0} or 'border', '1px solid black'
      */
      getTransitionDuration: function getTransitionDuration(element) {
        var $element = $(element);
        return utils.secondsToMilliseconds(parseFloat(getComputedStyle($element[0])['transitionDuration']));
      },
      isInteger: function isInteger(number) {
        return number % 1 === 0;
      },
      rotate: function rotate(array) {
        array.push(array.shift());
        return array;
      }
    };
  }();

  module.exports = window.utils;
})();

},{}]},{},[2]);
