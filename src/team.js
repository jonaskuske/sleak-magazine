import { updateHash } from './utils';

const init = () => {
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
  document.querySelectorAll('article').forEach(observeTeamMember);
};

setTimeout(init, 0);
