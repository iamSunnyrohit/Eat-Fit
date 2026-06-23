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
  Platform,
  Dimensions
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
      });
    } catch (e) {
      console.warn('GoogleSignin configure warning:', e.message);
    }
  }, []);

  // Standard fallback mock login for testing environments (Simulator / Expo Go / Web)
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
            <ActivityIndicator size="large" color="#56e472" />
            <Text style={styles.modalText}>Connecting to {providerName}...</Text>
            <Text style={styles.modalSubText}>Securing verification handshake</Text>
          </View>
        </View>
      </Modal>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.appTitle}>EAT & FIT</Text>
        <Text style={styles.tagline}>Precision Fitness, <Text style={styles.greenText}>AI-Powered</Text></Text>
        <Text style={styles.description}>
          The ultimate high-performance ecosystem integrating clinical nutritional precision with data-driven movement. Experience health tracking re-engineered for the elite.
        </Text>
      </View>

      {/* Primary Authentication Portal */}
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Login / Authenticate Identity</Text>
        <TouchableOpacity style={styles.appleButton} onPress={handleAppleAuth}>
          <Text style={styles.appleButtonText}> Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth}>
          <Text style={styles.googleButtonText}>👤 Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Section 1: AI Calorie Scanner */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Scan. Identify. Track.</Text>
        <Text style={styles.sectionSub}>
          Our proprietary neural engine identifies ingredients from a single photo. Point, shoot, and maintain clinical precision.
        </Text>

        <View style={styles.mockScannerCard}>
          <View style={styles.scannerHeader}>
            <View style={styles.scannerBadge}>
              <Text style={styles.scannerBadgeText}>● SCANNING...</Text>
            </View>
            <Text style={styles.mealTitle}>Salmon Power Bowl</Text>
            <Text style={styles.kcalCount}>642 kcal</Text>
          </View>

          <View style={styles.macroGrid}>
            <View style={styles.macroCell}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={[styles.macroVal, { color: '#56e472' }]}>42g</Text>
            </View>
            <View style={styles.macroCell}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={[styles.macroVal, { color: '#aac7ff' }]}>38g</Text>
            </View>
            <View style={styles.macroCell}>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={[styles.macroVal, { color: '#ffb8af' }]}>22g</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Feature Section 2: Macro Analytics & wearable sync */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Master Your Macros</Text>
        <Text style={styles.sectionSub}>
          Deep-dive into physiological metrics. Seamless wearable synchronization keeps your stats updated.
        </Text>

        {/* Macro analytics progress mock */}
        <View style={styles.glassCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily Target Progress</Text>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <View style={styles.miniProgressContainer}>
            <Text style={styles.miniLabel}>Protein (142 / 180g)</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>
          </View>

          {/* Sync status card */}
          <View style={styles.syncRow}>
            <View style={styles.syncCard}>
              <Text style={styles.syncTitle}>Apple HealthKit</Text>
              <Text style={styles.syncSub}>Synced</Text>
            </View>
            <View style={styles.syncCard}>
              <Text style={styles.syncTitle}>Health Connect</Text>
              <Text style={styles.syncSub}>Synced</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Feature Section 3: Expert Led Programs */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Expert-Led Programs</Text>
        <Text style={styles.sectionSub}>
          Professional guidance adapted to your specific recovery capacity.
        </Text>

        <View style={styles.programsList}>
          {/* Yoga Card */}
          <View style={[styles.programCard, { borderLeftColor: '#56e472' }]}>
            <View style={styles.programContent}>
              <Text style={styles.programLabel}>MOBILITY</Text>
              <Text style={styles.programTitleText}>Athletic Yoga</Text>
              <Text style={styles.programDesc}>Enhance recovery and range of motion.</Text>
            </View>
          </View>

          {/* Strength Card */}
          <View style={[styles.programCard, { borderLeftColor: '#aac7ff' }]}>
            <View style={styles.programContent}>
              <Text style={styles.programLabel}>HYPERTROPHY</Text>
              <Text style={styles.programTitleText}>Strength & Power</Text>
              <Text style={styles.programDesc}>Science-based progressive overload.</Text>
            </View>
          </View>

          {/* Pilates Card */}
          <View style={[styles.programCard, { borderLeftColor: '#ffb8af' }]}>
            <View style={styles.programContent}>
              <Text style={styles.programLabel}>CORE STABILITY</Text>
              <Text style={styles.programTitleText}>Advanced Pilates</Text>
              <Text style={styles.programDesc}>Technical core stability and control.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pro Membership Callout */}
      <View style={styles.proSection}>
        <Text style={styles.proLabel}>★ PRO MEMBER STATUS</Text>
        <Text style={styles.proTitle}>Elevate Your Standard</Text>
        <Text style={styles.proDesc}>
          Access global leaderboards, expert forums, and verified bio-data metrics.
        </Text>
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>PRO Monthly</Text>
          <Text style={styles.priceVal}>$19.99 / mo</Text>
        </View>
      </View>

      {/* Final Portal Trigger */}
      <View style={styles.footerPortal}>
        <Text style={styles.footerText}>Ready to re-engineer your health?</Text>
        <TouchableOpacity style={styles.appleButton} onPress={handleAppleAuth}>
          <Text style={styles.appleButtonText}> Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth}>
          <Text style={styles.googleButtonText}>👤 Sign in with Google</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131315',
    padding: 20,
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
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#56e472',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  greenText: {
    color: '#56e472',
  },
  description: {
    fontSize: 14,
    color: '#939397',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  authContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    marginBottom: 28,
    width: '100%',
  },
  authTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e4e2e4',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  appleButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  appleButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#2a2a2c',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3e3e42',
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 28,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 13,
    color: '#939397',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  mockScannerCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scannerBadge: {
    backgroundColor: 'rgba(86, 228, 114, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  scannerBadgeText: {
    color: '#56e472',
    fontSize: 11,
    fontWeight: 'bold',
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginLeft: 12,
  },
  kcalCount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCell: {
    flex: 1,
    backgroundColor: '#2a2a2c',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#3d4a3c',
  },
  macroLabel: {
    fontSize: 11,
    color: '#939397',
    marginBottom: 4,
  },
  macroVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  glassCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#56e472',
  },
  miniProgressContainer: {
    marginBottom: 16,
  },
  miniLabel: {
    fontSize: 12,
    color: '#939397',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#131315',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#56e472',
    borderRadius: 3,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncCard: {
    flex: 1,
    backgroundColor: '#2a2a2c',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  syncTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  syncSub: {
    fontSize: 11,
    color: '#56e472',
    marginTop: 2,
  },
  programsList: {
    width: '100%',
  },
  programCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  programContent: {
    flex: 1,
  },
  programLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#939397',
    letterSpacing: 1,
    marginBottom: 4,
  },
  programTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  programDesc: {
    fontSize: 12,
    color: '#939397',
    marginTop: 4,
  },
  proSection: {
    backgroundColor: 'rgba(86, 228, 114, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(86, 228, 114, 0.2)',
    marginBottom: 28,
    width: '100%',
  },
  proLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#56e472',
    letterSpacing: 1,
    marginBottom: 6,
  },
  proTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  proDesc: {
    fontSize: 13,
    color: '#939397',
    lineHeight: 18,
    marginBottom: 16,
  },
  priceCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#56e472',
  },
  footerPortal: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default LandingScreen;
