import defaultTypes from './types';
import {regexVerification} from './regexVerification';
import trigger from '../trigger';
import getInput from '../getInput'

export default function (el, binding, types = {}) {
  let config = binding.value;
  el = getInput(el);

  el.oninput = function (evt) {
    if (!evt.isTrusted) return;
    el.dispatchEvent(trigger('input'));
  };

  let newValue = regexVerification(el.value, config, {...defaultTypes, ...types});
  if (newValue !== el.value) {
    el.value = newValue;
    el.dispatchEvent(trigger('input'));
  }
}