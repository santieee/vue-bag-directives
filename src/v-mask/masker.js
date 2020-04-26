export function masker(value, mask, masked = true, tokens) {
  return Array.isArray(mask)
         ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens)
         : maskit(value, mask, masked, tokens)
}

function maskit (value, mask, masked = true, tokens) {
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
  }

  // fix mask that ends with a char: (#)
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

  
function dynamicMask (maskit, masks, tokens) {
  masks = masks.sort((a, b) => a.length - b.length)
  return function (value, mask, masked = true) {
    let i = 0
    while (i < masks.length) {
      let currentMask = masks[i]
      i++
      let nextMask = masks[i]
      if (! (nextMask && maskit(value, nextMask, true, tokens).length > currentMask.length) ) {
        return maskit(value, currentMask, masked, tokens)
      }
    }
    return '' // empty masks
  }
}