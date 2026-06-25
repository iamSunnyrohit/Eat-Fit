import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
  NativeModules
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

let GoogleSignin: any;
let statusCodes: any;

const hasRNGoogleSignin = !!(NativeModules && NativeModules.RNGoogleSignin);

if (Platform.OS !== 'web' && hasRNGoogleSignin) {
  try {
    const googleSigninModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSigninModule.GoogleSignin;
    statusCodes = googleSigninModule.statusCodes;
  } catch (error) {
    console.warn('Failed to load Google Signin native module:', error);
  }
}

if (!GoogleSignin) {
  GoogleSignin = {
    configure: () => { },
    hasPlayServices: () => Promise.resolve(true),
    signIn: () => Promise.reject(new Error('Google Sign-In not available in Expo Go')),
  };
  statusCodes = {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  };
}


const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [providerName, setProviderName] = useState('');

  // Configure Google Sign-In on mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        GoogleSignin.configure({
          webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
          offlineAccess: true,
        });
      } catch (e: any) {
        console.warn('GoogleSignin configure warning:', e.message);
      }
    }
  }, []);

  // Standard fallback mock login for testing environments (Simulator / Expo Go / Web)
  const triggerMockAuth = (provider: string) => {
    setProviderName(provider);
    setAuthenticating(true);

    setTimeout(() => {
      setAuthenticating(false);

      let initialNickname = '';
      let initialEmail = '';
      if (provider === 'Apple') {
        initialNickname = 'Apple User';
        initialEmail = 'user@icloud.com';
      } else if (provider === 'Google') {
        initialNickname = 'Google User';
        initialEmail = 'user@gmail.com';
      }

      navigation.navigate('HomeSetup', {
        authProvider: provider.toLowerCase(),
        initialNickname,
        initialEmail
      });
    }, 1200);
  };

  // Google Sign-In logic
  const handleGoogleAuth = async () => {
    if (Platform.OS === 'web') {
      triggerMockAuth('Google');
      return;
    }
    try {
      setProviderName('Google');
      setAuthenticating(true);

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setAuthenticating(false);

      const user = userInfo.data?.user || (userInfo as any).user;
      const nickname = user?.name || 'Google User';
      const email = user?.email || 'user@gmail.com';

      navigation.navigate('HomeSetup', {
        authProvider: 'google',
        initialNickname: nickname,
        initialEmail: email
      });
    } catch (error: any) {
      setAuthenticating(false);
      console.error('Google Sign-In error details:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google Sign-In was cancelled.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Status', 'Sign-in is already in progress.');
      } else {
        Alert.alert(
          'Google Auth Notice',
          `Native Google Authentication requires client configurations & custom dev builds.\n\nProceeding with mock authentication for development testing.`,
          [{ text: 'Continue Test', onPress: () => triggerMockAuth('Google') }]
        );
      }
    }
  };

  // Apple Authentication logic
  const handleAppleAuth = async () => {
    if (Platform.OS === 'web') {
      triggerMockAuth('Apple');
      return;
    }
    try {
      setProviderName('Apple');
      setAuthenticating(true);

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        setAuthenticating(false);
        Alert.alert(
          'Apple Auth Notice',
          'Apple Authentication is not supported on this platform/device. Proceeding with mock authentication for development testing.',
          [{ text: 'Continue Test', onPress: () => triggerMockAuth('Apple') }]
        );
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      setAuthenticating(false);

      const nickname = credential.fullName?.givenName
        ? `${credential.fullName.givenName} ${credential.fullName.familyName || ''}`.trim()
        : 'Apple User';
      const email = credential.email || 'user@icloud.com';

      navigation.navigate('HomeSetup', {
        authProvider: 'apple',
        initialNickname: nickname,
        initialEmail: email
      });
    } catch (error: any) {
      setAuthenticating(false);
      console.error('Apple Verification error details:', error);

      if (error.code === 'ERR_CANCELED') {
        Alert.alert('Cancelled', 'Apple Verification was cancelled.');
      } else {
        Alert.alert(
          'Apple Auth Notice',
          `Native Apple Authentication failed.\n\nProceeding with mock authentication for development testing.`,
          [{ text: 'Continue Test', onPress: () => triggerMockAuth('Apple') }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Auth Modal Loading Overlay */}
      <Modal transparent={true} visible={authenticating} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#56e472" />
            <Text style={styles.modalText}>Connecting to {providerName}...</Text>
            <Text style={styles.modalSubText}>Securing verification handshake</Text>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Connect Account 👤</Text>
        <Text style={styles.subtitle}>Sign in to authorize native health telemetry and initialize profile targets</Text>
      </View>

      {/* Login buttons card */}
      <View style={styles.authCard}>
        <TouchableOpacity style={styles.appleButton} onPress={handleAppleAuth}>
          <Text style={styles.appleButtonText}> Sign in with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth}>
          <Text style={styles.googleButtonText}>👤 Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Cancel & Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131315',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  modalSubText: {
    fontSize: 12,
    color: '#939397',
    marginTop: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#939397',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  authCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    width: '100%',
    marginBottom: 30,
  },
  appleButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  appleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#2a2a2c',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3e3e42',
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#939397',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AuthScreen;
