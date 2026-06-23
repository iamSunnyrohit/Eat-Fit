import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Platform
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const LandingScreen = ({ navigation }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [providerName, setProviderName] = useState('');

  // Configure Google Sign-In on mount
  useEffect(() => {
    try {
      GoogleSignin.configure({
        // Configuration options can be set here when API keys/Client IDs are ready
        // webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', 
      });
    } catch (e) {
      console.warn('GoogleSignin configure warning:', e.message);
    }
  }, []);

  // Standard fallback mock login for testing environments (Simulator / Expo Go)
  const triggerMockAuth = (provider) => {
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

      const user = userInfo.data?.user || userInfo.user;
      const nickname = user?.name || 'Google User';
      const email = user?.email || 'user@gmail.com';

      navigation.navigate('HomeSetup', {
        authProvider: 'google',
        initialNickname: nickname,
        initialEmail: email
      });
    } catch (error) {
      setAuthenticating(false);
      console.error('Google Sign-In error details:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google Sign-In was cancelled.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Status', 'Sign-in is already in progress.');
      } else {
        // Dev fallback message
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
    } catch (error) {
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Auth Modal Loading Overlay */}
      <Modal transparent={true} visible={authenticating} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#34c759" />
            <Text style={styles.modalText}>Connecting to {providerName}...</Text>
            <Text style={styles.modalSubText}>Securing verification handshake</Text>
          </View>
        </View>
      </Modal>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.appTitle}>EAT AND FIT 🏃‍♂️</Text>
        <Text style={styles.tagline}>Track Smarter, Not Harder</Text>
        <Text style={styles.description}>
          A unified, cross-platform fitness hub designed to eliminate manual data entry by synchronizing seamlessly with your device's native health environment.
        </Text>
      </View>

      {/* Core Use Cases Definition */}
      <View style={styles.useCaseContainer}>
        <Text style={styles.sectionHeader}>Why Eat and Fit?</Text>

        <View style={styles.useCaseCard}>
          <Text style={styles.useCaseEmoji}>🔄</Text>
          <View style={styles.useCaseTextContent}>
            <Text style={styles.useCaseTitle}>Zero Manual Entry</Text>
            <Text style={styles.useCaseDesc}>
              Bridges directly with Apple HealthKit and Android Health Connect to import workouts and metrics in the background.
            </Text>
          </View>
        </View>

        <View style={styles.useCaseCard}>
          <Text style={styles.useCaseEmoji}>📈</Text>
          <View style={styles.useCaseTextContent}>
            <Text style={styles.useCaseTitle}>Actionable Analytics</Text>
            <Text style={styles.useCaseDesc}>
              Transforms raw biometric data points into interactive trend lines mapping long-term workout consistency.
            </Text>
          </View>
        </View>

        <View style={styles.useCaseCard}>
          <Text style={styles.useCaseEmoji}>🎯</Text>
          <View style={styles.useCaseTextContent}>
            <Text style={styles.useCaseTitle}>Caloric Alignment</Text>
            <Text style={styles.useCaseDesc}>
              Automatically tracks your net daily energy balance against custom macro and target goals.
            </Text>
          </View>
        </View>
      </View>

      {/* Security & Privacy Banner */}
      <View style={styles.infoBanner}>
        <View style={styles.bannerHeaderContainer}>
          <Text style={styles.bannerEmoji}>🔒</Text>
          <Text style={styles.bannerTitle}>Privacy Shield Guaranteed</Text>
        </View>
        <Text style={styles.bannerText}>
          All health and workout metrics are processed locally using your device's secure native sandbox. We never store or share raw biometric data points.
        </Text>
      </View>

      {/* Authentication Buttons Section */}
      <View style={styles.authButtonsContainer}>
        <Text style={styles.authTitle}>Login</Text>

        {/* Apple Authentication */}
        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleAuth}
        >
          <Text style={styles.appleButtonText}> Sign in with Apple</Text>
        </TouchableOpacity>

        {/* Google Authentication */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleAuth}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131419',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  modalSubText: {
    fontSize: 12,
    color: '#a0a5b5',
    marginTop: 6,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#4a90e2',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#a0a5b5',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  useCaseContainer: {
    width: '100%',
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  useCaseCard: {
    flexDirection: 'row',
    backgroundColor: '#1e2029',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f222b',
  },
  useCaseEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  useCaseTextContent: {
    flex: 1,
  },
  useCaseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  useCaseDesc: {
    fontSize: 12,
    color: '#a0a5b5',
    marginTop: 4,
    lineHeight: 16,
  },
  infoBanner: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    marginBottom: 20,
  },
  bannerHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bannerEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  bannerTitle: {
    color: '#4a90e2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerText: {
    color: '#a0a5b5',
    fontSize: 12,
    lineHeight: 18,
  },
  authButtonsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 14,
    color: '#a0a5b5',
    alignSelf: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  appleButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#1e2029',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
