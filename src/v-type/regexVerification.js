export function regexVerification(value, type){
  const regex = type.pattern;
  let result = value.match(regex);
  result = Array.isArray(result) ? result.join('') : result;
  return result;
}