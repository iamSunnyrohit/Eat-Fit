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
            placeholderTextColor="#9CA3AF"
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
            placeholderTextColor="#9CA3AF"
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
            trackColor={{ false: '#E5E7EB', true: '#24C76D' }}
            thumbColor={syncHealthDevices ? '#ffffff' : '#F3F4F6'}
            ios_backgroundColor="#E5E7EB"
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
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#24C76D',
    marginTop: 4,
    fontWeight: '600',
  },
  profileFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 10,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  profileInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileSwitchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  switchDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  profileSaveButton: {
    backgroundColor: '#24C76D',
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
