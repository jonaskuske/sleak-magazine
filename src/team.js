import { $$, updateHash } from './utils';

const startObserver = () => {
  const teamMemberImages = $$('article .team__image');

  const options = { rootMargin: `-1px 0px` };
  const handleIntersection = entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        const article = target.closest('article');
        updateHash(article.id);
        article.classList.add('show-image');
      }
    });
  };

  const teamObserver = new IntersectionObserver(handleIntersection, options);
  const observeTeamMember = teamObserver.observe.bind(teamObserver);

  teamMemberImages.forEach(observeTeamMember);
};

window.onload = startObserver;
