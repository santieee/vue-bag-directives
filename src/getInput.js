export default function(el){
  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    let els = el.getElementsByTagName('input')
    return els[0]
  }else{
    return el;
  }
}