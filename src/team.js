import { $$, debounce, updateHash } from './utils';

const articles = $$('article');
let activeObserver;

const createObserver = () => {
  const options = {
    rootMargin: `-${Math.floor(window.innerHeight / 2)}px 0px`,
  };
  const handleIntersection = entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        updateHash(target.id);
        target.classList.add('show-image');
      }
    });
  };

  const teamObserver = new IntersectionObserver(handleIntersection, options);
  const observeTeamMember = teamObserver.observe.bind(teamObserver);

  if (activeObserver) activeObserver.disconnect();
  articles.forEach(observeTeamMember);
  activeObserver = teamObserver;
};

window.onload = () => setTimeout(createObserver, 0);
window.addEventListener('resize', debounce(createObserver, 400));
