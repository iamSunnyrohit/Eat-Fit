import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

interface MealPlanScreenProps {
  consumedCalories: number;
  dailyCalorieTarget: number;
  setConsumedCalories: React.Dispatch<React.SetStateAction<number>>;
}

const FOOD_SCANNER_DATABASE = [
  { name: 'Keto Baked Salmon 🥩', calories: 580, protein: 42, fats: 28, carbs: 4 },
  { name: 'Avocado Toast with Egg 🥑🍳', calories: 340, protein: 14, fats: 18, carbs: 24 },
  { name: 'Quinoa Protein Bowl 🍗🥗', calories: 520, protein: 38, fats: 12, carbs: 45 },
  { name: 'Mixed Berry Oats 🥣🍓', calories: 280, protein: 8, fats: 4, carbs: 54 },
];

const MealPlanScreen: React.FC<MealPlanScreenProps> = ({
  consumedCalories,
  dailyCalorieTarget,
  setConsumedCalories,
}) => {
  const { isDarkMode } = useTheme();
  const theme = {
    bg: isDarkMode ? '#131315' : '#F8F9FA',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    border: isDarkMode ? '#2A2A2C' : '#E5E7EB',
    inputBg: isDarkMode ? '#2A2A2C' : '#FFFFFF',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      scanAnim.setValue(0);
    }
  }, [scanning, scanAnim]);

  const scannerTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 177], // scannerPreviewImage height (180) minus scanLine height (3)
  });

  const [loggedMeals, setLoggedMeals] = useState([
    {
      id: '1',
      name: 'Morning Protein Bowl',
      time: 'Breakfast • 07:45 AM',
      calories: 420,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      time: 'Lunch • 12:30 PM',
      calories: 580,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: '3',
      name: 'Whey Isolate Shake',
      time: 'Post-Workout • 04:15 PM',
      calories: 210,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: '4',
      name: 'Roasted Salmon & Asparagus',
      time: 'Dinner • 07:30 PM',
      calories: 630,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=100&q=80',
    },
  ]);

  const remainingCalories = Math.max(dailyCalorieTarget - consumedCalories, 0);
  const pct = Math.min((consumedCalories / dailyCalorieTarget) * 100, 100);

  const handleImageSource = async (useCamera = false) => {
    let result;
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

        setTimeout(() => {
          setScanning(false);
          const randomFood = FOOD_SCANNER_DATABASE[Math.floor(Math.random() * FOOD_SCANNER_DATABASE.length)];
          setScanResult(randomFood);
        }, 2000);
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Scan Error', 'Unable to access photos/camera. Please try again.');
    }
  };

  const addScannedMeal = () => {
    if (scanResult) {
      setConsumedCalories(prev => prev + scanResult.calories);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMeal = {
        id: Math.random().toString(),
        name: scanResult.name,
        time: `Logged • Today, ${timestamp}`,
        calories: scanResult.calories,
        image: scannedImage || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=100&q=80',
      };

      setLoggedMeals(prev => [newMeal, ...prev]);
      Alert.alert('Logged! 🍏', `${scanResult.name} (${scanResult.calories} kcal) added to your nutrition schedule.`);

      setScannedImage(null);
      setScanResult(null);
    }
  };

  const handleQuickLog = () => {
    const snackCalories = 180;
    setConsumedCalories(prev => prev + snackCalories);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const quickMeal = {
      id: Math.random().toString(),
      name: 'Mixed Berries & Walnuts 🍓🌰',
      time: `Logged • Today, ${timestamp}`,
      calories: snackCalories,
      image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=100&q=80',
    };

    setLoggedMeals(prev => [quickMeal, ...prev]);
    Alert.alert('Logged! 🍇', `Mixed Berries & Walnuts (${snackCalories} kcal) added.`);
  };

  const filteredMeals = loggedMeals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.tabContentContainer, { backgroundColor: theme.bg }]}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Eat & Fit</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.avatarImage}
          />
        </View>
      </View>

      <View style={[styles.recipeIdeasCard, { backgroundColor: theme.card }]}>
        <Text style={styles.recipeHeader}>RECIPE IDEAS</Text>
        <Text style={[styles.recipeSubtitle, { color: theme.text }]}>Find healthy meal inspirations</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.border, borderWidth: isDarkMode ? 1 : 0 }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search recipes..."
            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
        <Text style={styles.balanceHeader}>ENERGY BALANCE</Text>
        <Text style={styles.balanceValue}>
          <Text style={styles.greenText}>{consumedCalories.toLocaleString()}</Text>
          <Text style={[styles.greyText, { color: theme.text }]}> / {dailyCalorieTarget.toLocaleString()} kcal</Text>
        </Text>
        <View style={[styles.balanceBarTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
          <View style={[styles.balanceBarFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.balanceFooter}>
          <Text style={[styles.footerText, { color: theme.subText }]}>{Math.round(pct)}% of daily goal</Text>
          <Text style={[styles.footerText, { color: theme.subText }]}>{remainingCalories.toLocaleString()} kcal remaining</Text>
        </View>
      </View>

      <View style={[styles.macrosCard, { backgroundColor: theme.card }]}>
        <Text style={styles.macrosHeader}>MACROS</Text>

        <View style={styles.macroItemRow}>
          <View style={styles.macroLabelGroup}>
            <Text style={[styles.macroLabel, { color: '#24C76D' }]}>Protein</Text>
            <Text style={[styles.macroValueText, { color: theme.text }]}>142g / 180g</Text>
          </View>
          <View style={[styles.macroTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <View style={[styles.macroFillGreen, { width: '78%' }]} />
          </View>
        </View>

        <View style={styles.macroItemRow}>
          <View style={styles.macroLabelGroup}>
            <Text style={[styles.macroLabel, { color: '#3B82F6' }]}>Carbs</Text>
            <Text style={[styles.macroValueText, { color: theme.text }]}>165g / 250g</Text>
          </View>
          <View style={[styles.macroTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <View style={[styles.macroFillBlue, { width: '66%' }]} />
          </View>
        </View>

        <View style={styles.macroItemRow}>
          <View style={styles.macroLabelGroup}>
            <Text style={[styles.macroLabel, { color: '#FF6E5B' }]}>Fat</Text>
            <Text style={[styles.macroValueText, { color: theme.text }]}>48g / 65g</Text>
          </View>
          <View style={[styles.macroTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
            <View style={[styles.macroFillRed, { width: '73%' }]} />
          </View>
        </View>
      </View>

      <View style={[styles.scannerDashedBox, { backgroundColor: isDarkMode ? '#1C1C1E' : '#F8FBF9', borderColor: '#24C76D' }]}>
        <View style={styles.cameraIconBadge}>
          <Text style={styles.cameraEmoji}>📷</Text>
        </View>
        <Text style={[styles.scannerTitle, { color: theme.text }]}>AI Calorie Scanner</Text>
        <Text style={[styles.scannerSubtitle, { color: theme.subText }]}>
          Upload a photo of your meal to calculate calories instantly
        </Text>

        {!scannedImage && (
          <View style={styles.scanActions}>
            <TouchableOpacity style={styles.uploadBtn} onPress={() => handleImageSource(false)}>
              <Text style={styles.uploadBtnText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadBtn, styles.cameraBtn, { backgroundColor: theme.card, borderColor: '#24C76D' }]} onPress={() => handleImageSource(true)}>
              <Text style={[styles.uploadBtnText, { color: '#24C76D' }]}>Use Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {scannedImage && (
          <View style={[styles.scannerPreviewPanel, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.scannerPreviewImageContainer}>
              <Image source={{ uri: scannedImage }} style={styles.scannerPreviewImage} />
              {scanning && (
                <Animated.View style={[styles.scanLine, { transform: [{ translateY: scannerTranslateY }] }]} />
              )}
            </View>
            {scanning && (
              <View style={[styles.scannerOverlay, { backgroundColor: isDarkMode ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <ActivityIndicator size="small" color="#24C76D" />
                <Text style={[styles.scannerOverlayText, { color: theme.text }]}>Identifying ingredients...</Text>
              </View>
            )}

            {scanResult && (
              <View style={styles.scannerResultBox}>
                <Text style={styles.identifiedTitle}>Identified Food Item:</Text>
                <Text style={[styles.identifiedName, { color: theme.text }]}>{scanResult.name}</Text>
                <Text style={styles.identifiedCalories}>{scanResult.calories} kcal</Text>
                <TouchableOpacity style={styles.addScannedBtn} onPress={addScannedMeal}>
                  <Text style={styles.addScannedBtnText}>Add to Today's Meals ＋</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.mealsSection}>
        <View style={styles.mealsSectionHeader}>
          <Text style={[styles.mealsSectionTitle, { color: theme.text }]}>Today's Meals</Text>
          <View style={[styles.entriesBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.entriesBadgeText, { color: theme.subText }]}>{loggedMeals.length} entries</Text>
          </View>
        </View>

        {filteredMeals.map((meal) => (
          <View key={meal.id} style={[styles.mealRowCard, { backgroundColor: theme.card }]}>
            <Image source={{ uri: meal.image }} style={styles.mealThumb} />
            <View style={styles.mealMeta}>
              <Text style={[styles.mealName, { color: theme.text }]}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.time}</Text>
            </View>
            <View style={styles.mealCalRight}>
              <Text style={styles.mealCalVal}>{meal.calories}</Text>
              <Text style={styles.mealCalText}>KCAL</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.floatingActionButton} onPress={handleQuickLog}>
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabText}>Log Meal</Text>
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
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#24C76D',
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
  refreshEmoji: {
    fontSize: 16,
  },
  recipeIdeasCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
    elevation: 3,
    marginBottom: 20,
    marginTop: 10,
  },
  recipeHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  recipeSubtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
    elevation: 3,
    marginBottom: 20,
  },
  balanceHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  greenText: {
    color: '#24C76D',
  },
  greyText: {
    color: '#111827',
  },
  balanceBarTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  balanceBarFill: {
    height: '100%',
    backgroundColor: '#24C76D',
    borderRadius: 4,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  macrosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
    elevation: 3,
    marginBottom: 20,
  },
  macrosHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  macroItemRow: {
    marginBottom: 14,
  },
  macroLabelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroValueText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: 'bold',
  },
  macroTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroFillGreen: {
    height: '100%',
    backgroundColor: '#24C76D',
    borderRadius: 3,
  },
  macroFillBlue: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  macroFillRed: {
    height: '100%',
    backgroundColor: '#FF6E5B',
    borderRadius: 3,
  },
  scannerDashedBox: {
    borderWidth: 1.5,
    borderColor: '#24C76D',
    borderStyle: 'dashed',
    borderRadius: 20,
    backgroundColor: '#F8FBF9',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cameraIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(36, 199, 109, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cameraEmoji: {
    fontSize: 22,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scannerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  scanActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  uploadBtn: {
    backgroundColor: '#24C76D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  cameraBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#24C76D',
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scannerPreviewPanel: {
    width: '100%',
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scannerPreviewImage: {
    width: '100%',
    height: 180,
  },
  scannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerOverlayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  scannerResultBox: {
    padding: 14,
    alignItems: 'center',
  },
  identifiedTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#24C76D',
    textTransform: 'uppercase',
  },
  identifiedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
  },
  identifiedCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24C76D',
    marginVertical: 4,
  },
  addScannedBtn: {
    backgroundColor: '#24C76D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 6,
  },
  addScannedBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mealsSection: {
    marginBottom: 20,
  },
  mealsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  mealsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  entriesBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  entriesBadgeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  mealRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  mealThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  mealMeta: {
    flex: 1,
    marginLeft: 14,
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  mealTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  mealCalRight: {
    alignItems: 'flex-end',
  },
  mealCalVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  mealCalText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#24C76D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    boxShadow: '0px 6px 10px rgba(36, 199, 109, 0.2)',
    elevation: 6,
    zIndex: 100,
  },
  fabIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fabText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  scannerPreviewImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#24C76D',
    boxShadow: '0px 0px 5px rgba(36, 199, 109, 0.8)',
  },
});

export default MealPlanScreen;
