/* Erkennen ob Browser (immer) sichtbare Scrollbar hat */
const body = document.body;
const element = document.createElement('div');
element.style =
  'width:100px;height:100px;overflow:scroll !important;position:absolute;top:-100vh';
body.appendChild(element);

const hasScrollbar = element.offsetWidth - element.clientWidth > 0;
if (hasScrollbar) body.classList.add('has-scrollbar');
body.removeChild(element);
