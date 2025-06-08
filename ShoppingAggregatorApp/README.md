# Shopping Aggregator App

## Description

The Shopping Aggregator App allows users to browse various fashion brands, view their products within an in-app WebView, and (conceptually) add items to a unified native cart. The app demonstrates a basic framework for intercepting "Add to Cart" actions from websites and managing a local cart, along with features like theming and localization. This project serves as a proof-of-concept for a multi-brand shopping aggregator.

## Features

*   **Brand List Screen:** Displays a list of available fashion brands.
*   **WebView Integration:** Loads brand websites within a WebView.
    *   **"Add to Cart" Interception:** Injected JavaScript attempts to identify and intercept "Add to Cart" button clicks on brand websites.
*   **Native Cart:**
    *   Manages a unified shopping cart within the app.
    *   Powered by Redux Toolkit for state management.
    *   Cart state is persisted using `AsyncStorage` via `redux-persist`.
*   **Checkout Flow (Simulated):** A basic checkout screen to collect user details and simulate order placement.
*   **Theming:** Supports Light and Dark mode application-wide.
    *   Theme state managed via Redux and persisted.
    *   Dynamic styling applied to components and navigation.
*   **Localization:** Supports English (en) and Persian (fa) languages.
    *   Translations managed by `i18next`.
    *   Language selection with basic RTL support for Persian.

## Tech Stack

*   **Core:** React Native (TypeScript)
*   **Navigation:** React Navigation (Stack Navigator)
*   **State Management:** Redux Toolkit, Redux Persist
*   **Storage:** AsyncStorage
*   **WebView:** react-native-webview
*   **Localization:** i18next, react-i18next
*   **Testing:** Jest, @testing-library/react-native

## Folder Structure Overview (`src/`)

*   **`assets/`**: Static assets like images, fonts, and mock data (e.g., `brands.json`).
*   **`components/`**: Reusable UI components (e.g., `BrandListItem.tsx`, `CartListItem.tsx`).
*   **`constants/`**: Application-wide constants (e.g., `Colors.ts` for themes).
*   **`hooks/`**: Custom React hooks (e.g., `useAppTheme.ts`).
*   **`localization/`**: i18next configuration (`i18n.ts`) and translation files (`locales/`).
*   **`navigation/`**: Navigation setup (`AppNavigator.tsx`).
*   **`screens/`**: Top-level screen components (e.g., `BrandListScreen.tsx`, `WebViewScreen.tsx`, `CartScreen.tsx`, `CheckoutScreen.tsx`).
*   **`services/`**: Modules for complex logic, like the conceptual `webViewBridge.js` (whose content is embedded in `WebViewScreen.tsx`).
*   **`store/`**: Redux setup (`index.ts`) and state slices (e.g., `cartSlice.ts`, `themeSlice.ts`).
*   **`types/`**: TypeScript type definitions and interfaces (e.g., `Brand.ts`, `Product.ts`, `CartItem.ts`).

## Setup and Running Instructions

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   React Native CLI (`npx react-native --version`)
*   Android Studio (for Android Emulator and SDKs)
*   Xcode (for iOS Simulator - macOS only)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd ShoppingAggregatorApp
    ```
3.  Install dependencies:
    ```bash
    npm install
    # OR
    # yarn install
    ```

### Running on iOS

1.  Install CocoaPods dependencies:
    ```bash
    cd ios
    pod install
    cd ..
    ```
    *(Note: `pod install` requires a macOS environment with CocoaPods installed. The sandbox environment for this project's development had issues fully resolving iOS native dependencies, so local iOS builds might require troubleshooting based on your specific setup.)*

2.  Run the app:
    ```bash
    npx react-native run-ios
    ```

### Running on Android

1.  Ensure an Android Emulator is running or a device is connected.
2.  Run the app:
    ```bash
    npx react-native run-android
    ```

### Running Tests

Execute the Jest unit tests:
```bash
npm test
```

## Key Implementation Details

### WebView Injection (`WebViewScreen.tsx`)

*   **JavaScript Injection:** A custom JavaScript string (conceptually `webViewBridge.js`) is injected into the `WebView` using the `injectedJavaScript` prop.
*   **"Add to Cart" Interception:** The injected script attempts to find buttons related to adding items to a cart (e.g., containing "Add to Cart", "Add to Bag") using generic DOM selectors (`document.querySelectorAll`). Event listeners are attached to these buttons.
*   **Data Passing:** When an "Add to Cart" button is clicked, the script prevents the default action, attempts to extract basic product information (name, price) from the surrounding DOM elements (this part is highly brand-specific and currently very basic), and sends this data to the React Native side using `window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ADD_TO_CART', data: productData }))`.
*   The `WebViewScreen` component listens for these messages via the `onMessage` prop and dispatches Redux actions.

### Cart Logic (`cartSlice.ts`)

*   The cart state (list of items, quantities) is managed by a Redux slice.
*   **Reducers:**
    *   `addItemToCart`: Adds a new item or increments the quantity of an existing item.
    *   `removeItemFromCart`: Removes an item by its ID.
    *   `updateItemQuantity`: Modifies the quantity of an item, removing it if the quantity becomes zero or less.
    *   `clearCart`: Empties all items from the cart.
*   **Persistence:** The cart state is persisted to `AsyncStorage` using `redux-persist`, so items remain in the cart across app sessions.

### Theming (`themeSlice.ts`, `useAppTheme` hook)

*   Theme state (`mode: 'light' | 'dark'`) is managed by a Redux slice (`themeSlice.ts`).
*   The `toggleTheme` action switches between light and dark modes.
*   The theme state is persisted using `redux-persist`.
*   The `useAppTheme` custom hook provides easy access to the current theme's color palette (`lightTheme` or `darkTheme` objects from `constants/Colors.ts`).
*   Components use these themed colors for styling.
*   The main navigator (`AppNavigator.tsx`) adapts its appearance (header background, text colors) based on the selected theme by passing a themed configuration to the `NavigationContainer`.

### Localization (`i18n.ts`)

*   `i18next` and `react-i18next` are used for internationalization.
*   Translation strings are stored in JSON files (`src/localization/locales/en.json`, `src/localization/locales/fa.json`).
*   `i18n.ts` configures `i18next`, loads resources, and sets up language detection (using AsyncStorage to store user preference).
*   Components use the `useTranslation` hook to access the `t` function for translating keys.
*   A basic language switcher in `BrandListScreen` allows users to change the language dynamically.
*   RTL layout for Persian is enabled via `I18nManager.allowRTL(true)` and `I18nManager.forceRTL()` in `i18n.ts` upon language change, though a manual app restart might be needed for full RTL style application in some cases.

## Architecture Diagram (Conceptual Flow)

```
1. User opens App -> BrandListScreen (displays brands)
   |
   +-> (Selects a Brand) -> WebViewScreen (loads brand's website)
       |
       +-> (User clicks "Add to Cart" on website)
           |
           -> Injected JavaScript in WebView intercepts click
           -> Sends product data via postMessage to React Native
           -> WebViewScreen receives message, dispatches to Redux (cartSlice.addItemToCart)
   |
   +-> (User navigates to Cart via header button) -> CartScreen
       |                                               (displays items from Redux store)
       |
       +-> (User clicks "Checkout") -> CheckoutScreen (displays form)
           |
           +-> (User clicks "Place Order")
               |
               -> Simulates order, clears cart (Redux), navigates back.
```
*   **Central State:** Redux Store (`cartSlice`, `themeSlice`)
*   **Persistence:** AsyncStorage (for cart and theme)

## Future Improvements

*   **Robust Selectors:** Implement more sophisticated and configurable "Add to Cart" button/product data selectors for different brand websites (e.g., JSON configuration per brand).
*   **Advanced Data Extraction:** Improve product data extraction from complex and varied DOM structures (e.g., using more advanced DOM traversal, pattern matching, or even brand-specific scripts).
*   **Payment Integration:** Integrate a real payment gateway (e.g., Stripe, PayPal).
*   **User Authentication:** Implement user accounts, login/registration, and potentially link carts to user accounts.
*   **Affiliate Tracking:** Add logic for affiliate link generation and commission tracking if applicable.
*   **Error Handling & Loading States:** Implement more comprehensive loading indicators and user-friendly error messages throughout the app.
*   **RTL Styling:** Perform a thorough review and enhancement of styles for optimal RTL (Right-to-Left) layout for Persian and other RTL languages.
*   **Testing:**
    *   Write more unit tests for components and services.
    *   Implement E2E (End-to-End) tests, especially for the WebView interaction and "Add to Cart" interception, using tools like Appium or Detox.
*   **Brand Checkout:** Explore options for redirecting to a brand's actual checkout page with a pre-filled cart, if their APIs or website structure allows.
*   **Server-Side Management:** Consider a backend component for managing brands, website selectors, potentially user data, and aggregated analytics.
*   **CI/CD:** Set up a Continuous Integration/Continuous Deployment pipeline for automated builds, tests, and releases.
*   **Performance Optimization:** Profile and optimize performance, especially for WebView interactions and large lists.
*   **UI/UX Polish:** Refine the user interface and user experience with more sophisticated designs and interactions.

```
