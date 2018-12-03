// Detect if browser has a (constantly) visible scrollbar affecting page width
const body = document.body;
const element = document.createElement('div');
element.style =
  'width:100px;height:100px;overflow:scroll !important;position:absolute;top:-100vh';
body.appendChild(element);

const hasScrollbar = element.offsetWidth - element.clientWidth > 0;
// If Scrollbar has a width: add CSS class so styles can adapt
if (hasScrollbar) body.classList.add('has-scrollbar');
body.removeChild(element);
