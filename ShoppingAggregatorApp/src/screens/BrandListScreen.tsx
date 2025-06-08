import React from 'react';
import { FlatList, StyleSheet, View, Text, Button, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'; // Import useDispatch for theme toggle
import { toggleTheme } from '../store/slices/themeSlice'; // Import toggleTheme action
import { useAppTheme } from '../hooks/useAppTheme'; // Import useAppTheme
import BrandListItem from '../components/BrandListItem';
import { Brand } from '../types/Brand';
import brandsData from '../assets/data/brands.json';

import { BrandListScreenNavigationProp, RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

// interface BrandListScreenProps {
//   navigation: BrandListScreenNavigationProp;
// }

// Use StackNavigationProp directly for the navigation prop type
type BrandListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'BrandList'>;
};


const BrandListScreen: React.FC<BrandListScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const theme = useAppTheme(); // Get current theme colors
  const dispatch = useDispatch(); // For theme toggle

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // RTL handling is now within i18n.ts on languageChanged event
    // Forcing a reload might be needed for full RTL style application if not handled automatically
    // if (lng === 'fa' && !I18nManager.isRTL) {
    //   I18nManager.forceRTL(true);
    //   // RNRestart.Restart(); // Requires react-native-restart
    // } else if (lng !== 'fa' && I18nManager.isRTL) {
    //   I18nManager.forceRTL(false);
    //   // RNRestart.Restart();
    // }
  };

  const handleBrandPress = (brand: Brand) => {
    console.log('Navigating to Brand:', brand.name);
    navigation.navigate('WebView', { url: brand.websiteUrl, title: brand.name, brand: brand });
  };

  const renderBrand = ({ item }: { item: Brand }) => (
    <BrandListItem brand={item} onPress={handleBrandPress} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.controlsContainer, { backgroundColor: theme.card }]}>
        <View style={styles.langSwitcherContainer}>
          <Button title="English" onPress={() => changeLanguage('en')} color={theme.primary} />
          <Button title="فارسی" onPress={() => changeLanguage('fa')} color={theme.primary} />
        </View>
        <Button title={t('theme.toggle', 'Toggle Theme')} onPress={() => dispatch(toggleTheme())} color={theme.secondary} />
      </View>
      <FlatList
        data={brandsData as Brand[]}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Re-define styles with a function to access theme
const makeStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.background, // Applied inline
  },
  controlsContainer: {
    paddingVertical: 10,
    // backgroundColor: theme.card, // Applied inline
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  langSwitcherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10, // Add some space before the theme toggle button
  },
  listContent: {
    paddingHorizontal: 5,
  },
  // title is handled by navigator
});

// Use a wrapper component to pass theme to makeStyles or use theme directly in styles
const ThemedBrandListScreen: React.FC<BrandListScreenProps> = (props) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme); // Generate styles with current theme

  // This is a bit of a workaround because hooks can't be called conditionally
  // and navigation options are set outside the main render.
  // For dynamic headerRight text color based on theme, AppNavigator needs access to theme,
  // which it already has for its own elements. The text button color there would also need theme.
  // For now, the color in AppNavigator for the cart button is hardcoded.

  return <BrandListScreen {...props} />; // Original component, but styles need to be applied from here or context
};


// This approach of redefining styles or passing theme down is common.
// For this specific case, let's simplify and apply theme directly in the original component's style prop
// and make the styles function accept theme.

const BrandListScreenWithTheme: React.FC<BrandListScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const theme = useAppTheme();
  const dispatch = useDispatch();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Dynamic styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    controlsContainer: {
      paddingVertical: 10,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    langSwitcherContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    listContent: {
      paddingHorizontal: 5,
    },
    // title is handled by AppNavigator
  });


  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <View style={styles.langSwitcherContainer}>
          <Button title="English" onPress={() => changeLanguage('en')} color={theme.primary} />
          <Button title="فارسی" onPress={() => changeLanguage('fa')} color={theme.primary} />
        </View>
        <Button title={t('theme.toggle', 'Toggle Theme')} onPress={() => dispatch(toggleTheme())} color={theme.secondary} />
      </View>
      <FlatList
        data={brandsData as Brand[]}
        renderItem={({ item }) => <BrandListItem brand={item} onPress={() => {
            console.log('Navigating to Brand:', item.name);
            navigation.navigate('WebView', { url: item.websiteUrl, title: item.name, brand: item });
        }} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default BrandListScreenWithTheme;
