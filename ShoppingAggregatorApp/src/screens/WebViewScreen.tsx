import React, { useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addItemToCart, CartItem } from '../store/slices/cartSlice'; // Import action and CartItem type
import { Product } from '../types/Product';
import { Brand } from '../types/Brand';

// Define the navigation route params interface
interface WebViewScreenRouteParams {
  url: string;
  title?: string;
  brand?: Brand; // Added brand to route params
}

// Define props for WebViewScreen, including route
interface WebViewScreenProps {
  route: {
    params: WebViewScreenRouteParams;
  };
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url, brand } = route.params; // Extract brand
  const webViewRef = useRef<WebView>(null);
  const dispatch = useDispatch(); // Initialize dispatch

  const webViewBridgeScript = `
    function initBridge() {
      const addToCartButtons = document.querySelectorAll('button, input[type="submit"], a');
      addToCartButtons.forEach(button => {
        const buttonText = (button.innerText || button.textContent || button.value || '').toLowerCase();
        const isAddToCartButton = buttonText.includes('add to cart') ||
                                  buttonText.includes('add to bag') ||
                                  buttonText.includes('buy now');

        if (isAddToCartButton) {
          button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            let productName = 'Sample Product';
            let productPrice = '0.00';
            let parent = button.closest('article, section, div[role="listitem"], div[class*="product"], div[data-productid]');
            if (parent) {
                const nameElement = parent.querySelector('h1, h2, h3, .product-name, .title');
                if (nameElement) productName = nameElement.textContent.trim();

                const priceElement = parent.querySelector('.price, .product-price, [class*="price"]');
                if (priceElement) productPrice = priceElement.textContent.trim().replace(/[^0-9.,]/g, '');
            }

            const productData = {
              name: productName, // Removed 'from host' for cleaner data
              price: productPrice,
              sku: 'SKU_PLACEHOLDER_' + Date.now(),
              imageUrl: 'https://via.placeholder.com/100', // Generic placeholder
              quantity: 1
            };

            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ADD_TO_CART', data: productData }));
            } else {
              alert('Bridge not ready. Product Data: ' + JSON.stringify(productData));
            }
          });
        }
      });
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BRIDGE_INIT_COMPLETE' }));
      }
    }
     if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initBridge();
     } else {
        document.addEventListener('DOMContentLoaded', initBridge);
     }
    window.setupWebViewJavascriptBridge = initBridge;
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', message);

      if (message.type === 'ADD_TO_CART') {
        const productFromWebView: Product = message.data;

        // Transform Product to CartItem
        const cartItem: CartItem = {
          ...productFromWebView,
          id: `${productFromWebView.sku || 'NOSKU'}_${new Date().getTime()}`, // Create a unique ID
          brandName: brand?.name || 'Unknown Brand', // Add brand name from route params
        };

        dispatch(addItemToCart(cartItem));
        Alert.alert(
          'Added to Cart!',
          `${cartItem.name} has been added to your cart.`,
          [{ text: 'OK' }]
        );
      } else if (message.type === 'BRIDGE_INIT_COMPLETE') {
        console.log('WebView Bridge Injected and Initialized.');
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={webViewBridgeScript}
        onMessage={handleMessage}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent.statusCode, nativeEvent.url);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default WebViewScreen;
