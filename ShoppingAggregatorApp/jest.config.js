module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-redux|redux-persist|i18next|react-i18next|@react-navigation|react-native-webview)/)',
  ],
  setupFiles: [
    './__mocks__/@react-native-async-storage/async-storage.js'
  ],
  setupFilesAfterEnv: [
    './jest.setup.js' // For gesture handler and other environment mocks
  ]
};
