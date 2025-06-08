import 'react-native-gesture-handler'; // Must be at the top
import { I18nManager } from 'react-native';
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Allow RTL layout
I18nManager.allowRTL(true);
// For full RTL effect on language change, a dynamic forceRTL and app restart might be needed.
// Example: if (i18n.language === 'fa' && !I18nManager.isRTL) { I18nManager.forceRTL(true); RNRestart.Restart(); }

AppRegistry.registerComponent(appName, () => App);
