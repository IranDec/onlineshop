export const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#6200EE', // A typical purple
  secondary: '#03DAC6', // A typical teal
  card: '#F5F5F5', // Light grey for card backgrounds
  border: '#E0E0E0', // Light border color
  notification: '#FF4081', // Pink for notifications or errors
  disabled: '#BDBDBD', // Grey for disabled elements
  placeholder: '#9E9E9E', // Grey for placeholder text
  header: '#FFFFFF',
  headerText: '#000000',
  bottomTabs: '#FFFFFF',
  bottomTabsText: '#000000',
  bottomTabsActive: '#6200EE',
};

export const darkTheme = {
  background: '#121212', // Dark background
  text: '#FFFFFF', // Light text
  primary: '#BB86FC', // Lighter purple for dark mode
  secondary: '#03DAC5', // Similar teal, often works on dark
  card: '#1E1E1E', // Darker grey for card backgrounds
  border: '#272727', // Darker border color
  notification: '#CF6679', // Softer pink/red for dark mode errors
  disabled: '#424242', // Darker grey for disabled elements
  placeholder: '#757575', // Darker grey for placeholder text
  header: '#1E1E1E',
  headerText: '#FFFFFF',
  bottomTabs: '#1E1E1E',
  bottomTabsText: '#FFFFFF',
  bottomTabsActive: '#BB86FC',
};

export type Theme = typeof lightTheme; // Define a Theme type
export type ThemeMode = 'light' | 'dark';
