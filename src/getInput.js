export default function(el){
  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    let els = el.getElementsByTagName('input')
    if (els.length !== 1)  throw new Error("v-type: requires 1 input, found " + els.length)
    else return els[0]
  }else{
    return el;
  }
}