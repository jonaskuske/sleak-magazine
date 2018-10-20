import './utils/appshell';
import './utils/team-selection';
import { shrug } from './utils';

const { hash } = window.location;
if (hash) shrug(hash.slice(1)); // 🤷🏻‍
