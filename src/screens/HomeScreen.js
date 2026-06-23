import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = ({ route, navigation }) => {
  // Extract profile data passed from Onboarding
  const { profileId, nickname = 'Athlete', dailyCalorieTarget = 2000 } = route.params || {};

  // Core State
  const [consumedCalories, setConsumedCalories] = useState(850);
  const [scanning, setScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  
  // Tab state for workouts: 'yoga' | 'pilates' | 'strength'
  const [activeWorkoutTab, setActiveWorkoutTab] = useState('yoga');

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cameraRollStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraRollStatus !== 'granted' || cameraStatus !== 'granted') {
          console.warn('Camera or gallery permissions not granted.');
        }
      }
    })();
  }, []);

  // AI Scanner Food Database for simulation
  const MOCK_MEAL_DATABASE = [
    {
      name: 'Avocado Toast with Egg 🥑🍳',
      calories: 340,
      protein: 14,
      fats: 18,
      fiber: 6
    },
    {
      name: 'Grilled Chicken Quinoa Bowl 🍗🥗',
      calories: 520,
      protein: 38,
      fats: 12,
      fiber: 7
    },
    {
      name: 'Berry Oats with Honey 🥣🍓',
      calories: 280,
      protein: 8,
      fats: 4,
      fiber: 9
    },
    {
      name: 'Baked Salmon with Broccoli 🥩🥦',
      calories: 450,
      protein: 32,
      fats: 22,
      fiber: 5
    }
  ];

  // Helper to handle camera/library selection and simulate AI scanner
  const handleImageSource = async (useCamera = false) => {
    let result;
    try {
      const options = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };

      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setScannedImage(imageUri);
        setScanResult(null);
        setScanning(true);

        // Simulate AI Server processing delay
        setTimeout(() => {
          setScanning(false);
          // Pick a random food item from mock database
          const randomFood = MOCK_MEAL_DATABASE[Math.floor(Math.random() * MOCK_MEAL_DATABASE.length)];
          setScanResult(randomFood);
        }, 2200);
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Scan Error', 'Unable to access photos/camera. Please try again.');
    }
  };

  const addScannedCalories = () => {
    if (scanResult) {
      setConsumedCalories(prev => prev + scanResult.calories);
      Alert.alert('Added! 🍏', `${scanResult.name} (${scanResult.calories} kcal) added to daily consumed tracker.`);
      setScannedImage(null);
      setScanResult(null);
    }
  };

  const getCaloriePercentage = () => {
    const percentage = (consumedCalories / dailyCalorieTarget) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {nickname}! 👋</Text>
          <Text style={styles.subtitle}>Health sync synced successfully via HealthKit</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge} onPress={() => navigation.navigate('HomeSetup')}>
          <Text style={styles.profileBadgeText}>Edit Target</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Progress Card */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Daily Calorie Budget</Text>
        <View style={styles.progressMetrics}>
          <View>
            <Text style={styles.metricNumber}>{consumedCalories}</Text>
            <Text style={styles.metricLabel}>Consumed kcal</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={[styles.metricNumber, { color: '#4a90e2' }]}>{dailyCalorieTarget}</Text>
            <Text style={styles.metricLabel}>Target kcal</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={[styles.metricNumber, { color: '#ffcc00' }]}>
              {Math.max(dailyCalorieTarget - consumedCalories, 0)}
            </Text>
            <Text style={styles.metricLabel}>Remaining kcal</Text>
          </View>
        </View>

        {/* Custom Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${getCaloriePercentage()}%`,
                backgroundColor: consumedCalories > dailyCalorieTarget ? '#ff3b30' : '#34c759'
              }
            ]} 
          />
        </View>
        <Text style={styles.progressBarPercentage}>{Math.round(getCaloriePercentage())}% budget consumed</Text>
      </View>

      {/* Feature 1: AI Meal Calorie Scanner */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>AI Calorie Scanner 📷</Text>
        <Text style={styles.sectionSub}>Take a photo of your meal to estimate calories and macros</Text>
        
        <View style={styles.scannerContainer}>
          <View style={styles.scannerButtons}>
            <TouchableOpacity style={styles.scanButton} onPress={() => handleImageSource(true)}>
              <Text style={styles.scanButtonText}>Take Photo 📷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: '#1e2029', borderColor: '#2c2e3a' }]} onPress={() => handleImageSource(false)}>
              <Text style={[styles.scanButtonText, { color: '#ffffff' }]}>Upload Image 🖼️</Text>
            </TouchableOpacity>
          </View>

          {/* Scanner Output Workspace */}
          {scannedImage && (
            <View style={styles.previewCard}>
              <Image source={{ uri: scannedImage }} style={styles.previewImage} />
              
              {scanning && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#34c759" />
                  <Text style={styles.loadingText}>AI identifying ingredients...</Text>
                </View>
              )}

              {scanResult && (
                <View style={styles.resultDetails}>
                  <Text style={styles.resultHeader}>Meal Identified!</Text>
                  <Text style={styles.foodName}>{scanResult.name}</Text>
                  
                  <View style={styles.macroRow}>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroVal}>{scanResult.calories}</Text>
                      <Text style={styles.macroKey}>kcal</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroVal}>{scanResult.protein}g</Text>
                      <Text style={styles.macroKey}>protein</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroVal}>{scanResult.fats}g</Text>
                      <Text style={styles.macroKey}>fats</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroVal}>{scanResult.fiber}g</Text>
                      <Text style={styles.macroKey}>fiber</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.addButton} onPress={addScannedCalories}>
                    <Text style={styles.addButtonText}>Add to Daily Calories ＋</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Feature 2: Meal Plan & Recipes */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Recommended Meal Plan 🥣</Text>
        <Text style={styles.sectionSub}>Structured recipes and macro balances tailored for you</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList}>
          {/* Recipe 1 */}
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>Keto Baked Salmon 🥩</Text>
            <Text style={styles.recipeKcal}>580 kcal</Text>
            
            <View style={styles.macroBarContainer}>
              <Text style={styles.macroLabel}>Fats (28g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '80%', backgroundColor: '#ff9500' }]} /></View>

              <Text style={styles.macroLabel}>Protein (42g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '90%', backgroundColor: '#34c759' }]} /></View>

              <Text style={styles.macroLabel}>Fiber (2g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '10%', backgroundColor: '#4a90e2' }]} /></View>
            </View>
          </View>

          {/* Recipe 2 */}
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>Quinoa Protein Salad 🥗</Text>
            <Text style={styles.recipeKcal}>450 kcal</Text>
            
            <View style={styles.macroBarContainer}>
              <Text style={styles.macroLabel}>Fats (11g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '35%', backgroundColor: '#ff9500' }]} /></View>

              <Text style={styles.macroLabel}>Protein (22g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '50%', backgroundColor: '#34c759' }]} /></View>

              <Text style={styles.macroLabel}>Fiber (9g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '75%', backgroundColor: '#4a90e2' }]} /></View>
            </View>
          </View>

          {/* Recipe 3 */}
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>Berry Protein Oats 🥣</Text>
            <Text style={styles.recipeKcal}>310 kcal</Text>
            
            <View style={styles.macroBarContainer}>
              <Text style={styles.macroLabel}>Fats (5g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '15%', backgroundColor: '#ff9500' }]} /></View>

              <Text style={styles.macroLabel}>Protein (18g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '40%', backgroundColor: '#34c759' }]} /></View>

              <Text style={styles.macroLabel}>Fiber (7g)</Text>
              <View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: '55%', backgroundColor: '#4a90e2' }]} /></View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Feature 3: Exercise Plan */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Exercise Program 🏃‍♂️</Text>
        <Text style={styles.sectionSub}>Follow these sets for core balance and muscle toning</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeWorkoutTab === 'yoga' && styles.activeTabButton]}
            onPress={() => setActiveWorkoutTab('yoga')}
          >
            <Text style={[styles.tabButtonText, activeWorkoutTab === 'yoga' && styles.activeTabButtonText]}>Yoga 🧘‍♀️</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeWorkoutTab === 'pilates' && styles.activeTabButton]}
            onPress={() => setActiveWorkoutTab('pilates')}
          >
            <Text style={[styles.tabButtonText, activeWorkoutTab === 'pilates' && styles.activeTabButtonText]}>Pilates 🤸‍♀️</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeWorkoutTab === 'strength' && styles.activeTabButton]}
            onPress={() => setActiveWorkoutTab('strength')}
          >
            <Text style={[styles.tabButtonText, activeWorkoutTab === 'strength' && styles.activeTabButtonText]}>Strength 🏋️‍♂️</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Contents */}
        <View style={styles.workoutSetContainer}>
          {activeWorkoutTab === 'yoga' && (
            <View>
              <Text style={styles.workoutSetHeader}>Yoga Set: Core Balance & Flex</Text>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>01</Text>
                <View>
                  <Text style={styles.workoutName}>Sun Salutation (Surya Namaskar)</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 5 Rounds | Control breathing and core alignment</Text>
                </View>
              </View>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>02</Text>
                <View>
                  <Text style={styles.workoutName}>Warrior II Hold</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 60 Sec Hold | Maintain deep leg lunging positions</Text>
                </View>
              </View>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>03</Text>
                <View>
                  <Text style={styles.workoutName}>Downward Dog to Cobra Flow</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 10 Reps | Transition smooth and stretch hamstrings</Text>
                </View>
              </View>
            </View>
          )}

          {activeWorkoutTab === 'pilates' && (
            <View>
              <Text style={styles.workoutSetHeader}>Pilates Set: Core Definition</Text>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>01</Text>
                <View>
                  <Text style={styles.workoutName}>The Hundred</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 100 Pumps | Deep abdominal control and pumping arms</Text>
                </View>
              </View>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>02</Text>
                <View>
                  <Text style={styles.workoutName}>Single Leg Stretch</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 15 Reps | Pull knee to chest, keep other leg extended</Text>
                </View>
              </View>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>03</Text>
                <View>
                  <Text style={styles.workoutName}>Double Leg Lower Lift</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 12 Reps | Lower legs slowly, keep lower back flat</Text>
                </View>
              </View>
            </View>
          )}

          {activeWorkoutTab === 'strength' && (
            <View>
              <Text style={styles.workoutSetHeader}>Strength Set: Body Sculpting</Text>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>01</Text>
                <View>
                  <Text style={styles.workoutName}>Dumbbell Squats</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 12 Reps | Deep squat, control descent, power up</Text>
                </View>
              </View>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>02</Text>
                <View>
                  <Text style={styles.workoutName}>Bench Press / Push-ups</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 10 Reps | Push from chest, target triceps & shoulders</Text>
                </View>
              </View>
              <View style={styles.workoutItem}>
                <Text style={styles.workoutNumber}>03</Text>
                <View>
                  <Text style={styles.workoutName}>Dumbbell Romanian Deadlifts</Text>
                  <Text style={styles.workoutDesc}>3 Sets × 12 Reps | Target hamstrings and glute engagements</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131419',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  profileBadge: {
    backgroundColor: '#1e2029',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  profileBadgeText: {
    color: '#4a90e2',
    fontSize: 12,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2c2e3a',
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 18,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#2c2e3a',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34c759',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#a0a5b5',
    marginTop: 4,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#131419',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressBarPercentage: {
    fontSize: 12,
    color: '#a0a5b5',
    textAlign: 'right',
  },
  section: {
    marginBottom: 26,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionSub: {
    fontSize: 12,
    color: '#a0a5b5',
    marginTop: 4,
    marginBottom: 14,
  },
  scannerContainer: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  scannerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#34c759',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewCard: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#131419',
    borderWidth: 1,
    borderColor: '#2c2e3a',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 20, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
  resultDetails: {
    padding: 16,
  },
  resultHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34c759',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
    marginBottom: 14,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  macroBox: {
    flex: 1,
    backgroundColor: '#1e2029',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  macroVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  macroKey: {
    fontSize: 10,
    color: '#a0a5b5',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recipeList: {
    paddingVertical: 4,
  },
  recipeCard: {
    width: 200,
    backgroundColor: '#1e2029',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  recipeKcal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34c759',
    marginTop: 6,
    marginBottom: 12,
  },
  macroBarContainer: {
    marginTop: 4,
  },
  macroLabel: {
    fontSize: 10,
    color: '#a0a5b5',
    marginBottom: 3,
    marginTop: 6,
  },
  macroBarBg: {
    height: 4,
    backgroundColor: '#131419',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e2029',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#34c759',
  },
  tabButtonText: {
    color: '#a0a5b5',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  workoutSetContainer: {
    backgroundColor: '#1e2029',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2c2e3a',
  },
  workoutSetHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 14,
  },
  workoutItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  workoutNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34c759',
    marginRight: 14,
    marginTop: 2,
  },
  workoutName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutDesc: {
    fontSize: 12,
    color: '#a0a5b5',
    marginTop: 3,
    lineHeight: 16,
  },
});

export default HomeScreen;
