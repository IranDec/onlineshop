import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { Brand } from '../types/Brand';
import { useAppTheme } from '../hooks/useAppTheme'; // Import useAppTheme

interface BrandListItemProps {
  brand: Brand;
  onPress: (brand: Brand) => void;
}

const BrandListItem: React.FC<BrandListItemProps> = ({ brand, onPress }) => {
  const theme = useAppTheme();

  // Define styles dynamically based on theme
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: theme.card, // Use theme color
      borderRadius: 8,
      marginVertical: 5,
      marginHorizontal: 10,
      shadowColor: theme.text === '#000000' ? '#000' : '#fff', // Basic shadow based on text color
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      borderColor: theme.border,
      borderWidth: 1,
    },
    logo: {
      width: 50,
      height: 50,
      marginRight: 15,
      // backgroundColor: theme.background, // Optional: if logo needs a bg
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text, // Use theme color
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(brand)}>
      <Image source={{ uri: brand.logoUrl }} style={styles.logo} resizeMode="contain" />
      <Text style={styles.name}>{brand.name}</Text>
    </TouchableOpacity>
  );
};

export default BrandListItem;
