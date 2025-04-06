const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

export default {
  scripts: {
    preinstall: "npm install --legacy-peer-deps && exit 0"
  },
  expo: {
    name: "HereBoard",
    slug: "HereBoard",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    "extra": {
      "eas": {
        "projectId": "dc2ee14b-3a94-46eb-9c07-6ccda07da3ac"
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lomacanderson.HereBoard",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.lomacanderson.HereBoard"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_TOKEN
        }
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};