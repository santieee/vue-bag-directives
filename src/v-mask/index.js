import {masker} from './masker';
import getInput from '../getInput';
import trigger from '../trigger';
import tokensDefault from './tokens';

export default function (el, binding, tokens = {}) {
  const mask = binding.value;
  if(!mask) return;
  el = getInput(el);

  el.oninput = function (evt) {
    if (!evt.isTrusted) return;
    let position = el.selectionEnd;
    let digit = el.value[position-1];
    el.value = masker(el.value, mask, true, {...tokensDefault, ...tokens});
    while (position < el.value.length && el.value.charAt(position-1) !== digit) {
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

  let newValue = masker(el.value, mask, true, {...tokensDefault, ...tokens});
  if (newValue !== el.value) {
    el.value = newValue;
    el.dispatchEvent(trigger('input'));
  }
}