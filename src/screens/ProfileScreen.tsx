import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, Alert } from 'react-native';

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
  const [googleSync, setGoogleSync] = useState(false);

  const triggerSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out from Eat & Fit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Logged Out', 'You have been signed out.') },
    ]);
  };

  return (
    <View style={styles.tabContentContainer}>
      {/* Top Bar matching design */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.avatarContainerHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.appName}>Eat & Fit</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.bellEmoji}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileInfoContainer}>
        <View style={styles.avatarContainerBig}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' }}
            style={styles.avatarImageBig}
          />
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
        <Text style={styles.userNameText}>{nickname || 'Alex Rivers'}</Text>
        <Text style={styles.userTierText}>🛡️ Elite Athlete • Pro Member</Text>
      </View>

      {/* Summary Metrics Row (Weight / Goal Progress) */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>WEIGHT</Text>
          <Text style={styles.metricValue}>78.5 <Text style={styles.metricUnit}>kg</Text></Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFillGreen, { width: '65%' }]} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>GOAL PROGRESS</Text>
          <Text style={[styles.metricValue, { color: '#3B82F6' }]}>92 <Text style={styles.metricUnitBlue}>%</Text></Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFillBlue, { width: '92%' }]} />
          </View>
        </View>
      </View>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <Text style={styles.streakLabel}>STREAK</Text>
        <View style={styles.streakValueRow}>
          <Text style={styles.streakValue}>24</Text>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>
        <Text style={styles.streakSubtitle}>Top 5% of athletes this month</Text>
      </View>

      {/* Health Integrations section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeaderTitle}>Health Integrations</Text>

        {/* Apple HealthKit Switch */}
        <View style={styles.integrationRow}>
          <View style={styles.integrationIconBox}>
            <Text style={styles.integrationEmoji}>➕</Text>
          </View>
          <View style={styles.integrationMeta}>
            <Text style={styles.integrationName}>Apple HealthKit</Text>
            <Text style={styles.integrationDesc}>Sync steps, sleep, and heart rate</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E7EB', true: '#24C76D' }}
            thumbColor={syncHealthDevices ? '#ffffff' : '#F3F4F6'}
            ios_backgroundColor="#E5E7EB"
            onValueChange={handleProfileSyncToggle}
            value={syncHealthDevices}
          />
        </View>

        {/* Google Health Connect Switch */}
        <View style={styles.integrationRow}>
          <View style={[styles.integrationIconBox, { backgroundColor: '#EBFDF2' }]}>
            <Text style={styles.integrationEmoji}>🔁</Text>
          </View>
          <View style={styles.integrationMeta}>
            <Text style={styles.integrationName}>Google Health Connect</Text>
            <Text style={styles.integrationDesc}>Connected to Pixel Watch 2</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E7EB', true: '#24C76D' }}
            thumbColor={googleSync ? '#ffffff' : '#F3F4F6'}
            ios_backgroundColor="#E5E7EB"
            onValueChange={setGoogleSync}
            value={googleSync}
          />
        </View>
      </View>

      {/* Account Settings section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeaderTitle}>Account Settings</Text>

        {/* Personal Info */}
        <TouchableOpacity style={styles.settingListItem} onPress={onSave}>
          <View style={styles.settingIconWrapper}>
            <Text style={styles.settingEmoji}>👤</Text>
          </View>
          <Text style={styles.settingTitle}>Personal Information</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Subscription */}
        <TouchableOpacity style={styles.settingListItem}>
          <View style={styles.settingIconWrapper}>
            <Text style={styles.settingEmoji}>💳</Text>
          </View>
          <Text style={styles.settingTitle}>Subscription</Text>
          <Text style={styles.tierHighlightText}>Annual Pro</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity style={styles.settingListItem}>
          <View style={styles.settingIconWrapper}>
            <Text style={styles.settingEmoji}>🔔</Text>
          </View>
          <Text style={styles.settingTitle}>Notifications</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Security */}
        <TouchableOpacity style={styles.settingListItem}>
          <View style={styles.settingIconWrapper}>
            <Text style={styles.settingEmoji}>🛡️</Text>
          </View>
          <Text style={styles.settingTitle}>Security</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Outlined Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={triggerSignOut}>
        <Text style={styles.signOutIcon}>🚪</Text>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContentContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainerHeader: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#24C76D',
    marginLeft: 12,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellEmoji: {
    fontSize: 16,
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainerBig: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#24C76D',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  avatarImageBig: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  proBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#24C76D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  userTierText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#24C76D',
    marginTop: 8,
    marginBottom: 12,
  },
  metricUnit: {
    fontSize: 12,
    color: '#111827',
    fontWeight: 'normal',
  },
  metricUnitBlue: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: 'normal',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFillGreen: {
    height: '100%',
    backgroundColor: '#24C76D',
    borderRadius: 3,
  },
  barFillBlue: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  fireEmoji: {
    fontSize: 20,
    marginLeft: 6,
  },
  streakSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },
  integrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  integrationIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  integrationEmoji: {
    fontSize: 18,
  },
  integrationMeta: {
    flex: 1,
    marginLeft: 14,
  },
  integrationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  integrationDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
  settingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  settingIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingEmoji: {
    fontSize: 18,
  },
  settingTitle: {
    flex: 1,
    marginLeft: 14,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  tierHighlightText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#24C76D',
    marginRight: 10,
  },
  settingArrow: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  signOutButton: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 20,
  },
  signOutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});

export default ProfileScreen;
