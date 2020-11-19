(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es.array.slice'), require('core-js/modules/es.number.constructor'), require('core-js/modules/es.number.max-safe-integer'), require('core-js/modules/es.array.join'), require('core-js/modules/es.regexp.exec'), require('core-js/modules/es.string.match')) :
  typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es.array.slice', 'core-js/modules/es.number.constructor', 'core-js/modules/es.number.max-safe-integer', 'core-js/modules/es.array.join', 'core-js/modules/es.regexp.exec', 'core-js/modules/es.string.match'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueKit = {}));
}(this, (function (exports) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  function masker(value, mask) {
    var masked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var tokens = arguments.length > 3 ? arguments[3] : undefined;
    return Array.isArray(mask) ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens) : maskit(value, mask, masked, tokens);
  }

  function maskit(value, mask) {
    var masked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var tokens = arguments.length > 3 ? arguments[3] : undefined;
    value = value || '';
    mask = mask || '';
    var iMask = 0;
    var iValue = 0;
    var output = '';

    while (iMask < mask.length && iValue < value.length) {
      var cMask = mask[iMask];
      var _masker = tokens[cMask];
      var cValue = value[iValue];

      if (_masker && !_masker.escape) {
        if (_masker.pattern.test(cValue)) {
          output += _masker.transform ? _masker.transform(cValue) : cValue;
          iMask++;
        }

        iValue++;
      } else {
        if (_masker && _masker.escape) {
          iMask++; // take the next mask char and treat it as char

          cMask = mask[iMask];
        }

        if (masked) output += cMask;
        if (cValue === cMask) iValue++; // user typed the same char

        iMask++;
      }
    } // fix mask that ends with a char: (#)


    var restOutput = '';

    while (iMask < mask.length && masked) {
      var _cMask = mask[iMask];

      if (tokens[_cMask]) {
        restOutput = '';
        break;
      }

      restOutput += _cMask;
      iMask++;
    }

    return output + restOutput;
  }

  function dynamicMask(maskit, masks, tokens) {
    var _this = this;

    masks = masks.sort(function (a, b) {
      _newArrowCheck(this, _this);

      return a.length - b.length;
    }.bind(this));
    return function (value, mask) {
      var masked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var i = 0;

      while (i < masks.length) {
        var currentMask = masks[i];
        i++;
        var nextMask = masks[i];

        if (!(nextMask && maskit(value, nextMask, true, tokens).length > currentMask.length)) {
          return maskit(value, currentMask, masked, tokens);
        }
      }

      return ''; // empty masks
    };
  }

  function getInput (el) {
    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      var els = el.getElementsByTagName('input');
      return els[0];
    } else {
      return el;
    }
  }

  function trigger (name) {
    var evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
    return evt;
  }

  var _this = undefined;

  var tokensDefault = {
    '#': {
      pattern: /\d/
    },
    X: {
      pattern: /[0-9a-zA-Z]/
    },
    S: {
      pattern: /[a-zA-Z]/
    },
    A: {
      pattern: /[a-zA-Z]/,
      transform: function transform(v) {
        _newArrowCheck(this, _this);

        return v.toLocaleUpperCase();
      }.bind(undefined)
    },
    a: {
      pattern: /[a-zA-Z]/,
      transform: function transform(v) {
        _newArrowCheck(this, _this);

        return v.toLocaleLowerCase();
      }.bind(undefined)
    },
    '!': {
      escape: true
    }
  };

  function index (el, binding) {
    var tokens = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var mask = binding.value;
    if (!mask) return;
    el = getInput(el);

    el.oninput = function (evt) {
      if (!evt.isTrusted) return;
      var position = el.selectionEnd;
      var digit = el.value[position - 1];
      el.value = masker(el.value, mask, true, _objectSpread2(_objectSpread2({}, tokensDefault), tokens));

      while (position < el.value.length && el.value.charAt(position - 1) !== digit) {
        position++;
      }

      if (el === document.activeElement) {
        el.setSelectionRange(position, position);
        setTimeout(function () {
          el.setSelectionRange(position, position);
        }, 0);
      }

      el.dispatchEvent(trigger('input'));
    };

    var newValue = masker(el.value, mask, true, _objectSpread2(_objectSpread2({}, tokensDefault), tokens));

    if (newValue !== el.value) {
      el.value = newValue;
      el.dispatchEvent(trigger('input'));
    }
  }

  var defaultTypes = {
    'float': {
      pattern: /^\d*\.?\d*/,
      type: Number
    },
    'number': {
      pattern: /\d*/,
      type: Number
    },
    'word': {
      pattern: /[A-zА-я]*\s?/g
    },
    'ruWord': {
      pattern: /[А-я]\s*/g
    }
  };

  function regexVerification(value, type) {
    var regex = type.pattern;
    var result = value.match(regex);
    result = Array.isArray(result) ? result.join('') : result;
    return result;
  }

  function index$1 (el, binding) {
    var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var configName = binding.value;
    if (!configName) return;
    el = getInput(el);
    if (!el.value) return;

    var allTypes = _objectSpread2(_objectSpread2({}, defaultTypes), types);

    var config = allTypes[configName];
    var newValue = regexVerification(el.value, config);

    el.oninput = function (evt) {
      var _this = this;

      if (!evt.isTrusted) return;
      var newValue = regexVerification(el.value, config) || '';

      if (config.type && typeof config.type() === 'number') {
        var isSafeInteger = function isSafeInteger(v) {
          _newArrowCheck(this, _this);

          if (String(v).length > 12) return false;
          return v < Number.MAX_SAFE_INTEGER;
        }.bind(this);

        if (!isSafeInteger(newValue)) {
          var _toSafeInteger = function toSafeInteger(v) {
            _newArrowCheck(this, _this);

            if (String(v) === '-') return true; //negative number

            var result = Number(String(v).slice(0, -1));
            if (!isSafeInteger(result)) return _toSafeInteger(result);
            return result;
          }.bind(this);

          newValue = _toSafeInteger(newValue);
        }
      }

      el.value = newValue;
      el.dispatchEvent(trigger('input'));
    };

    if (newValue !== el.value) {
      el.value = newValue || '';
      el.dispatchEvent(trigger('input'));
    }
  }

  function index$2 (el, binding) {
    var maxLength = binding.value;
    if (!maxLength) return;
    el = getInput(el);

    el.oninput = function (evt) {
      if (!evt.isTrusted) return;
      el.dispatchEvent(trigger('input'));
    };

    var newValue = el.value.length < maxLength ? el.value : el.value.slice(0, maxLength);

    if (newValue !== el.value) {
      el.value = newValue;
      el.dispatchEvent(trigger('input'));
    }
  }

  exports.maskDirective = index;
  exports.maxLengthDirective = index$2;
  exports.typeDirective = index$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
