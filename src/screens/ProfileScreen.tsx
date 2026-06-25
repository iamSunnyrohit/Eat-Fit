import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Alert } from 'react-native';

interface ProfileScreenProps {
  nickname: string;
  setNickname: (val: string) => void;
  dailyCalorieTarget: number;
  setCalorieTarget: (val: number) => void;
  syncHealthDevices: boolean;
  handleProfileSyncToggle: (val: boolean) => void;
  onSave: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  nickname,
  setNickname,
  dailyCalorieTarget,
  setCalorieTarget,
  syncHealthDevices,
  handleProfileSyncToggle,
  onSave,
}) => {
  return (
    <View style={styles.tabContentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Profile Settings 👤</Text>
          <Text style={styles.subtitle}>Configure daily targets and native watch integrations</Text>
        </View>
      </View>

      <View style={styles.profileFormCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Athlete Nickname</Text>
          <TextInput
            style={styles.profileInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="e.g. Alex"
            placeholderTextColor="#6c7281"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Daily Calorie Target (kcal)</Text>
          <TextInput
            style={styles.profileInput}
            value={dailyCalorieTarget.toString()}
            onChangeText={(val) => {
              const parsed = parseInt(val, 10);
              setCalorieTarget(isNaN(parsed) ? 0 : parsed);
            }}
            keyboardType="number-pad"
            placeholder="e.g. 2000"
            placeholderTextColor="#6c7281"
          />
        </View>

        <View style={styles.profileSwitchGroup}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text style={styles.switchTitle}>Native Device Sync</Text>
            <Text style={styles.switchDesc}>
              Sync steps and active calories dynamically from Apple HealthKit
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#2c2e3a', true: '#34c759' }}
            thumbColor={syncHealthDevices ? '#ffffff' : '#a0a5b5'}
            ios_backgroundColor="#2c2e3a"
            onValueChange={handleProfileSyncToggle}
            value={syncHealthDevices}
          />
        </View>

        <TouchableOpacity style={styles.profileSaveButton} onPress={onSave}>
          <Text style={styles.profileSaveButtonText}>SAVE & UPDATE 🚀</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContentContainer: {
    flex: 1,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#34c759',
    marginTop: 4,
    fontWeight: '500',
  },
  profileFormCard: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2c2e3a',
    marginTop: 10,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  profileInput: {
    backgroundColor: '#131419',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  profileSwitchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131419',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2c2e3a',
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
  profileSaveButton: {
    backgroundColor: '#34c759',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  profileSaveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
