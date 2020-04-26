<h1> @vue-bag/directives <h1/>

<h3>Set of directives to help you format input text content automatically.<h3/>


## Installation

```bash
npm install --save @vue-bag/directives
or
yarn add @vue-bag/directives
```

<a href="https://codesandbox.io/s/upbeat-lederberg-h6yji?file=/src/App.vue">Sandbox demo<a/>
## Directives

- maskDirective - formats input data for a given mask 
- typeDirective - restricts input by data type (any regex)
- maxLengthDirective - limits input data by length


```javascript
import {
  maskDirective,
  typeDirective,
  maxLengthDirective
} from "@vue-bag/directives";

Vue.directive("mask", function(el, binding) {
  maskDirective(el, binding);
});
<input v-mask="'##.##'">

Vue.directive("type", function(el, binding) {
  typeDirective(el, binding);
});
<input v-type="'float'">

Vue.directive("max-length", function(el, binding) {
  maxLengthDirective(el, binding);
});
<input v-max-length="3">

      
```


## Default tokens of maskDirective
```javascript
'#': {pattern: /\d/},
X: {pattern: /[0-9a-zA-Z]/}
S: {pattern: /[a-zA-Z]/}
A: {pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase()}
a: {pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase()}
'!': {escape: true}
```

## Default types of typeDirective
```javascript
'float': /^\d*\.?\d*/
'number': /\d*/
'word': /[A-zА-я]*\s?/g
'ruWord': /[А-я]\s*/g
'enWord': /[А-я]\s*/g
```

## Customize directives

```javascript
import {
  maskDirective,
  typeDirective,
} from "@vue-bag/directives";

const customTypes = {
  'float': /^\d*\.?\d*/,
  'number': /\d*/,
  'any': /.*/,
  'lowCase': /[а-я]/g
};
const customTokens = {
  Q: {pattern: /./},
  A: {pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase()},
};

Vue.directive("type", function(el, binding) {
  typeDirective(el, binding, customTypes);
});
Vue.directive("mask", function(el, binding) {
  maskDirective(el, binding, customTokens);
});
```