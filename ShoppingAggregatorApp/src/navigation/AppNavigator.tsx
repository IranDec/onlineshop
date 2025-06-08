import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'; // Import DefaultTheme, DarkTheme
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from '../store'; // Import RootState
import { lightTheme, darkTheme } from '../constants/Colors'; // Import theme color palettes
import BrandListScreen from '../screens/BrandListScreen';
import WebViewScreen from '../screens/WebViewScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { TouchableOpacity, Text } from 'react-native';
import { Brand } from '../types/Brand';
import { Product } from '../types/Product';

// Define Route Parameter Types
export type RootStackParamList = {
  BrandList: undefined;
  WebView: { url: string; title?: string; brand?: Brand };
  Cart: undefined;
  Checkout: undefined; // No params for CheckoutScreen
};

// Define Navigation Prop Types for specific screens if needed for type safety
// Example: Navigation prop for BrandListScreen
export type BrandListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BrandList'>;

// Example: Navigation prop for WebViewScreen (though route prop is more common for params)
export type WebViewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WebView'>;


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const currentThemeMode = useSelector((state: RootState) => state.theme.mode);

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: lightTheme.background,
      card: lightTheme.card,
      text: lightTheme.text,
      primary: lightTheme.primary,
      border: lightTheme.border,
    }
  };
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: darkTheme.background,
      card: darkTheme.card,
      text: darkTheme.text,
      primary: darkTheme.primary,
      border: darkTheme.border,
    }
  };
  const navigationTheme = currentThemeMode === 'dark' ? MyDarkTheme : MyLightTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="BrandList"
        screenOptions={{
          headerStyle: { backgroundColor: navigationTheme.colors.card }, // Use theme for header
          headerTintColor: navigationTheme.colors.text, // Use theme for header text
        }}
      >
        <Stack.Screen
          name="BrandList"
          component={BrandListScreen}
          options={({ navigation }) => ({
            title: t('brandList.title'), // Use translation for title
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ marginRight: 15 }}>
                <Text style={{ color: navigationTheme.colors.primary }}>{t('brandList.cart')}</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={({ route, navigation }) => ({
            title: route.params.title || t('webViewScreen.title', 'Web View'),
            headerBackTitle: t('navigation.back', 'Back'),
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ marginRight: 15 }}>
                <Text style={{ color: navigationTheme.colors.primary }}>{t('webViewScreen.cart')}</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: t('cartScreen.title') }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: t('checkoutScreen.title') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
