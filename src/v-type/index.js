import defaultTypes from './types';
import {regexVerification} from './regexVerification';
import trigger from '../trigger';
import getInput from '../getInput'

export default function (el, binding, types = {}) {
  let config = binding.value;
  if(!config) return;
  el = getInput(el);
  if(!el.value) return;
  let newValue = regexVerification(el.value, config, {...defaultTypes, ...types});

  el.oninput = function (evt) {
    if (!evt.isTrusted) return;
    el.value = regexVerification(el.value, config, {...defaultTypes, ...types}) || '';
    el.dispatchEvent(trigger('input'));
  };


  if (newValue !== el.value) {
    el.value = newValue || '';
    el.dispatchEvent(trigger('input'));
  }
}