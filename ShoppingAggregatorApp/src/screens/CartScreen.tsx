import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/useAppTheme'; // Import useAppTheme
import { RootState } from '../store';
import { CartItem, clearCart } from '../store/slices/cartSlice';
import CartListItem from '../components/CartListItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useAppTheme(); // Get current theme colors
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  const handleClearCart = () => {
    Alert.alert(
      t('cartScreen.clearCart'), // Localized title
      t('cartScreen.confirmClearCart', "Are you sure you want to remove all items from your cart?"), // Example with default
      [
        { text: t('general.cancel', "Cancel"), style: "cancel" },
        { text: t('cartScreen.clearCart'), onPress: () => dispatch(clearCart()), style: "destructive" }
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(t('cartScreen.emptyCart'), t('cartScreen.addItemsPrompt', "Please add items to your cart before checking out."));
      return;
    }
    navigation.navigate('Checkout');
  };

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: { // This style might not be used if title is solely from navigator
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 15,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      color: theme.text,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    emptyText: {
      fontSize: 18,
      color: theme.text, // Use theme.placeholder or a specific color for empty text
    },
    footer: {
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.card,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'right',
      marginBottom: 10,
      color: theme.text,
    },
    checkoutButton: {
      backgroundColor: theme.primary, // Use theme color
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
    checkoutButtonText: {
      color: theme.background, // Text color that contrasts with primary
      fontSize: 16,
      fontWeight: 'bold',
    },
    clearButton: {
      backgroundColor: theme.notification, // Or a secondary button color from theme
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    clearButtonText: {
      color: theme.background, // Text color that contrasts
      fontSize: 14,
    },
  });


  if (cartItems.length === 0) {
    return (
      <View style={dynamicStyles.emptyContainer}>
        <Text style={dynamicStyles.emptyText}>{t('cartScreen.emptyCart')}</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => <CartListItem item={item} />} // CartListItem will use its own themed styles
        keyExtractor={(item) => item.id}
        // ListHeaderComponent={<Text style={dynamicStyles.header}>{t('cartScreen.title')}</Text>} // Title from navigator
      />
      <View style={dynamicStyles.footer}>
        <Text style={dynamicStyles.totalText}>{t('cartScreen.total', { totalPrice: calculateTotal() })}</Text>
        <TouchableOpacity style={dynamicStyles.checkoutButton} onPress={handleCheckout}>
          <Text style={dynamicStyles.checkoutButtonText}>{t('cartScreen.checkout')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.clearButton} onPress={handleClearCart}>
          <Text style={dynamicStyles.clearButtonText}>{t('cartScreen.clearCart')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
