import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Modal
} from 'react-native';

const LandingScreen = ({ navigation }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [providerName, setProviderName] = useState('');

  const triggerMockAuth = (provider) => {
    setProviderName(provider);
    setAuthenticating(true);

    // Simulate standard OAuth loading delay (1.2 seconds)
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Auth Modal Loading Overlay */}
      <Modal transparent={true} visible={authenticating} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#34c759" />
            <Text style={styles.modalText}>Connecting to {providerName}...</Text>
            <Text style={styles.modalSubText}>Securing handshake tokens</Text>
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
        <Text style={styles.authTitle}>Login / Onboard Identity</Text>

        {/* Apple Authentication */}
        <TouchableOpacity 
          style={styles.appleButton}
          onPress={() => triggerMockAuth('Apple')}
        >
          <Text style={styles.appleButtonText}> Sign in with Apple</Text>
        </TouchableOpacity>

        {/* Google Authentication */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={() => triggerMockAuth('Google')}
        >
          {/* Unicode symbol for simple G outline */}
          <Text style={styles.googleButtonText}>👤 Sign in with Google</Text>
        </TouchableOpacity>

        {/* Continue as Guest */}
        <TouchableOpacity 
          style={styles.guestButton}
          onPress={() => navigation.navigate('HomeSetup', { authProvider: 'guest', initialNickname: '', initialEmail: '' })}
        >
          <Text style={styles.guestButtonText}>Continue as Guest 🚀</Text>
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
  guestButton: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LandingScreen;
