import trigger from '../trigger';
import getInput from '../getInput';

export default function (el, binding) {
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