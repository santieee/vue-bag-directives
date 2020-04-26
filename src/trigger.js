export default function (name) {
  let evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  return evt;
}