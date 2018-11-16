import './utils/appshell';

const options = {
  rootMargin: `-${Math.floor(window.innerHeight / 2)}px 0px`,
};
const handleIntersection = (entries, observer) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add('show-image');
      observer.unobserve(target);
    }
  });
};

const teamObserver = new IntersectionObserver(handleIntersection, options);
const observeTeamMember = teamObserver.observe.bind(teamObserver);
document.querySelectorAll('.article__teaser').forEach(observeTeamMember);
