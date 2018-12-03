const path = require('path');
const semver = require('semver');
const git = require('simple-git/promise')(process.cwd());
const pkg = require('../package.json');
const { version, deployedVersion } = pkg;

const resolve = file => path.resolve(__dirname, file);
const log = message => {
  console.log(''); // Add empty line in beginning

  if (Array.isArray(message)) message.forEach(msg => console.log(msg));
  else console.log(message);
};
const logAndExit = (message, statusCode = 0) => {
  log('⚠');
  log(message);
  process.exit(statusCode);
};

/**
 * Publishes contents of 'dist' to GitHub Pages
 * and updates entry 'deployedVersion' on success
 */
const publishToGitHub = () => {
  const writePkg = require('write-pkg');
  const ghPages = require('gh-pages');

  const deployMessage = `chore: deploy v${version}`;

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

    const files = [resolve('../package.json'), resolve('../package-lock.json')];

    git
      .add(files)
      .then(() => git.commit(deployMessage, files))
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

// Abort, if there's no valid version number in package.json
if (!semver.valid(version)) {
  logAndExit(`Field 'version' in package.json is not valid! Aborting.`);
}

const verifyStatus = status => {
  const { current: currentBranch, behind } = status;

  // Abort, if not on branch 'master'
  if (currentBranch !== 'master') {
    throw `You can only deploy from branch 'master' but currently are on '${currentBranch}'. Aborting.`;
  }
  // Abort, if master is not up-to-date with origin/master
  if (!!behind) {
    throw `Your local branch is not up-to-date with 'origin/master'.
        Push or pull all changes before deploying. Aborting.`;
  }

  if (semver.valid(deployedVersion)) {
    // 'deployedVersion' specified?
    // Abort, if 'version' is not newer than 'deployedVersion'
    if (!semver.gt(version, deployedVersion)) {
      throw [
        `The current version is already deployed. Aborting.`,
        `Bump the version number in package.json before deploying.`,
      ];
    }
  } else {
    // 'deployedVersion' not specified? Issue warning, but continue
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
