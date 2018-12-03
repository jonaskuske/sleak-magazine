import { $$, updateHash } from './utils';

// Observe the team member pages and transition them in when scrolled into view
const startObserver = () => {
  const teamMemberImages = $$('article .team__image');

  const options = { rootMargin: `-1px 0px` };
  const handleIntersection = entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        const article = target.closest('article');
        // Update the URL hash to reflect current position on the page
        updateHash(article.id);
        // Transition in the team member that was scrolled into view
        article.classList.add('show-image');
      }
    });
  };

  const teamObserver = new IntersectionObserver(handleIntersection, options);
  const observeTeamMember = teamObserver.observe.bind(teamObserver);

  teamMemberImages.forEach(observeTeamMember);
};

// Go!
window.onload = startObserver;
