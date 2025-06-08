import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/useAppTheme'; // Import useAppTheme
import { clearCart } from '../store/slices/cartSlice';
import { CheckoutFormData } from '../types/CheckoutForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useAppTheme(); // Get current theme colors
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    shippingAddress: '',
    email: '',
    phoneNumber: '',
  });

  const handleInputChange = (name: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // Basic validation
    if (!formData.fullName || !formData.shippingAddress || !formData.email || !formData.phoneNumber) {
      Alert.alert(t('checkoutScreen.validationErrorTitle', "Validation Error"), t('checkoutScreen.validationErrorFillAll', "Please fill in all required fields."));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        Alert.alert(t('checkoutScreen.validationErrorTitle', "Validation Error"), t('checkoutScreen.validationErrorEmail', "Please enter a valid email address."));
        return;
    }

    console.log("Checkout Form Data:", formData);
    Alert.alert(
      t('checkoutScreen.orderPlaced'),
      t('checkoutScreen.orderConfirmationMsg', `Thank you, ${formData.fullName}! Your order has been placed.\nShipping to: ${formData.shippingAddress}`),
      [
        {
          text: t('general.ok', "OK"),
          onPress: () => {
            dispatch(clearCart());
            navigation.navigate('BrandList'); // Or 'Cart' or a new "OrderConfirmationScreen"
          },
        },
      ]
    );
  };

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 20,
    },
    // title: { // Title from navigator
    //   fontSize: 24,
    //   fontWeight: 'bold',
    //   textAlign: 'center',
    //   marginBottom: 20,
    //   color: theme.text,
    // },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.text,
    },
    input: {
      backgroundColor: theme.card,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 12,
      marginBottom: 15,
      fontSize: 16,
    },
    paymentPlaceholder: {
      fontSize: 16,
      color: theme.placeholder,
      textAlign: 'center',
      paddingVertical: 20,
      paddingHorizontal: 10,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      marginBottom: 20,
      fontStyle: 'italic',
    },
    buttonContainer: {
      marginTop: 10,
    }
  });

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.contentContainer}>
      <Text style={dynamicStyles.label}>{t('checkoutScreen.fullName')}</Text>
      <TextInput
        style={dynamicStyles.input}
        value={formData.fullName}
        onChangeText={(text) => handleInputChange('fullName', text)}
        placeholder={t('checkoutScreen.fullNamePlaceholder', "Enter your full name")}
        placeholderTextColor={theme.placeholder}
      />

      <Text style={dynamicStyles.label}>{t('checkoutScreen.shippingAddress')}</Text>
      <TextInput
        style={dynamicStyles.input}
        value={formData.shippingAddress}
        onChangeText={(text) => handleInputChange('shippingAddress', text)}
        placeholder={t('checkoutScreen.shippingAddressPlaceholder', "Enter your shipping address")}
        placeholderTextColor={theme.placeholder}
        multiline
      />

      <Text style={dynamicStyles.label}>{t('checkoutScreen.email')}</Text>
      <TextInput
        style={dynamicStyles.input}
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
        placeholder={t('checkoutScreen.emailPlaceholder', "Enter your email address")}
        placeholderTextColor={theme.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={dynamicStyles.label}>{t('checkoutScreen.phoneNumber')}</Text>
      <TextInput
        style={dynamicStyles.input}
        value={formData.phoneNumber}
        onChangeText={(text) => handleInputChange('phoneNumber', text)}
        placeholder={t('checkoutScreen.phoneNumberPlaceholder', "Enter your phone number")}
        placeholderTextColor={theme.placeholder}
        keyboardType="phone-pad"
      />

      <Text style={dynamicStyles.label}>{t('checkoutScreen.paymentDetails')}</Text>
      <Text style={dynamicStyles.paymentPlaceholder}>
        {t('checkoutScreen.paymentDetailsPlaceholder', "Payment processing not implemented in this demo.")}
      </Text>

      <View style={dynamicStyles.buttonContainer}>
        <Button title={t('checkoutScreen.placeOrder')} onPress={handlePlaceOrder} color={theme.primary} />
      </View>
    </ScrollView>
  );
};

export default CheckoutScreen;
