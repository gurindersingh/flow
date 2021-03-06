/**
    * v0.0.1
    * (c) 2018 Baianat
    * @license MIT
    */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Beehive = factory());
}(this, (function () { 'use strict';

  /**
   * Utilities
   */
  function async(callback) {
    setTimeout(callback, 16);
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Beehive = function () {
    function Beehive(flow, settings) {
      classCallCheck(this, Beehive);

      this.flow = flow;
      this.settings = Object.assign({}, Beehive.defaults, settings);
    }

    createClass(Beehive, [{
      key: 'init',
      value: function init() {
        this.beehive = document.createElement('div');
        var fragment = document.createDocumentFragment();
        var radius = this.settings.radius;
        var xShift = radius + radius / 2;
        var yShift = radius / 2;
        var cellPerWidth = Math.round(this.flow.sliderWidth / (radius * 1.5) + 1);
        var cellPerHeight = this.flow.sliderHeight / radius;
        var cellsCount = cellPerWidth * cellPerHeight * 2 + cellPerWidth;

        this.beehive.classList.add('beehive');
        this.beehive.insertAdjacentHTML('afterbegin', '<div class="beehive-cell"></div>'.repeat(cellsCount));
        this.cells = Array.from(this.beehive.querySelectorAll('.beehive-cell'));
        this.cells.forEach(function (cell, i) {
          var x = i % cellPerWidth + 0.5 * (Math.floor(i / cellPerWidth) % 2);
          var y = Math.floor(i / cellPerWidth);
          var deltaX = x * xShift;
          var deltaY = y * yShift;
          cell.style.transitionDelay = i * 0.01 + 's';
          cell.style.clipPath = 'polygon(\n        ' + deltaX + 'px                    ' + (deltaY + radius * -0.50) + 'px,\n        ' + (deltaX + radius * 0.50) + 'px  ' + (deltaY + radius * -0.50) + 'px,\n        ' + (deltaX + radius * 0.75) + 'px  ' + deltaY + 'px,\n        ' + (deltaX + radius * 0.50) + 'px  ' + (deltaY + radius * 0.50) + 'px,\n        ' + deltaX + 'px                    ' + (deltaY + radius * 0.50) + 'px,\n        ' + (deltaX + radius * -0.25) + 'px ' + deltaY + 'px\n      )';
        });
        fragment.appendChild(this.beehive);
        this.flow.el.appendChild(fragment);
        this.updateBackground();
      }
    }, {
      key: 'updateSlide',
      value: function updateSlide(slideNumber) {
        var _this = this;

        var lastCell = this.cells[this.cells.length - 1];
        var activeSlide = this.flow.slides[this.flow.activeIndex];
        var nextSlide = this.flow.slides[slideNumber];

        this.beehive.classList.add('is-active');
        var enterClass = 'is-entering';
        var leaveClass = 'is-leaving';
        var activeClass = 'is-active';

        activeSlide.classList.add(leaveClass);
        nextSlide.classList.add(enterClass);

        async(function () {
          activeSlide.classList.remove(activeClass);
          nextSlide.classList.remove(enterClass);
          nextSlide.classList.add(activeClass);
        });

        this.flow.el.style.overflow = 'visible';

        var transitionEndCallback = function transitionEndCallback() {
          _this.flow.activeIndex = slideNumber;
          _this.flow.updating = false;
          _this.flow.el.style.overflow = '';

          _this.beehive.classList.remove('is-active');
          activeSlide.classList.remove(leaveClass);

          _this.updateBackground();
          lastCell.removeEventListener('transitionend', transitionEndCallback);
        };

        async(function () {
          _this.cells.forEach(function (cell) {
            cell.classList.add('is-hidden');
          });
          lastCell.addEventListener('transitionend', transitionEndCallback);
        });
      }
    }, {
      key: 'updateBackground',
      value: function updateBackground() {
        console.log(this.flow.activeIndex);
        var currentImage = this.flow.imagesSrc[this.flow.activeIndex];
        this.cells.forEach(function (cell) {
          cell.style.backgroundImage = 'url(' + currentImage + ')';
          cell.classList.remove('is-hidden');
        });
      }

      // eslint-disable-next-line

    }]);
    return Beehive;
  }();

  Beehive.defaults = {
    radius: 250
  };

  return Beehive;

})));
