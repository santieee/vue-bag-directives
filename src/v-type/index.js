import defaultTypes from './types';
import {regexVerification} from './regexVerification';
import trigger from '../trigger';
import getInput from '../getInput'

export default function (el, binding, types = {}) {
  let configName = binding.value;
  if(!configName) return;
  el = getInput(el);
  if(!el.value) return;
  const allTypes = {...defaultTypes, ...types};
  const config = allTypes[configName];
  let newValue = regexVerification(el.value, config);

  el.oninput = function (evt) {
    if (!evt.isTrusted) return;
    let newValue = regexVerification(el.value, config) || '';
    if(config.type && typeof config.type() === 'number'){
      const isSafeInteger = (v) => {
        if(String(v) === '-') return true; //negative number
        if(String(v).length > 12) return false;
        return v  < Number.MAX_SAFE_INTEGER
      };

      if (!isSafeInteger(newValue)) {
        const toSafeInteger = (v) => {
          const result = Number(String(v).slice(0, -1));
          if (!isSafeInteger(result)) return toSafeInteger(result);
          return result
        }
        newValue = toSafeInteger(newValue);
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