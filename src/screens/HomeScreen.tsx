import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, Image, Animated } from 'react-native';
import { getTodaySteps, getTodayActiveCalories, requestHealthPermissions } from '../services/HealthService';

// Child Tab Screen Imports
import DashboardScreen from './DashboardScreen';
import DataScreen from './DataScreen';
import MealPlanScreen from './MealPlanScreen';
import ExerciseScreen from './ExerciseScreen';
import ProfileScreen from './ProfileScreen';

const HomeScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  // Extract profile data passed from Onboarding
  const { nickname = 'Athlete', dailyCalorieTarget = 2000, syncHealthDevices = false } = route.params || {};

  // Tab navigation state: 'dashboard' | 'data' | 'mealplan' | 'exercise' | 'profile'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data' | 'mealplan' | 'exercise' | 'profile'>('dashboard');

  // Unified telemetry & target configurations
  const [currentNickname, setCurrentNickname] = useState(nickname);
  const [currentCalorieTarget, setCurrentCalorieTarget] = useState(dailyCalorieTarget);
  const [currentSyncHealthDevices, setCurrentSyncHealthDevices] = useState(syncHealthDevices);

  // Calorie and activity state
  const [consumedCalories, setConsumedCalories] = useState(850);
  const [steps, setSteps] = useState(0);
  const [activeCalories, setActiveCalories] = useState(0);

  // Tab scaling animation references
  const tabScales: Record<string, Animated.Value> = {
    dashboard: React.useRef(new Animated.Value(1)).current,
    data: React.useRef(new Animated.Value(1)).current,
    mealplan: React.useRef(new Animated.Value(1)).current,
    exercise: React.useRef(new Animated.Value(1)).current,
    profile: React.useRef(new Animated.Value(1)).current,
  };

  // Fetch Apple HealthKit details if sync is active
  useEffect(() => {
    if (!currentSyncHealthDevices) {
      setSteps(0);
      setActiveCalories(0);
      return;
    }

    const fetchHealthData = async () => {
      try {
        const todaySteps = await getTodaySteps();
        const todayCalories = await getTodayActiveCalories();
        setSteps(todaySteps);
        setActiveCalories(todayCalories);
      } catch (err) {
        console.warn('Error fetching HealthKit data on Home Screen:', err);
      }
    };

    fetchHealthData();

    // Set up polling interval to fetch data dynamically every 10 seconds
    const interval = setInterval(fetchHealthData, 10000);
    return () => clearInterval(interval);
  }, [currentSyncHealthDevices]);

  // Handle sync switch toggle on profile tab
  const handleProfileSyncToggle = async (value: boolean) => {
    if (value) {
      try {
        const granted = await requestHealthPermissions();
        if (granted) {
          setCurrentSyncHealthDevices(true);
        } else {
          Alert.alert(
            'Permission Denied',
            'Permission to access Apple HealthKit was denied. Please enable it in Settings > Health > Data Access & Devices > Eat-Fit if you wish to sync device data.'
          );
          setCurrentSyncHealthDevices(false);
        }
      } catch (error) {
        console.warn('Error requesting health permissions:', error);
        setCurrentSyncHealthDevices(false);
      }
    } else {
      setCurrentSyncHealthDevices(false);
    }
  };

  // Profile save function
  const handleProfileSave = () => {
    if (!currentNickname.trim()) {
      Alert.alert('Required Field', 'Please enter a nickname.');
      return;
    }
    if (currentCalorieTarget <= 0) {
      Alert.alert('Invalid Target', 'Daily calorie target must be greater than 0.');
      return;
    }
    Alert.alert('Profile Saved! 💾', 'Your target and telemetry settings have been updated.');
    setActiveTab('dashboard');
  };

  // Perform tactile scale pop animation and trigger tab switch after 150ms
  const handleTabPress = (tabName: 'dashboard' | 'data' | 'mealplan' | 'exercise' | 'profile') => {
    Animated.sequence([
      Animated.timing(tabScales[tabName], {
        toValue: 0.82,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(tabScales[tabName], {
        toValue: 1.0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setActiveTab(tabName);
    }, 120);
  };

  // Render content of active tab modularly
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            nickname={currentNickname}
            syncHealthDevices={currentSyncHealthDevices}
            consumedCalories={consumedCalories}
            dailyCalorieTarget={currentCalorieTarget}
            activeCalories={activeCalories}
            steps={steps}
            onEditProfilePress={() => setActiveTab('profile')}
            onEnableSyncPress={() => setActiveTab('profile')}
          />
        );
      case 'data':
        return (
          <DataScreen
            steps={steps}
            activeCalories={activeCalories}
            consumedCalories={consumedCalories}
            setConsumedCalories={setConsumedCalories}
          />
        );
      case 'mealplan':
        return (
          <MealPlanScreen
            consumedCalories={consumedCalories}
            dailyCalorieTarget={currentCalorieTarget}
            setConsumedCalories={setConsumedCalories}
          />
        );
      case 'exercise':
        return <ExerciseScreen />;
      case 'profile':
        return (
          <ProfileScreen
            nickname={currentNickname}
            setNickname={setCurrentNickname}
            dailyCalorieTarget={currentCalorieTarget}
            setCalorieTarget={setCurrentCalorieTarget}
            syncHealthDevices={currentSyncHealthDevices}
            handleProfileSyncToggle={handleProfileSyncToggle}
            onSave={handleProfileSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Fixed Custom Bottom Navigation Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleTabPress('dashboard')}>
          <Animated.View style={[styles.iconWrapper, activeTab === 'dashboard' && styles.iconWrapperActive, { transform: [{ scale: tabScales.dashboard }] }]}>
            <Image
              source={require('../assets/home.png')}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabBarLabel, activeTab === 'dashboard' ? styles.tabBarLabelActive : styles.tabBarLabelInactive]}>Home</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleTabPress('data')}>
          <Animated.View style={[styles.iconWrapper, activeTab === 'data' && styles.iconWrapperActive, { transform: [{ scale: tabScales.data }] }]}>
            <Image
              source={require('../assets/calorie.png')}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabBarLabel, activeTab === 'data' ? styles.tabBarLabelActive : styles.tabBarLabelInactive]}>Activity</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleTabPress('mealplan')}>
          <Animated.View style={[styles.iconWrapper, activeTab === 'mealplan' && styles.iconWrapperActive, { transform: [{ scale: tabScales.mealplan }] }]}>
            <Image
              source={require('../assets/meal.png')}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabBarLabel, activeTab === 'mealplan' ? styles.tabBarLabelActive : styles.tabBarLabelInactive]}>Nutrition</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleTabPress('exercise')}>
          <Animated.View style={[styles.iconWrapper, activeTab === 'exercise' && styles.iconWrapperActive, { transform: [{ scale: tabScales.exercise }] }]}>
            <Image
              source={require('../assets/workout.png')}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabBarLabel, activeTab === 'exercise' ? styles.tabBarLabelActive : styles.tabBarLabelInactive]}>Workout</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleTabPress('profile')}>
          <Animated.View style={[styles.iconWrapper, activeTab === 'profile' && styles.iconWrapperActive, { transform: [{ scale: tabScales.profile }] }]}>
            <Image
              source={require('../assets/profile.png')}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabBarLabel, activeTab === 'profile' ? styles.tabBarLabelActive : styles.tabBarLabelInactive]}>Profile</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(36, 199, 109, 0.1)',
  },
  tabBarIcon: {
    width: 24,
    height: 24,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  tabBarLabelActive: {
    color: '#24C76D',
  },
  tabBarLabelInactive: {
    color: '#9CA3AF',
  },
});

export default HomeScreen;
