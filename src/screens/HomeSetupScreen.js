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

// Standard local API URL. For Android emulator, use 10.0.2.2. For iOS/Web, use localhost.
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5002' : 'http://localhost:5002';

const HomeSetupScreen = ({ route, navigation }) => {
  const { authProvider = 'guest', initialNickname = '', initialEmail = '' } = route.params || {};

  const [nickname, setNickname] = useState(initialNickname);
  const [email, setEmail] = useState(initialEmail);
  const [calorieTarget, setCalorieTarget] = useState('2000');
  const [syncHealthDevices, setSyncHealthDevices] = useState(false);
  const [loading, setLoading] = useState(false);

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
              dailyCalorieTarget: data.dailyCalorieTarget 
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
            dailyCalorieTarget: parseInt(calorieTarget, 10) || 2000 
          }) 
        }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Up Profile 👤</Text>
        <Text style={styles.subtitle}>Configure your daily targets & telemetry integration</Text>
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
          <Text style={styles.label}>Nickname or Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Alex"
            placeholderTextColor="#6c7281"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[
              styles.input, 
              authProvider !== 'guest' && styles.disabledInput
            ]}
            placeholder="user@example.com"
            placeholderTextColor="#6c7281"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={authProvider === 'guest'}
            value={email}
            onChangeText={setEmail}
          />
          {authProvider !== 'guest' && (
            <Text style={styles.inputHelperText}>Email managed by your auth provider.</Text>
          )}
        </View>

        {/* Caloric Target Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Calorie Target (kcal)</Text>
          <TextInput
            style={styles.input}
            placeholder="2000"
            placeholderTextColor="#6c7281"
            keyboardType="number-pad"
            value={calorieTarget}
            onChangeText={setCalorieTarget}
          />
        </View>

        {/* Telemetry Authorization */}
        <View style={styles.switchGroup}>
          <View style={styles.switchTextContent}>
            <Text style={styles.switchTitle}>Native Device Sync</Text>
            <Text style={styles.switchDesc}>
              {Platform.OS === 'ios' 
                ? 'Sync workouts, steps, and active calories with Apple HealthKit' 
                : 'Sync workouts, steps, and active calories with Google Health Connect'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#2c2e3a', true: '#34c759' }}
            thumbColor={syncHealthDevices ? '#ffffff' : '#a0a5b5'}
            ios_backgroundColor="#2c2e3a"
            onValueChange={setSyncHealthDevices}
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
    alignSelf: 'flex-start',
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
