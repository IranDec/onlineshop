// Mock for react-native-gesture-handler
// See: https://reactnavigation.org/docs/testing/#mocking-native-modules
import 'react-native-gesture-handler/jestSetup';

// Mock for react-native-reanimated (often used with gesture handler and navigation)
// Create a __mocks__ directory for react-native-reanimated if you don't have one
// and add a file like react-native-reanimated.js with content from Reanimated docs
// For now, let's add a basic mock here if needed, or rely on jest.mock if specific functions are called.
// jest.mock('react-native-reanimated', () => {
//   const Reanimated = require('react-native-reanimated/mock');
//   Reanimated.Layout = {春夏秋冬LayoutAnimation: jest.fn()}; // Common if LayoutAnimation is used
//   Reanimated.FadeIn = {duration: jest.fn(() => ({delay: jest.fn()}))};
//   Reanimated.FadeOut = {duration: jest.fn(() => ({delay: jest.fn()}))};
//   return Reanimated;
// });


// It's also good practice to mock other native modules that might cause issues in tests
// For example, if you use react-native-screens:
jest.mock('react-native-screens', () => ({
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn(),
  enableFreeze: jest.fn(),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  const WebView = React.forwardRef((props, ref) => {
    // You can render some of the props to make sure they are passed correctly
    // For example, source.uri
    // Or just a placeholder
    return <View testID="mock-webview" source={props.source} />;
  });
  return {
    WebView,
    // WebViewMessageEvent type mock if needed for type checking tests, though usually not necessary for basic mocking.
  };
});


// Any other global mocks or setup can go here.
// For example, silencing console output during tests if it's too noisy:
// jest.spyOn(console, 'warn').mockImplementation(() => {});
// jest.spyOn(console, 'error').mockImplementation(() => {});
