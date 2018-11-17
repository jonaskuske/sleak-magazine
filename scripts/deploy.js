const path = require('path');
const semver = require('semver');
const git = require('simple-git/promise')(process.cwd());
const pkg = require('../package.json');
const { version, deployedVersion } = pkg;

const resolve = file => path.resolve(__dirname, file);
const log = message => {
  console.log(''); // Leere Zeile einfügen

  if (Array.isArray(message)) message.forEach(msg => console.log(msg));
  else console.log(message);
};
const logAndExit = (message, statusCode = 0) => {
  log('⚠');
  log(message);
  process.exit(statusCode);
};

/**
 * Veröffentlicht Inhalt von 'dist' zu GitHub Pages
 * und aktualisiert bei Erfolg den Eintrag 'deployedVersion'
 */
const publishToGitHub = () => {
  const writePkg = require('write-pkg');
  const ghPages = require('gh-pages');

  const deployMessage = `Deploy | ${new Date().toLocaleString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    timeZone: 'Europe/Berlin',
  })}`;

  const finishDeploy = () => {
    // Update field 'deployedVersion' in package.json
    writePkg.sync(resolve('../package.json'), {
      ...pkg,
      deployedVersion: version,
    });

    const handleGitError = error => {
      log(error);
      logAndExit(
        [
          `Error while updating and syncing the field 'deployedVersion' in package.json`,
          `The project was deployed, but please ensure the field 'deployedVersion' matches the field 'version' in package.json, then manually push the change to 'origin/master'.`,
        ],
        1,
      );
    };

    git
      .add(resolve('../package.json'))
      .then(() => git.commit(deployMessage, [resolve('../package.json')]))
      .then(() => git.push('origin', 'master'))
      .then(() => log(['✔', 'Deploy completed successfully.']))
      .catch(handleGitError);
  };

  ghPages.publish(
    'dist',
    {
      tag: version,
      message: deployMessage,
      dotfiles: true,
    },
    finishDeploy,
  );
};

// Abbruch, falls keine gültige Versionsnummer in package.json
if (!semver.valid(version)) {
  logAndExit(`Field 'version' in package.json is not valid! Aborting.`);
}

const verifyStatus = status => {
  const { current: currentBranch, behind } = status;

  // Abbruch, falls nicht auf branch master
  if (currentBranch !== 'master') {
    throw Error(
      `You can only deploy from branch 'master' but currently are on '${currentBranch}'. Aborting.`,
    );
  }
  // Abbruch, falls master nicht up-to-date mit origin/master
  if (!!behind) {
    throw Error(
      `Your local branch is not up-to-date with 'origin/master'.
        Push or pull all changes before deploying. Aborting.`,
    );
  }

  if (semver.valid(deployedVersion)) {
    // 'deployedVersion' angegeben?
    // Abbruch, falls 'version' nicht aktueller als 'deployedVersion'
    if (!semver.gt(version, deployedVersion)) {
      throw Error([
        `The current version is already deployed. Aborting.`,
        `Bump the version number in package.json before deploying.`,
      ]);
    }
  } else {
    // 'deployedVersion' nicht angegeben? Warnen, aber fortfahren
    log([
      '⚠',
      `Field 'deployedVersion' in package.json is not a valid version number.`,
      `It will be set to the current version after this deploy.`,
    ]);
  }
};

git
  .fetch()
  .then(() => git.status())
  .then(verifyStatus)
  .then(publishToGitHub)
  .catch(error => logAndExit(error, 1));
