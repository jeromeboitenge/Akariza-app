import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Paragraph, Snackbar, Card } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { login, verifyOtp, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    console.log('🔐 Login attempt started');
    console.log('📧 Email:', email);
    console.log('🌐 API URL:', 'https://akariza-backend.onrender.com/api/v1');
    
    if (!email || !password) {
      console.log('❌ Validation failed: Missing email or password');
      useAuthStore.setState({ error: 'Please enter both email and password' });
      return;
    }
    
    if (!email.includes('@')) {
      console.log('❌ Validation failed: Invalid email format');
      useAuthStore.setState({ error: 'Please enter a valid email address' });
      return;
    }
    
    try {
      console.log('📡 Sending login request...');
      const result = await login(email, password);
      console.log('✅ Login response:', result);
      
      if (result.requiresOtp) {
        console.log('🔑 OTP required, showing OTP input');
        setShowOtpInput(true);
      } else {
        console.log('✅ Login successful, no OTP required');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      console.error('❌ Login error:', errorMsg);
      console.error('❌ Full error:', err);
      // Error is already set in the auth store
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      useAuthStore.setState({ error: 'Please enter the OTP code' });
      return;
    }
    
    if (otpCode.length !== 6) {
      useAuthStore.setState({ error: 'OTP code must be 6 digits' });
      return;
    }
    
    try {
      await verifyOtp(otpCode);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid OTP code';
      console.error('❌ OTP verification error:', errorMsg);
      // Error is already set in the auth store
    }
  };

  const handleBackToLogin = () => {
    setShowOtpInput(false);
    setOtpCode('');
    clearError();
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
            {!showOtpInput ? (
              <>
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

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('ForgotPassword')}
                  disabled={isLoading}
                  style={styles.forgotButton}
                >
                  Forgot Password?
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Signup')}
                  disabled={isLoading}
                  style={styles.signupButton}
                  labelStyle={styles.signupButtonLabel}
                >
                  Create New Account
                </Button>

                <Paragraph style={styles.hint}>
                  Demo Accounts:{'\n'}
                  ADMIN: jeromeboitenge@gmail.com / Jerome@2026{'\n'}
                  BOSS: boitenge311@gmail.com / Boitenge@2026
                </Paragraph>
              </>
            ) : (
              <>
                <Paragraph style={styles.otpInfo}>
                  Enter the 6-digit OTP code sent to {email}
                </Paragraph>

                <TextInput
                  label="OTP Code"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  mode="outlined"
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.input}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="shield-key" />}
                />

                <Button
                  mode="contained"
                  onPress={handleVerifyOtp}
                  loading={isLoading}
                  disabled={isLoading || otpCode.length !== 6}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Verify OTP
                </Button>

                <Button
                  mode="text"
                  onPress={handleBackToLogin}
                  disabled={isLoading}
                  style={styles.backButton}
                >
                  Back to Login
                </Button>
              </>
            )}
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
  container: { flex: 1, backgroundColor: '#5C6BF2' },
  header: { paddingTop: 80, paddingBottom: 40, alignItems: 'center' },
  title: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#E3F2FD' },
  content: { flex: 1, padding: 24 },
  card: { borderRadius: 16, elevation: 8 },
  input: { marginBottom: 16 },
  button: { marginTop: 24, borderRadius: 8 },
  buttonContent: { paddingVertical: 8 },
  forgotButton: { marginTop: 8 },
  signupButton: { marginTop: 16, borderRadius: 8, borderColor: '#5C6BF2', borderWidth: 2 },
  signupButtonLabel: { color: '#5C6BF2' },
  hint: { marginTop: 24, textAlign: 'center', color: '#757575', fontSize: 13 },
  otpInfo: { marginBottom: 24, textAlign: 'center', color: '#424242', fontSize: 15 },
  backButton: { marginTop: 16 },
});
