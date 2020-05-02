{
  "name": "GrinPlusPlus",
  "productName": "Grin++",
  "version": "1.0.0",
  "description": "Grin++ Wallet",
  "author": "David Burkett",
  "license": "MIT",
  "private": true,
  "dependencies": {
    "@babel/runtime": "^7.9.0",
    "@blueprintjs/core": "^3.23.1",
    "@blueprintjs/table": "^3.8.3",
    "@craco/craco": "^5.6.4",
    "@types/classnames": "^2.2.9",
    "@types/jest": "^25.1.4",
    "@types/react": "16.9.13",
    "@types/react-dom": "16.9.4",
    "@types/styled-components": "^5.0.1",
    "@types/uuid": "^7.0.2",
    "about-window": "^1.13.2",
    "acorn": "^7.1.1",
    "classnames": "^2.2.6",
    "easy-peasy": "^3.3.0",
    "electron-log": "^4.1.1",
    "file-saver": "^2.0.2",
    "immutability-helper": "^3.0.1",
    "node-fetch": "^2.6.0",
    "node-sass": "^4.13.1",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-dropzone": "^10.2.2",
    "react-number-format": "^4.4.0",
    "react-router-dom": "^5.1.2",
    "react-scripts": "^3.4.1",
    "styled-components": "^5.0.1",
    "typed-rest-client": "^1.7.2",
    "typescript": "^3.8.3",
    "uuid": "^7.0.2"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@testing-library/react": "^9.5.0",
    "@types/enzyme": "^3.10.5",
    "@types/enzyme-adapter-react-16": "^1.0.6",
    "@types/file-saver": "^2.0.1",
    "@types/react-router-dom": "^5.1.3",
    "@typescript-eslint/eslint-plugin": "^2.25.0",
    "@typescript-eslint/parser": "^2.25.0",
    "cross-env": "^6.0.3",
    "electron": "^7.2.1",
    "electron-builder": "^22.4.1",
    "electron-notarize": "^0.3.0",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.2",
    "eslint": "^6.8.0",
    "eslint-plugin-flowtype": "^4.7.0",
    "eslint-plugin-react": "^7.18.3",
    "fetch-mock-jest": "^1.2.4",
    "foreman": "^3.0.1",
    "husky": "^3.1.0",
    "jest-electron": "^0.1.11",
    "lint-staged": "^9.5.0",
    "prettier": "^1.19.1",
    "tslint": "^6.1.0"
  },
  "homepage": "./",
  "main": "./src/electron-starter.js",
  "scripts": {
    "start": "craco start start",
    "build": "craco build",
    "test": "craco test",
    "electron": "electron .",
    "dev": "nf start",
    "lint": "eslint src",
    "lint:fix": "eslint './src/**/*.{ts,tsx}'",
    "postinstall": "electron-builder install-app-deps",
    "preelectron-pack": "npm run build",
    "pack": "npm run build && ./node_modules/.bin/electron-builder build -mwl"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
  },
  "jest": {
    "moduleNameMapper": {
      "electron": "<rootDir>/mocks/electronMock.js",
      "fs": "<rootDir>/mocks/fsMock.js",
      "child_process": "<rootDir>/mocks/childProcessMock.js"
    }
  },
  "build": {
    "appId": "GrinPlusPlus",
    "files": [
      "./build/**/*",
      "./node_modules/**/*",
      "./package.json",
    ],
    "directories": {
      "buildResources": "build"
    },
    "publish": [
      {
        "provider": "github",
        "owner": "GrinPlusPlus",
        "repo": "GrinPlusPlus"
      }
    ],
    "afterSign": "./build/notarize.js",
    "nsis": {
      "artifactName": "Grin++ ${version} Setup.${ext}",
      "oneClick": true,
      "createDesktopShortcut": true,
      "deleteAppDataOnUninstall": false,
      "installerIcon": "./assets/icons/GrinLogo.ico",
      "uninstallerIcon": "./assets/icons/GrinLogo.ico",
      "uninstallDisplayName": "Grin++"
    },
    "win": {
      "target": "nsis",
      "icon": "./assets/icons/GrinLogo.ico",
      "publisherName": "Grin++",
      "verifyUpdateCodeSignature": false
    },
    "asar": true,
    "asarUnpack": [
      "**/dist/bin/**/*"
    ],
    "mac": {
      "category": "public.app-category.finance",
      "target": [
        "dmg",
        "zip"
      ],
      "gatekeeperAssess": false,
      "hardenedRuntime": true,
      "entitlements": "./build/entitlements.mac.plist",
      "entitlementsInherit": "./build/entitlements.mac.plist"
    },
    "dmg": {
      "artifactName": "Grin++ ${version} Setup.${ext}"
    },
    "linux": {
      "target": [
        "deb",
        "appImage"
      ],
      "icon": "./assets/icons",
      "category": "Finance"
    },
    "deb": {
      "depends": [
        "gconf2",
        "gconf-service",
        "libnotify4",
        "libappindicator1",
        "libxtst6",
        "libnss3",
        "libasound2"
      ],
      "artifactName": "GrinPlusPlus ${version}.${ext}"
    },
    "appImage": {
      "artifactName": "GrinPlusPlus ${version}.${ext}"
    }
  }
}
