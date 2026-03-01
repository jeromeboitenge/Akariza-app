import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text } from 'react-native';

function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello Akariza!</Text>
    </View>
  );
}

registerRootComponent(App);
