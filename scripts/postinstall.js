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

// Install FLIR SDK for Android - START
console.log(`\nInstalling FLIR SDK for Android...`);

child_process.spawnSync('rm', ['-rf', './android/flirsdk'], options);
child_process.spawnSync('mkdir', ['-p', './android/flirsdk'], options);

const android = [
  {
    source: './flir/android/androidsdk-release.aar',
    output: './android/flirsdk/androidsdk-release.aar',
  },
  {
    source: './flir/android/thermalsdk-release.aar',
    output: './android/flirsdk/thermalsdk-release.aar',
  },
];

android.forEach((file) => {
  child_process.spawnSync('cp', ['-R', file.source, file.output], options);
});

console.log(`FLIR SDK for Android installed!\n`);
// Install FLIR SDK for Android - END

// Install FLIR SDK for iOS - START
console.log(`\nInstalling FLIR SDK for iOS...`);

child_process.spawnSync('rm', ['-rf', './ios/flirsdk'], options);
child_process.spawnSync('mkdir', ['-p', './ios/flirsdk'], options);

const ios = [
  {
    source: './flir/ios/ThermalSDK.xcframework',
    output: './ios/flirsdk/ThermalSDK.xcframework',
  },
  {
    source: './flir/ios/libavdevice.58.dylib.xcframework',
    output: './ios/flirsdk/libavdevice.58.dylib.xcframework',
  },
  {
    source: './flir/ios/liblive666.dylib.xcframework',
    output: './ios/flirsdk/liblive666.dylib.xcframework',
  },
  {
    source: './flir/ios/libswresample.3.dylib.xcframework',
    output: './ios/flirsdk/libswresample.3.dylib.xcframework',
  },
  {
    source: './flir/ios/libavfilter.7.dylib.xcframework',
    output: './ios/flirsdk/libavfilter.7.dylib.xcframework',
  },
  {
    source: './flir/ios/libavutil.56.dylib.xcframework',
    output: './ios/flirsdk/libavutil.56.dylib.xcframework',
  },
  {
    source: './flir/ios/libavformat.58.dylib.xcframework',
    output: './ios/flirsdk/libavformat.58.dylib.xcframework',
  },
  {
    source: './flir/ios/libswscale.5.dylib.xcframework',
    output: './ios/flirsdk/libswscale.5.dylib.xcframework',
  },
  {
    source: './flir/ios/libavcodec.58.dylib.xcframework',
    output: './ios/flirsdk/libavcodec.58.dylib.xcframework',
  },
];

ios.forEach((file) => {
  child_process.spawnSync('cp', ['-R', file.source, file.output], options);
});

console.log(`FLIR SDK for iOS installed!\n`);
// Install FLIR SDK for iOS - END
