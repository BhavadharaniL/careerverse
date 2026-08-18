import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserCheck } from 'lucide-react-native';

const Register = ({ navigation }: any) => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    try {
      await register(name, email, password);
      // Success will automatically update auth state, routing to GoalSelection via AppNavigator
    } catch (error: any) {
      setErrorMsg(error.message || 'Registration failed. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account 🚀</Text>
          <Text style={styles.subtitle}>Start preparing for your future opportunities.</Text>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={(txt) => { setName(txt); setErrorMsg(''); }}
            mode="outlined"
            left={<TextInput.Icon icon={() => <User size={20} color="#5f6368" />} />}
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

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

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(txt) => { setConfirmPassword(txt); setErrorMsg(''); }}
            mode="outlined"
            secureTextEntry
            autoCapitalize="none"
            left={<TextInput.Icon icon={() => <Lock size={20} color="#5f6368" />} />}
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerBtn}
            contentStyle={{ height: 48 }}
            icon={() => <UserCheck size={20} color="#ffffff" />}
          >
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

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
    marginTop: 30,
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  subtitle: {
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
  registerBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    marginTop: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  footerText: {
    color: '#5f6368',
    fontSize: 14
  },
  loginLink: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '700'
  }
});
