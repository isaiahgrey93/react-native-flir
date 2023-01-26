const os = require('os');
const child_process = require('child_process');

const options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
  encoding: 'utf-8',
};

if (os.type() === 'Windows_NT') {
  options.shell = true;
}

// Fetch Flir SDK Files from GIT LFS
console.log(`\nFetching FLIR SDK files from GIT LFS...`);
child_process.spawnSync('git', ['lfs fetch'], options);

// Install FLIR SDK for Android - START
console.log(`\nInstalling FLIR SDK for Android...`);

child_process.spawnSync('rm', ['-rf', './android/flirsdk'], options);
child_process.spawnSync('mkdir', ['-p', './android/flirsdk'], options);

child_process.spawnSync(
  'cp',
  [
    '-R',
    './flir/android/androidsdk-release.aar',
    './android/flirsdk/androidsdk-release.aar',
  ],
  options
);

child_process.spawnSync(
  'cp',
  [
    '-R',
    './flir/android/thermalsdk-release.aar',
    './android/flirsdk/thermalsdk-release.aar',
  ],
  options
);

console.log(`FLIR SDK for Android installed!\n`);
// Install FLIR SDK for Android - END
