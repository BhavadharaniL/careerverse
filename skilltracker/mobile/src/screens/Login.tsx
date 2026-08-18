import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react-native';

const Login = ({ navigation }: any) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (error: any) {
      setErrorMsg(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue your career journey.</Text>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.form}>
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={(txt) => { setEmail(txt); setErrorMsg(''); }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon={() => <Mail size={20} color="#5f6368" />} />}
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={(txt) => { setPassword(txt); setErrorMsg(''); }}
            mode="outlined"
            secureTextEntry
            autoCapitalize="none"
            left={<TextInput.Icon icon={() => <Lock size={20} color="#5f6368" />} />}
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

          <TouchableOpacity style={styles.forgotBtn} onPress={() => alert('Reset password link has been sent to your email.')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginBtn}
            contentStyle={{ height: 48 }}
            icon={() => <LogIn size={20} color="#ffffff" />}
          >
            Login
          </Button>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Button
            mode="outlined"
            onPress={() => {
              // Bypassing real google signin for demo
              setEmail('admin@careerverse.com');
              setPassword('admin123');
              alert('Loaded test Administrator credentials for your demo!');
            }}
            style={styles.googleBtn}
            contentStyle={{ height: 48 }}
            textColor="#3c4043"
          >
            Sign in with Demo Admin
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1
  },
  header: {
    marginTop: 40,
    marginBottom: 32
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#5f6368',
    lineHeight: 24
  },
  errorText: {
    color: '#d93025',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#fce8e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center'
  },
  form: {
    marginBottom: 24
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff'
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24
  },
  forgotText: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '600'
  },
  loginBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    marginBottom: 16
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#dadce0'
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#5f6368',
    fontSize: 14,
    fontWeight: '600'
  },
  googleBtn: {
    borderColor: '#dadce0',
    borderRadius: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  footerText: {
    color: '#5f6368',
    fontSize: 14
  },
  registerLink: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '700'
  }
});
