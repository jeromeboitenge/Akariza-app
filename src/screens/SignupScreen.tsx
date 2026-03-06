import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Title, Paragraph, Snackbar, Card, HelperText } from 'react-native-paper';
import { authApi } from '../api/authApi';

export default function SignupScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.phone && formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Note: This endpoint needs to be created on the backend
      // For now, we'll show a message that signup is not available
      // In production, this would call: await authApi.signup(formData);
      
      setError('Signup is currently disabled. Please contact your administrator to create an account.');
      
      // Uncomment when backend signup endpoint is ready:
      // await authApi.signup({
      //   fullName: formData.fullName,
      //   email: formData.email,
      //   password: formData.password,
      //   phone: formData.phone,
      // });
      // setSuccess('Account created successfully! Please login.');
      // setTimeout(() => navigation.navigate('Login'), 2000);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMsg);
      console.error('❌ Signup error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Create Account</Title>
        <Paragraph style={styles.subtitle}>Join Akariza Stock Management</Paragraph>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Full Name"
                value={formData.fullName}
                onChangeText={(value) => updateField('fullName', value)}
                mode="outlined"
                autoCapitalize="words"
                style={styles.input}
                disabled={isLoading}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                disabled={isLoading}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Phone (Optional)"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                disabled={isLoading}
                left={<TextInput.Icon icon="phone" />}
              />

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? 'eye-off' : 'eye'} 
                    onPress={() => setShowPassword(!showPassword)} 
                  />
                }
                left={<TextInput.Icon icon="lock" />}
                style={styles.input}
                disabled={isLoading}
              />
              <HelperText type="info" visible={true}>
                Password must be at least 8 characters
              </HelperText>

              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? 'eye-off' : 'eye'} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                  />
                }
                left={<TextInput.Icon icon="lock-check" />}
                style={styles.input}
                disabled={isLoading}
              />

              <Button
                mode="contained"
                onPress={handleSignup}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Create Account
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}
                style={styles.backButton}
              >
                Already have an account? Sign In
              </Button>

              <Paragraph style={styles.note}>
                Note: New accounts must be created by your organization administrator.
              </Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
        action={{ label: 'OK', onPress: () => setError('') }}
        style={styles.errorSnackbar}
      >
        {error}
      </Snackbar>

      <Snackbar
        visible={!!success}
        onDismiss={() => setSuccess('')}
        duration={3000}
        style={styles.successSnackbar}
      >
        {success}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5C6BF2' },
  header: { paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#E3F2FD' },
  content: { flex: 1, padding: 24 },
  card: { borderRadius: 16, elevation: 8 },
  input: { marginBottom: 8 },
  button: { marginTop: 24, borderRadius: 8 },
  buttonContent: { paddingVertical: 8 },
  backButton: { marginTop: 16 },
  note: { 
    marginTop: 24, 
    textAlign: 'center', 
    color: '#757575', 
    fontSize: 12,
    fontStyle: 'italic'
  },
  errorSnackbar: { backgroundColor: '#D32F2F' },
  successSnackbar: { backgroundColor: '#388E3C' },
});
