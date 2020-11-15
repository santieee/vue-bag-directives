export default {
  'float': {
    pattern: /^\d*\.?\d*/,
    type: Number,
  },
  'number':{
    pattern: /\d*/,
    type: Number,
  },
  'word': {
    pattern: /[A-zА-я]*\s?/g,
  },
  'ruWord': {
    pattern: /[А-я]\s*/g,
  },
 };