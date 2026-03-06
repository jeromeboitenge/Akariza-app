import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface AkarizaLogoProps {
  size?: number;
  showTagline?: boolean;
  style?: any;
}

export const AkarizaLogo: React.FC<AkarizaLogoProps> = ({ 
  size = 100, 
  showTagline = false,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/icon.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
      {showTagline && (
        <Text style={styles.tagline}>WE ARE HERE FOR YOU</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 8,
  },
});
