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

## Usage

```js

```

## API

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
