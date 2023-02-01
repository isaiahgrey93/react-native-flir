# react-native-flir

Flir SDK module for React Native

## Installation

```sh
npm install react-native-flir
```

## Native Setup

### Android Configuration

1. Update `minSdkVersion` to `28` inside `android/build.gradle` file.

```gradle
buildscript {
    ext {
        minSdkVersion = 28
    }
}
```

2. Update `packagingOptions` inside `android/app/build.gradle` file.

```gradle
android {
    packagingOptions {
        pickFirst 'lib/**/*.so'
    }
}
```

### iOS Configuration

1. Update the `ios/{FlirPoject}/Info.plist` file.

```xml
<dict>
    ...
	<key>UISupportedExternalAccessoryProtocols</key>
	<array>
		<string>com.flir.rosebud.fileio</string>
		<string>com.flir.rosebud.config</string>
		<string>com.flir.rosebud.frame</string>
	</array>
</dict>
```

## Usage

```js
// TODO;
```

## API

## Contributing

### Running the Example App

1. Install the dependencies: `yarn`
2. Start the packager: `yarn example start`
3. Build the native application: `yarn example android` or `yarn example ios`

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
