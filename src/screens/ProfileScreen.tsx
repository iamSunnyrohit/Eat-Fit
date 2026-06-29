import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
  const { isDarkMode } = useTheme();
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
      style={[styles.sliderTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E7EB' }]} 
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
  const { isDarkMode, setIsDarkMode } = useTheme();
  const theme = {
    bg: isDarkMode ? '#131315' : '#F8F9FA',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    border: isDarkMode ? '#2A2A2C' : '#E5E7EB',
    inputBg: isDarkMode ? '#2A2A2C' : '#FFFFFF',
  };
  // Navigation active sub-screens inside the Profile tab
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [googleSync, setGoogleSync] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

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

  // Render Sub-screen 1: Subscription page
  if (showSubscription) {
    return (
      <View style={[styles.tabContentContainer, { backgroundColor: theme.bg }]}>
        {/* Settings Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButtonRow} onPress={() => setShowSubscription(false)}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.settingsHeaderTitleText}>Subscription</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.inputBg }]}>
            <Text style={styles.optionsDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Subscription details */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
          {/* Main Active Plan Card */}
          <View style={styles.subPlanCard}>
            <View style={styles.subActiveBadge}>
              <Text style={styles.subActiveBadgeText}>ACTIVE PLAN</Text>
            </View>
            <Text style={styles.subPlanNameText}>Annual Pro</Text>
            <Text style={styles.subPlanPriceText}>
              ₹1,800 <Text style={styles.subPlanPeriodText}>/ year</Text>
            </Text>
            <View style={styles.subRenewalBox}>
              <Text style={styles.subRenewalLabel}>NEXT RENEWAL</Text>
              <Text style={styles.subRenewalValue}>October 24, 2024</Text>
            </View>
          </View>

          {/* Pro Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={[styles.benefitsSectionTitle, { color: theme.text }]}>Pro Benefits</Text>

            {/* Benefit 1 */}
            <View style={[styles.benefitCard, { backgroundColor: theme.card }]}>
              <View style={[styles.benefitIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E8FDF0' }]}>
                <Text style={styles.benefitEmoji}>📊</Text>
              </View>
              <View style={styles.benefitMeta}>
                <Text style={[styles.benefitTitleText, { color: theme.text }]}>Advanced Analytics</Text>
                <Text style={[styles.benefitSubtitleText, { color: theme.subText }]}>
                  Deep dive into your metabolic trends and performance metrics.
                </Text>
                <Text style={styles.benefitStatusText}>✓ Enabled</Text>
              </View>
            </View>

            {/* Benefit 2 */}
            <View style={[styles.benefitCard, { backgroundColor: theme.card }]}>
              <View style={[styles.benefitIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#EBFDF2' }]}>
                <Text style={styles.benefitEmoji}>📷</Text>
              </View>
              <View style={styles.benefitMeta}>
                <Text style={[styles.benefitTitleText, { color: theme.text }]}>AI Meal Scanner</Text>
                <Text style={[styles.benefitSubtitleText, { color: theme.subText }]}>
                  Instant macro-nutrient breakdown using your phone's camera.
                </Text>
                <Text style={styles.benefitStatusText}>✓ Enabled</Text>
              </View>
            </View>

            {/* Benefit 3 */}
            <View style={[styles.benefitCard, { backgroundColor: theme.card }]}>
              <View style={[styles.benefitIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#EEF2FF' }]}>
                <Text style={styles.benefitEmoji}>🏋️‍♂️</Text>
              </View>
              <View style={styles.benefitMeta}>
                <Text style={[styles.benefitTitleText, { color: theme.text }]}>Exclusive Workouts</Text>
                <Text style={[styles.benefitSubtitleText, { color: theme.subText }]}>
                  Access to premium athlete-designed training programs.
                </Text>
                <Text style={styles.benefitStatusText}>✓ Enabled</Text>
              </View>
            </View>
          </View>

          {/* Payment Method Section */}
          <View style={styles.paymentSection}>
            <Text style={[styles.benefitsSectionTitle, { color: theme.text }]}>Payment Method</Text>
            <View style={[styles.paymentCard, { backgroundColor: theme.card }]}>
              <View style={[styles.visaCardBadge, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.visaCardText, { color: theme.text }]}>VISA</Text>
              </View>
              <View style={styles.paymentMeta}>
                <Text style={[styles.paymentCardTitle, { color: theme.text }]}>Visa ending in 4242</Text>
                <Text style={[styles.paymentCardExpiry, { color: theme.subText }]}>Expires 12/26</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.editPaymentText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Management Section */}
          <View style={styles.managementSection}>
            <Text style={[styles.benefitsSectionTitle, { color: theme.text }]}>Management</Text>

            <TouchableOpacity style={styles.managePlanBtn} onPress={() => Alert.alert('Manage Plan', 'Redirecting to App Store settings...')}>
              <Text style={styles.managePlanBtnIcon}>🔄</Text>
              <Text style={styles.managePlanBtnText}>Manage Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.restorePurchasesBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => Alert.alert('Purchases Restored', 'Your Pro account features have been refreshed.')}>
              <Text style={styles.restorePurchasesBtnIcon}>📥</Text>
              <Text style={[styles.restorePurchasesBtnText, { color: theme.text }]}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Separator Line & Footer tagline */}
          <View style={[styles.subFooterLineTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E7EB' }]}>
            <View style={[styles.subFooterLineFill, { backgroundColor: theme.subText }]} />
          </View>
          <Text style={[styles.subFooterText, { color: theme.subText }]}>Fueling your potential since 2021</Text>
        </ScrollView>
      </View>
    );
  }

  // Render Sub-screen 3: Security management page
  if (showSecurity) {
    return (
      <View style={[styles.tabContentContainer, { backgroundColor: theme.bg }]}>
        {/* Settings Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButtonRow} onPress={() => setShowSecurity(false)}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.settingsHeaderTitleText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.inputBg }]}>
            <Text style={styles.optionsDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Security Details */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
          {/* Security Checkup Card */}
          <View style={styles.securityCheckupCard}>
            <View style={styles.securityHeaderRow}>
              <Text style={styles.securityShieldIcon}>🛡️</Text>
              <Text style={styles.securityCheckupTitle}>Security Checkup</Text>
            </View>
            <Text style={styles.securityCheckupDesc}>
              Your account is secure. No issues found in the last 30 days.
            </Text>
            <TouchableOpacity style={styles.runDiagnosticsBtn} onPress={() => Alert.alert('Diagnostics', 'Running security diagnostics... System is secure.')}>
              <Text style={styles.runDiagnosticsBtnText}>RUN DIAGNOSTICS</Text>
            </TouchableOpacity>
          </View>

          {/* Password Management Card */}
          <View style={[styles.securityWhiteCard, { backgroundColor: theme.card }]}>
            <View style={styles.securityCardMainRow}>
              <View style={[styles.securityIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E8FDF0' }]}>
                <Text style={styles.securityCardEmoji}>🔄</Text>
              </View>
              <View style={styles.securityCardMeta}>
                <Text style={[styles.securityCardTitle, { color: theme.text }]}>Password Management</Text>
                <Text style={[styles.securityCardSubtitle, { color: theme.subText }]}>Last changed 4 months ago. Regularly updating helps protect your data.</Text>
              </View>
              <Text style={styles.securityChevron}>＞</Text>
            </View>
            <TouchableOpacity style={[styles.changePasswordBtn, { borderColor: theme.border }]} onPress={() => Alert.alert('Change Password', 'Password reset instructions have been sent to your email.')}>
              <Text style={[styles.changePasswordBtnText, { color: theme.text }]}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {/* 2FA Card */}
          <View style={[styles.securityWhiteCard, { backgroundColor: theme.card }]}>
            <View style={styles.securityCardMainRow}>
              <View style={[styles.securityIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E8FDF0' }]}>
                <Text style={styles.securityCardEmoji}>📱</Text>
              </View>
              <View style={styles.securityCardMeta}>
                <Text style={[styles.securityCardTitle, { color: theme.text }]}>2FA</Text>
                <Text style={[styles.securityCardSubtitle, { color: theme.subText }]}>Extra layer of security for your account.</Text>
              </View>
            </View>
            <View style={[styles.securityStatusRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.securityStatusLabel, { color: twoFactorEnabled ? '#24C76D' : '#9CA3AF' }]}>
                STATUS: {twoFactorEnabled ? 'ON' : 'OFF'}
              </Text>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: '#D1D5DB', true: '#24C76D' }}
                thumbColor={twoFactorEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* Biometrics Card */}
          <View style={[styles.securityWhiteCard, { backgroundColor: theme.card }]}>
            <View style={styles.securityCardMainRow}>
              <View style={[styles.securityIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E8FDF0' }]}>
                <Text style={styles.securityCardEmoji}>🧬</Text>
              </View>
              <View style={styles.securityCardMeta}>
                <Text style={[styles.securityCardTitle, { color: theme.text }]}>Biometrics</Text>
                <Text style={[styles.securityCardSubtitle, { color: theme.subText }]}>Use Face ID or Touch ID to sign in.</Text>
              </View>
            </View>
            <View style={[styles.securityStatusRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.securityStatusLabel, { color: biometricsEnabled ? '#24C76D' : '#9CA3AF' }]}>
                {biometricsEnabled ? 'ENABLED' : 'DISABLED'}
              </Text>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#24C76D' }}
                thumbColor={biometricsEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* Logged-in Devices Section */}
          <View style={styles.devicesSection}>
            <Text style={[styles.devicesSectionTitle, { color: theme.text }]}>Logged-in Devices</Text>

            {/* Device 1: MacBook Pro */}
            <View style={[styles.deviceItemCard, { backgroundColor: theme.card }]}>
              <View style={[styles.deviceIconBox, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
                <Text style={styles.deviceEmoji}>💻</Text>
              </View>
              <View style={styles.deviceMeta}>
                <Text style={[styles.deviceModelText, { color: theme.text }]}>MacBook Pro 16"</Text>
                <Text style={[styles.deviceLocationText, { color: theme.subText }]}>Mumbai, India • Active Now</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Log Out Device', 'Logged out of MacBook Pro 16".')}>
                <Text style={styles.deviceLogOutText}>Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* Device 2: iPhone 15 Pro */}
            <View style={[styles.deviceItemCard, { backgroundColor: theme.card }]}>
              <View style={[styles.deviceIconBox, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
                <Text style={styles.deviceEmoji}>📱</Text>
              </View>
              <View style={styles.deviceMeta}>
                <Text style={[styles.deviceModelText, { color: theme.text }]}>iPhone 15 Pro</Text>
                <Text style={[styles.deviceLocationText, { color: theme.subText }]}>New Delhi, India • 2 hours ago</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Log Out Device', 'Logged out of iPhone 15 Pro.')}>
                <Text style={styles.deviceLogOutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Banner */}
          <View style={styles.securityImageContainer}>
            <Image
              source={require('../assets/security_banner.png')}
              style={styles.securityBannerImage}
              resizeMode="cover"
            />
            <View style={styles.securityImageOverlay}>
              <Text style={styles.securityOverlayText}>Data Protection Protocol 4.2.0</Text>
            </View>
          </View>

          {/* Delete Account Footer Section */}
          <View style={[styles.deleteAccountContainer, { borderTopColor: theme.border }]}>
            <Text style={[styles.deleteAccountWarningText, { color: theme.subText }]}>
              Thinking of leaving Eat & Fit? This action is irreversible and all your training data will be permanently erased.
            </Text>
            <TouchableOpacity style={styles.deleteAccountBtn} onPress={() => {
              Alert.alert('Delete Account', 'Are you sure you want to permanently delete your account? This action cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted', 'Your account has been permanently removed.') }
              ]);
            }}>
              <Text style={styles.deleteAccountBtnText}>DELETE ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render Sub-screen 2: Personal Information editing page
  if (showPersonalInfo) {
    return (
      <View style={[styles.tabContentContainer, { backgroundColor: theme.bg }]}>
        {/* Settings Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButtonRow} onPress={handleCancelDiscard}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.settingsHeaderTitleText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.inputBg }]}>
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
          <Text style={[styles.userNameText, { color: theme.text }]}>{fullName}</Text>
          <Text style={[styles.personalInfoLabel, { color: theme.subText }]}>PERSONAL INFORMATION</Text>
        </View>

        {/* Form Body Scroll */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
          {/* Identity Section */}
          <View style={[styles.formSectionCard, { backgroundColor: theme.card }]}>
            <View style={styles.formSectionTitleRow}>
              <Text style={styles.formSectionEmoji}>👤</Text>
              <Text style={[styles.formSectionTitleText, { color: theme.text }]}>Identity</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formInputLabel}>FULL NAME</Text>
              <TextInput
                style={[styles.formTextInputField, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formInputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={[styles.formTextInputField, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Contact & Demographics Section */}
          <View style={[styles.formSectionCard, { backgroundColor: theme.card }]}>
            <View style={styles.formSectionTitleRow}>
              <Text style={styles.formSectionEmoji}>📄</Text>
              <Text style={[styles.formSectionTitleText, { color: theme.text }]}>Contact & Demographics</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formInputLabel}>PHONE NUMBER</Text>
              <TextInput
                style={[styles.formTextInputField, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.dualColumnRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formInputLabel}>DATE OF BIRTH</Text>
                <View style={[styles.dobContainerField, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.dobTextInput, { color: theme.text }]}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="mm/dd/yyyy"
                    placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text style={styles.calendarFieldEmoji}>📅</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.formInputLabel}>GENDER</Text>
                <TouchableOpacity style={[styles.dropdownFieldBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]} onPress={selectGender}>
                  <Text style={[styles.dropdownFieldText, { color: theme.text }]}>{gender}</Text>
                  <Text style={styles.dropdownChevron}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Physical Metrics Section */}
          <View style={[styles.formSectionCard, { backgroundColor: theme.card }]}>
            <View style={styles.formSectionTitleRow}>
              <Text style={styles.formSectionEmoji}>💳</Text>
              <Text style={[styles.formSectionTitleText, { color: theme.text }]}>Physical Metrics</Text>
            </View>

            {/* Height Slider */}
            <View style={styles.sliderMetricGroup}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderLabelName}>HEIGHT</Text>
                <Text style={styles.sliderValueHighlight}>{height} cm</Text>
              </View>
              <CustomSlider value={height} min={140} max={228} onChange={setHeight} />
              <View style={styles.sliderRangeRow}>
                <Text style={[styles.sliderRangeLabel, { color: theme.subText }]}>140CM</Text>
                <Text style={[styles.sliderRangeLabel, { color: theme.subText }]}>228CM</Text>
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
                <Text style={[styles.sliderRangeLabel, { color: theme.subText }]}>40KG</Text>
                <Text style={[styles.sliderRangeLabel, { color: theme.subText }]}>150KG</Text>
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
  // Render main settings dashboard
  return (
    <View style={[styles.tabContentContainer, { backgroundColor: theme.bg }]}>
      {/* Top Bar matching design */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>Eat & Fit</Text>
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
        <Text style={[styles.userNameText, { color: theme.text }]}>{nickname || 'Alex Rivers'}</Text>
        <Text style={[styles.userTierText, { color: theme.subText }]}>🛡️ Elite Athlete • Pro Member</Text>
      </View>

      {/* Summary Metrics Row (Weight / Goal Progress) */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.metricLabel, { color: theme.subText }]}>WEIGHT</Text>
          <Text style={[styles.metricValue, { color: theme.text }]}>78.5 <Text style={styles.metricUnit}>kg</Text></Text>
          <View style={[styles.barTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E7EB' }]}>
            <View style={[styles.barFillGreen, { width: '65%' }]} />
          </View>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.metricLabel, { color: theme.subText }]}>GOAL PROGRESS</Text>
          <Text style={[styles.metricValue, { color: '#3B82F6' }]}>92 <Text style={styles.metricUnitBlue}>%</Text></Text>
          <View style={[styles.barTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E7EB' }]}>
            <View style={[styles.barFillBlue, { width: '92%' }]} />
          </View>
        </View>
      </View>

      {/* Streak Card */}
      <View style={[styles.streakCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.streakLabel, { color: theme.subText }]}>STREAK</Text>
        <View style={styles.streakValueRow}>
          <Text style={[styles.streakValue, { color: theme.text }]}>24</Text>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>
        <Text style={[styles.streakSubtitle, { color: theme.subText }]}>Top 5% of athletes this month</Text>
      </View>

      {/* Health Integrations section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeaderTitle, { color: theme.text }]}>Health Integrations</Text>

        {/* Apple HealthKit Switch */}
        <View style={[styles.integrationRow, { backgroundColor: theme.card }]}>
          <View style={[styles.integrationIconBox, { backgroundColor: isDarkMode ? '#2C2C2E' : '#EEF2FF' }]}>
            <Text style={styles.integrationEmoji}>➕</Text>
          </View>
          <View style={styles.integrationMeta}>
            <Text style={[styles.integrationName, { color: theme.text }]}>Apple HealthKit</Text>
            <Text style={[styles.integrationDesc, { color: theme.subText }]}>Sync steps, sleep, and heart rate</Text>
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
        <View style={[styles.integrationRow, { backgroundColor: theme.card }]}>
          <View style={[styles.integrationIconBox, { backgroundColor: isDarkMode ? '#2C2C2E' : '#EBFDF2' }]}>
            <Text style={styles.integrationEmoji}>🔁</Text>
          </View>
          <View style={styles.integrationMeta}>
            <Text style={[styles.integrationName, { color: theme.text }]}>Google Health Connect</Text>
            <Text style={[styles.integrationDesc, { color: theme.subText }]}>Connected to Pixel Watch 2</Text>
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
        <Text style={[styles.sectionHeaderTitle, { color: theme.text }]}>Account Settings</Text>

        {/* Personal Info */}
        <TouchableOpacity style={[styles.settingListItem, { backgroundColor: theme.card }]} onPress={() => setShowPersonalInfo(true)}>
          <View style={[styles.settingIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <Text style={styles.settingEmoji}>👤</Text>
          </View>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Personal Information</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Subscription */}
        <TouchableOpacity style={[styles.settingListItem, { backgroundColor: theme.card }]} onPress={() => setShowSubscription(true)}>
          <View style={[styles.settingIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <Text style={styles.settingEmoji}>💳</Text>
          </View>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Subscription</Text>
          <Text style={styles.tierHighlightText}>Annual Pro</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity style={[styles.settingListItem, { backgroundColor: theme.card }]}>
          <View style={[styles.settingIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <Text style={styles.settingEmoji}>🔔</Text>
          </View>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Notifications</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Security */}
        <TouchableOpacity style={[styles.settingListItem, { backgroundColor: theme.card }]} onPress={() => setShowSecurity(true)}>
          <View style={[styles.settingIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <Text style={styles.settingEmoji}>🛡️</Text>
          </View>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Security</Text>
          <Text style={styles.settingArrow}>＞</Text>
        </TouchableOpacity>

        {/* Dark Mode switch */}
        <View style={[styles.settingListItem, { backgroundColor: theme.card }]}>
          <View style={[styles.settingIconWrapper, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <Text style={styles.settingEmoji}>🌙</Text>
          </View>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#D1D5DB', true: '#24C76D' }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Sign Out Outlined Button */}
      <TouchableOpacity style={[styles.signOutButton, { backgroundColor: theme.card, borderColor: '#EF4444' }]} onPress={triggerSignOut}>
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
    boxShadow: '0px 4px 10px rgba(36, 199, 109, 0.18)',
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
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
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
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
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
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
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
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
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
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
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

  // Subscription Sub-screen styles
  subPlanCard: {
    backgroundColor: '#24C76D',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    marginBottom: 24,
    marginTop: 10,
  },
  subActiveBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  subActiveBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subPlanNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 14,
  },
  subPlanPriceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  subPlanPeriodText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  subRenewalBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },
  subRenewalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subRenewalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  benefitIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8FDF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitEmoji: {
    fontSize: 20,
  },
  benefitMeta: {
    flex: 1,
    marginLeft: 14,
  },
  benefitTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  benefitSubtitleText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
    marginVertical: 4,
  },
  benefitStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  visaCardBadge: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  visaCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    fontStyle: 'italic',
  },
  paymentMeta: {
    flex: 1,
    marginLeft: 14,
  },
  paymentCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  paymentCardExpiry: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
  editPaymentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#24C76D',
    paddingHorizontal: 8,
  },
  managementSection: {
    marginBottom: 24,
  },
  managePlanBtn: {
    backgroundColor: '#0F733C',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  managePlanBtnIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  managePlanBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  restorePurchasesBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  restorePurchasesBtnIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  restorePurchasesBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
  },
  subFooterLineTrack: {
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 1.5,
    width: '60%',
    alignSelf: 'center',
    marginVertical: 14,
  },
  subFooterLineFill: {
    height: '100%',
    backgroundColor: '#9CA3AF',
    borderRadius: 1.5,
    width: '100%',
  },
  subFooterText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },

  // Security Sub-screen styles
  securityCheckupCard: {
    backgroundColor: '#24C76D',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    marginBottom: 20,
    marginTop: 10,
  },
  securityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  securityShieldIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  securityCheckupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A4E2B',
  },
  securityCheckupDesc: {
    fontSize: 14,
    color: '#0A4E2B',
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  runDiagnosticsBtn: {
    backgroundColor: '#0F733C',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runDiagnosticsBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  securityWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  securityCardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8FDF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityCardEmoji: {
    fontSize: 20,
  },
  securityCardMeta: {
    flex: 1,
    marginLeft: 14,
  },
  securityCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  securityCardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
    marginTop: 4,
  },
  securityChevron: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  changePasswordBtn: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  changePasswordBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
  },
  securityStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  securityStatusLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  devicesSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  devicesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F733C',
    marginBottom: 14,
  },
  deviceItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  deviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceEmoji: {
    fontSize: 20,
  },
  deviceMeta: {
    flex: 1,
    marginLeft: 14,
  },
  deviceModelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  deviceLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  deviceLogOutText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
    textDecorationLine: 'underline',
    paddingHorizontal: 8,
  },
  securityImageContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#3a3a3c',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  securityBannerImage: {
    width: '100%',
    height: '100%',
  },
  securityImageOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  securityOverlayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  deleteAccountContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deleteAccountWarningText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  deleteAccountBtn: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAccountBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
