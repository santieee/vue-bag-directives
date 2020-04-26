(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueKit = {}));
}(this, (function (exports) { 'use strict';

  function masker(value, mask, masked = true, tokens) {
    return Array.isArray(mask) ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens) : maskit(value, mask, masked, tokens);
  }

  function maskit(value, mask, masked = true, tokens) {
    value = value || '';
    mask = mask || '';
    let iMask = 0;
    let iValue = 0;
    let output = '';

    while (iMask < mask.length && iValue < value.length) {
      let cMask = mask[iMask];
      let masker = tokens[cMask];
      let cValue = value[iValue];

      if (masker && !masker.escape) {
        if (masker.pattern.test(cValue)) {
          output += masker.transform ? masker.transform(cValue) : cValue;
          iMask++;
        }

        iValue++;
      } else {
        if (masker && masker.escape) {
          iMask++; // take the next mask char and treat it as char

          cMask = mask[iMask];
        }

        if (masked) output += cMask;
        if (cValue === cMask) iValue++; // user typed the same char

        iMask++;
      }
    } // fix mask that ends with a char: (#)


    let restOutput = '';

    while (iMask < mask.length && masked) {
      let cMask = mask[iMask];

      if (tokens[cMask]) {
        restOutput = '';
        break;
      }

      restOutput += cMask;
      iMask++;
    }

    return output + restOutput;
  }

  function dynamicMask(maskit, masks, tokens) {
    masks = masks.sort((a, b) => a.length - b.length);
    return function (value, mask, masked = true) {
      let i = 0;

      while (i < masks.length) {
        let currentMask = masks[i];
        i++;
        let nextMask = masks[i];

        if (!(nextMask && maskit(value, nextMask, true, tokens).length > currentMask.length)) {
          return maskit(value, currentMask, masked, tokens);
        }
      }

      return ''; // empty masks
    };
  }

  function getInput (el) {
    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      let els = el.getElementsByTagName('input');
      if (els.length !== 1) throw new Error("v-type: requires 1 input, found " + els.length);else return els[0];
    } else {
      return el;
    }
  }

  function trigger (name) {
    let evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
    return evt;
  }

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
      transform: v => v.toLocaleUpperCase()
    },
    a: {
      pattern: /[a-zA-Z]/,
      transform: v => v.toLocaleLowerCase()
    },
    '!': {
      escape: true
    }
  };

  function index (el, binding, tokens = {}) {
    const mask = binding.value;
    el = getInput(el);

    el.oninput = function (evt) {
      if (!evt.isTrusted) return;
      let position = el.selectionEnd;
      let digit = el.value[position - 1];
      el.value = masker(el.value, mask, true, { ...tokensDefault,
        ...tokens
      });

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

    let newValue = masker(el.value, mask, true, { ...tokensDefault,
      ...tokens
    });

    if (newValue !== el.value) {
      el.value = newValue;
      el.dispatchEvent(trigger('input'));
    }
  }

  var defaultTypes = {
    'float': /^\d*\.?\d*/,
    'number': /\d*/,
    'word': /[A-zА-я]*\s?/g,
    'ruWord': /[А-я]\s*/g
  };

  function regexVerification(value, patternName, types) {
    const regex = types[patternName];
    let result = value.match(regex);
    result = Array.isArray(result) ? result.join('') : result;
    return result;
  }

  function index$1 (el, binding, types = {}) {
    let config = binding.value;
    el = getInput(el);

    el.oninput = function (evt) {
      if (!evt.isTrusted) return;
      el.dispatchEvent(trigger('input'));
    };

    let newValue = regexVerification(el.value, config, { ...defaultTypes,
      ...types
    });

    if (newValue !== el.value) {
      el.value = newValue;
      el.dispatchEvent(trigger('input'));
    }
  }

  function index$2 (el, binding) {
    let maxLength = binding.value;
    el = getInput(el);

    el.oninput = function (evt) {
      if (!evt.isTrusted) return;
      el.dispatchEvent(trigger('input'));
    };

    let newValue = el.value.length < maxLength ? el.value : el.value.slice(0, maxLength);

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
