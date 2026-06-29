import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Switch, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { requestHealthPermissions } from '../services/HealthService';
import { useTheme } from '../context/ThemeContext';

// Standard local API URL. For Android emulator, use 10.0.2.2. For iOS/Web, use localhost.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:5002' : 'http://localhost:5002');

const HomeSetupScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { isDarkMode } = useTheme();
  const theme = {
    bg: isDarkMode ? '#131315' : '#F8F9FA',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    border: isDarkMode ? '#2A2A2C' : '#E5E7EB',
    inputBg: isDarkMode ? '#2A2A2C' : '#FFFFFF',
  };

  const { authProvider = 'guest', initialNickname = '', initialEmail = '' } = route.params || {};

  const [nickname, setNickname] = useState(initialNickname);
  const [email, setEmail] = useState(initialEmail);
  const [calorieTarget, setCalorieTarget] = useState('2000');
  const [syncHealthDevices, setSyncHealthDevices] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSyncHealthToggle = async (value: boolean) => {
    if (value) {
      try {
        const granted = await requestHealthPermissions();
        if (granted) {
          setSyncHealthDevices(true);
        } else {
          Alert.alert(
            'Permission Denied',
            'Permission to access Apple HealthKit was denied. Please enable it in Settings > Health > Data Access & Devices > Eat-Fit if you wish to sync device data.',
            [{ text: 'OK' }]
          );
          setSyncHealthDevices(false);
        }
      } catch (error) {
        console.warn('Error requesting health permissions:', error);
        setSyncHealthDevices(false);
      }
    } else {
      setSyncHealthDevices(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!nickname.trim()) {
      Alert.alert('Required Field', 'Please enter a nickname/name to proceed.');
      return;
    }

    const calorieVal = parseInt(calorieTarget, 10);
    if (isNaN(calorieVal) || calorieVal <= 0) {
      Alert.alert('Invalid Target', 'Please enter a valid daily calorie target (number greater than 0).');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
          email: email.trim(),
          dailyCalorieTarget: calorieVal,
          syncHealthDevices,
          healthPlatform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'none',
          authProvider,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success! 🎉',
          `Profile for ${data.nickname} has been successfully initialized! Target calories: ${data.dailyCalorieTarget} kcal.`,
          [{ 
            text: 'Great!', 
            onPress: () => navigation.navigate('Home', { 
              profileId: data._id, 
              nickname: data.nickname, 
              dailyCalorieTarget: data.dailyCalorieTarget,
              syncHealthDevices: data.syncHealthDevices ?? syncHealthDevices
            }) 
          }]
        );
      } else {
        throw new Error(data.message || 'Server returned an error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        'Connection Error',
        `Unable to reach the server. Let's mock a local success so you can see the flow. Saved draft: ${nickname} (${calorieTarget} kcal).`,
        [{ 
          text: 'Continue', 
          onPress: () => navigation.navigate('Home', { 
            profileId: `mock-draft-${Date.now()}`, 
            nickname: nickname.trim(), 
            dailyCalorieTarget: parseInt(calorieTarget, 10) || 2000,
            syncHealthDevices: syncHealthDevices
          }) 
        }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Set Up Profile 👤</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Configure your daily targets & telemetry integration</Text>
      </View>

      {/* Authentication Status Badge */}
      {authProvider !== 'guest' && (
        <View style={styles.authBadge}>
          <Text style={styles.authBadgeText}>
            ✓ Signed in with {authProvider === 'apple' ? 'Apple ' : 'Google 👤'}
          </Text>
        </View>
      )}

      <View style={styles.form}>
        {/* Nickname Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Nickname or Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="e.g. Alex"
            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
          <TextInput
            style={[
              styles.input, 
              authProvider !== 'guest' && styles.disabledInput,
              { 
                backgroundColor: theme.inputBg, 
                color: authProvider !== 'guest' ? theme.subText : theme.text, 
                borderColor: theme.border 
              }
            ]}
            placeholder="user@example.com"
            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={authProvider === 'guest'}
            value={email}
            onChangeText={setEmail}
          />
          {authProvider !== 'guest' && (
            <Text style={[styles.inputHelperText, { color: theme.subText }]}>Email managed by your auth provider.</Text>
          )}
        </View>

        {/* Caloric Target Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Daily Calorie Target (kcal)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="2000"
            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
            keyboardType="number-pad"
            value={calorieTarget}
            onChangeText={setCalorieTarget}
          />
        </View>

        {/* Telemetry Authorization */}
        <View style={[styles.switchGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.switchTextContent}>
            <Text style={[styles.switchTitle, { color: theme.text }]}>Native Device Sync</Text>
            <Text style={[styles.switchDesc, { color: theme.subText }]}>
              {Platform.OS === 'ios' 
                ? 'Sync workouts, steps, and active calories with Apple HealthKit' 
                : 'Sync workouts, steps, and active calories with Google Health Connect'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: isDarkMode ? '#2C2C2E' : '#D1D5DB', true: '#24C76D' }}
            thumbColor={syncHealthDevices ? '#ffffff' : (isDarkMode ? '#a0a5b5' : '#F3F4F6')}
            ios_backgroundColor={isDarkMode ? '#2C2C2E' : '#D1D5DB'}
            onValueChange={handleSyncHealthToggle}
            value={syncHealthDevices}
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSaveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.saveButtonText}>SAVE & FINISH 🚀</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131419',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    marginBottom: 10,
    width: '100%',
    maxWidth: 550,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a5b5',
    marginTop: 6,
    lineHeight: 20,
  },
  authBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 550,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  authBadgeText: {
    color: '#34c759',
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 15,
    width: '100%',
    maxWidth: 550,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e2029',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  disabledInput: {
    backgroundColor: '#171921',
    color: '#6c7281',
    borderColor: '#1f222b',
  },
  inputHelperText: {
    color: '#6c7281',
    fontSize: 11,
    marginTop: 4,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e2029',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  switchTextContent: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  switchDesc: {
    fontSize: 12,
    color: '#a0a5b5',
    marginTop: 4,
    lineHeight: 16,
  },
  saveButton: {
    backgroundColor: '#34c759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 550,
    alignSelf: 'center',
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default HomeSetupScreen;
