import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/useAppTheme'; // Import useAppTheme
import { CartItem } from '../store/slices/cartSlice';
import { removeItemFromCart, updateItemQuantity } from '../store/slices/cartSlice';

interface CartListItemProps {
  item: CartItem;
}

const CartListItem: React.FC<CartListItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const theme = useAppTheme(); // Get current theme colors
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleIncreaseQuantity = () => {
    dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    // If quantity is 1, decreasing further will remove the item (handled by the slice logic)
    dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity - 1 }));
  };

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      alignItems: 'center',
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 5,
      marginRight: 10,
      backgroundColor: theme.background, // Placeholder for image loading
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 3,
      color: theme.text,
    },
    brand: {
      fontSize: 12,
      color: theme.placeholder, // Use placeholder or secondary text color
      marginBottom: 3,
    },
    price: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 5,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      backgroundColor: theme.disabled, // Use a subtle color for buttons
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    quantityButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    quantityText: {
      fontSize: 16,
      marginHorizontal: 10,
      color: theme.text,
    },
    removeButton: {
      marginLeft: 10,
      padding: 8,
      backgroundColor: theme.notification, // Use notification or error color
      borderRadius: 5,
    },
    removeButtonText: {
      color: theme.card, // Text color that contrasts with notification
      fontSize: 12,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Image source={{ uri: item.imageUrl || `https://via.placeholder.com/60/${theme.placeholder.substring(1)}/${theme.text.substring(1)}` }} style={dynamicStyles.image} />
      <View style={dynamicStyles.infoContainer}>
        <Text style={dynamicStyles.name}>{item.name}</Text>
        {item.brandName && <Text style={dynamicStyles.brand}>{t('cartListItem.brand', 'Brand')}: {item.brandName}</Text>}
        <Text style={dynamicStyles.price}>{t('cartListItem.price', 'Price')}: ${parseFloat(item.price).toFixed(2)}</Text>
        <View style={dynamicStyles.quantityContainer}>
          <TouchableOpacity onPress={handleDecreaseQuantity} style={dynamicStyles.quantityButton}>
            <Text style={dynamicStyles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={handleIncreaseQuantity} style={dynamicStyles.quantityButton}>
            <Text style={dynamicStyles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleRemoveItem} style={dynamicStyles.removeButton}>
        <Text style={dynamicStyles.removeButtonText}>{t('cartListItem.remove', 'Remove')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartListItem;
