import './utils/appshell';
import './utils/team-selection';
import { shrug } from './utils';

const { hash } = window.location;
if (hash) shrug(hash.slice(1)); // 🤷🏻‍

const options = { threshold: 0.75 };
const handleIntersection = entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) target.classList.add('show-image');
  });
};

const teamObserver = new IntersectionObserver(handleIntersection, options);
const observeTeamMember = teamObserver.observe.bind(teamObserver);
document.querySelectorAll('.article__teaser').forEach(observeTeamMember);
