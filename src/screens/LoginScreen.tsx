import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { TextInput, Button, Title, Paragraph, Snackbar, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch (err) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Akariza</Title>
        <Paragraph style={styles.subtitle}>Stock Management System</Paragraph>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={isLoading}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
              left={<TextInput.Icon icon="lock" />}
              style={styles.input}
              disabled={isLoading}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading || !email || !password}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>

            <Paragraph style={styles.hint}>
              ADMIN: jeromeboitenge@gmail.com / Jerome@2026{'\n'}
              BOSS: boitenge311@gmail.com / Boitenge@2026
            </Paragraph>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>

      <Snackbar
        visible={!!error}
        onDismiss={clearError}
        duration={3000}
        action={{ label: 'OK', onPress: clearError }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1976D2' },
  header: { paddingTop: 80, paddingBottom: 40, alignItems: 'center' },
  title: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#E3F2FD' },
  content: { flex: 1, padding: 24 },
  card: { borderRadius: 16, elevation: 8 },
  input: { marginBottom: 16 },
  button: { marginTop: 24, borderRadius: 8 },
  buttonContent: { paddingVertical: 8 },
  hint: { marginTop: 24, textAlign: 'center', color: '#757575', fontSize: 13 },
});
