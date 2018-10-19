const simpleGit = require('simple-git')(process.cwd());
const semver = require('semver');
const pkg = require('../package.json');
const { version, deployedVersion } = pkg;

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
  const path = require('path');
  const writePkg = require('write-pkg');
  const ghPages = require('gh-pages');

  const updateDeployedVersion = () => {
    writePkg(path.resolve(__dirname, '../package.json'), {
      ...pkg,
      deployedVersion: version,
    });
    console.log(`Successfully deployed version ${version}`);
  };

  ghPages.publish(
    'dist',
    {
      tag: version,
      message: `Deploy | ${new Date().toLocaleString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        hour12: false,
        minute: 'numeric',
        timeZone: 'Europe/Berlin',
      })}`,
    },
    updateDeployedVersion,
  );
};

// Abbruch, falls keine gültige Versionsnummer in package.json
if (!semver.valid(version)) {
  logAndExit(`Field 'version' in package.json is not valid! Aborting.`);
}

simpleGit.fetch(error => {
  if (error) logAndExit(error, 1);

  simpleGit.status((error, status) => {
    if (error) logAndExit(error, 1);

    const { current: currentBranch, behind } = status;

    if (currentBranch !== 'master') {
      logAndExit(
        `You can only deploy from branch 'master' but currently are on '${currentBranch}'. Aborting.`,
      );
    }

    // Abbruch, falls master nicht up-to-date mit origin/master
    if (!!behind) {
      logAndExit(
        `Your local branch is not up-to-date with 'origin/master'.
        Push or pull all changes before deploying. Aborting.`,
      );
    }

    if (semver.valid(deployedVersion)) {
      // 'deployedVersion' angegeben?
      // Abbruch, falls 'version' nicht aktueller als 'deployedVersion'
      if (!semver.gt(version, deployedVersion)) {
        logAndExit([
          `The current version is already deployed. Aborting.`,
          `Bump the version number in package.json before deploying.`,
        ]);
      }

      publishToGitHub();
    } else {
      // 'deployedVersion' nicht angegeben? Deployen, dann neu definieren
      log([
        '⚠',
        `Field 'deployedVersion' in package.json is not a valid version number.`,
        `It will be set to the current version after this deploy.`,
      ]);
      publishToGitHub();
    }
  });
});
