import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';

interface ProfileScreenProps {
  nickname: string;
  setNickname: (val: string) => void;
  dailyCalorieTarget: number;
  setCalorieTarget: (val: number) => void;
  syncHealthDevices: boolean;
  handleProfileSyncToggle: (val: boolean) => void;
  onSave: () => void;
}

// Custom Gestureless Slider Component
const CustomSlider = ({ 
  value, 
  min, 
  max, 
  onChange 
}: { 
  value: number; 
  min: number; 
  max: number; 
  onChange: (v: number) => void 
}) => {
  const [trackWidth, setTrackWidth] = useState(250);
  const percentage = ((value - min) / (max - min)) * 100;

  const handlePress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(x / trackWidth, 1));
    const val = Math.round(min + ratio * (max - min));
    onChange(val);
  };

  return (
    <View 
      style={styles.sliderTrack} 
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      onTouchStart={handlePress}
      onTouchMove={handlePress}
    >
      <View style={[styles.sliderFill, { width: `${percentage}%` }]} />
      <View style={[styles.sliderThumb, { left: `${percentage}%`, marginLeft: -8 }]} />
    </View>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  nickname,
  setNickname,
  dailyCalorieTarget,
  setCalorieTarget,
  syncHealthDevices,
  handleProfileSyncToggle,
  onSave,
}) => {
  // Navigation active state inside the Profile tab
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [googleSync, setGoogleSync] = useState(false);

  // Personal info fields
  const [fullName, setFullName] = useState(nickname || 'Alex Rivers');
  const [email, setEmail] = useState('alex.rivers@example.com');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [dob, setDob] = useState('10/12/1995');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState(182); // cm
  const [weight, setWeight] = useState(78); // kg

  const triggerSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out from Eat & Fit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Logged Out', 'You have been signed out.') },
    ]);
  };

  const selectGender = () => {
    Alert.alert('Select Gender', 'Choose your gender identity:', [
      { text: 'Male', onPress: () => setGender('Male') },
      { text: 'Female', onPress: () => setGender('Female') },
      { text: 'Other', onPress: () => setGender('Other') },
    ]);
  };

  const handleSaveChanges = () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Full Name is required.');
      return;
    }
    // Update local nickname state hook
    setNickname(fullName);
    Alert.alert('Success! 💾', 'Personal information saved.');
    setShowPersonalInfo(false);
  };

  const handleCancelDiscard = () => {
    Alert.alert('Discard Changes?', 'Any unsaved changes will be lost.', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => {
          setFullName(nickname || 'Alex Rivers');
          setShowPersonalInfo(false);
      }},
    ]);
  };

  // Render sub-screen of Personal Information editing
  if (showPersonalInfo) {
    return (
      <View style={styles.tabContentContainer}>
        {/* Settings Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButtonRow} onPress={handleCancelDiscard}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.settingsHeaderTitleText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.optionsDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Avatar Edit Card */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainerBig}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&h=150&q=80' }}
              style={styles.avatarImageBig}
            />
            <TouchableOpacity style={styles.pencilBadge}>
              <Text style={styles.pencilEmoji}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userNameText}>{fullName}</Text>
          <Text style={styles.personalInfoLabel}>PERSONAL INFORMATION</Text>
        </View>

        {/* Form Body Scroll */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
          {/* Identity Section */}
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionTitleRow}>
              <Text style={styles.formSectionEmoji}>👤</Text>
              <Text style={styles.formSectionTitleText}>Identity</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formInputLabel}>FULL NAME</Text>
              <TextInput
                style={styles.formTextInputField}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formInputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.formTextInputField}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Contact & Demographics Section */}
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionTitleRow}>
              <Text style={styles.formSectionEmoji}>📄</Text>
              <Text style={styles.formSectionTitleText}>Contact & Demographics</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formInputLabel}>PHONE NUMBER</Text>
              <TextInput
                style={styles.formTextInputField}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.dualColumnRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formInputLabel}>DATE OF BIRTH</Text>
                <View style={styles.dobContainerField}>
                  <TextInput
                    style={styles.dobTextInput}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="mm/dd/yyyy"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.calendarFieldEmoji}>📅</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.formInputLabel}>GENDER</Text>
                <TouchableOpacity style={styles.dropdownFieldBox} onPress={selectGender}>
                  <Text style={styles.dropdownFieldText}>{gender}</Text>
                  <Text style={styles.dropdownChevron}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Physical Metrics Section */}
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionTitleRow}>
              <Text style={styles.formSectionEmoji}>💳</Text>
              <Text style={styles.formSectionTitleText}>Physical Metrics</Text>
            </View>

            {/* Height Slider */}
            <View style={styles.sliderMetricGroup}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderLabelName}>HEIGHT</Text>
                <Text style={styles.sliderValueHighlight}>{height} cm</Text>
              </View>
              <CustomSlider value={height} min={140} max={228} onChange={setHeight} />
              <View style={styles.sliderRangeRow}>
                <Text style={styles.sliderRangeLabel}>140CM</Text>
                <Text style={styles.sliderRangeLabel}>228CM</Text>
              </View>
            </View>

            {/* Weight Slider */}
            <View style={styles.sliderMetricGroup}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderLabelName}>WEIGHT</Text>
                <Text style={styles.sliderValueHighlight}>{weight} kg</Text>
              </View>
              <CustomSlider value={weight} min={40} max={150} onChange={setWeight} />
              <View style={styles.sliderRangeRow}>
                <Text style={styles.sliderRangeLabel}>40KG</Text>
                <Text style={styles.sliderRangeLabel}>150KG</Text>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <TouchableOpacity style={styles.saveChangesBtn} onPress={handleSaveChanges}>
            <Text style={styles.saveBtnEmoji}>💾</Text>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelChangesBtn} onPress={handleCancelDiscard}>
            <Text style={styles.cancelBtnText}>Cancel & Discard</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Render main settings dashboard
  return (
    <View style={styles.tabContentContainer}>
      {/* Top Bar matching design */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.avatarContainerHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&h=150&q=80' }}
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
            source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&h=150&q=80' }}
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
        <TouchableOpacity style={styles.settingListItem} onPress={() => setShowPersonalInfo(true)}>
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
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  settingsHeaderTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24C76D',
    marginLeft: 8,
  },
  optionsDots: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9CA3AF',
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
  pencilBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#24C76D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pencilEmoji: {
    fontSize: 12,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  personalInfoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginTop: 6,
    letterSpacing: 0.5,
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

  // Personal Info Form styles
  formScrollContent: {
    paddingBottom: 40,
  },
  formSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  formSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formSectionEmoji: {
    fontSize: 18,
  },
  formSectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  formInputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  formTextInputField: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
    fontSize: 15,
  },
  dualColumnRow: {
    flexDirection: 'row',
  },
  dobContainerField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  dobTextInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#111827',
    fontSize: 15,
  },
  calendarFieldEmoji: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  dropdownFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12.5,
  },
  dropdownFieldText: {
    fontSize: 15,
    color: '#111827',
  },
  dropdownChevron: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  sliderMetricGroup: {
    marginBottom: 20,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sliderLabelName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  sliderValueHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
    marginTop: 10,
    marginBottom: 6,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#24C76D',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#24C76D',
  },
  sliderRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderRangeLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  saveChangesBtn: {
    backgroundColor: '#24C76D',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveBtnEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelChangesBtn: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});

export default ProfileScreen;
