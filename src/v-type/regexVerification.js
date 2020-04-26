export function regexVerification(value, patternName, types){
  const regex = types[patternName];
  let result = value.match(regex);
  result = Array.isArray(result) ? result.join('') : result;
  return result;
}