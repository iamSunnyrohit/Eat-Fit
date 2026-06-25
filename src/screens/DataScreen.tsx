import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface DataScreenProps {
  steps: number;
  activeCalories: number;
  consumedCalories: number;
  setConsumedCalories: React.Dispatch<React.SetStateAction<number>>;
}

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

const DataScreen: React.FC<DataScreenProps> = ({
  steps,
  activeCalories,
  consumedCalories,
  setConsumedCalories,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  // Helper to handle camera/library selection and simulate AI scanner
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

  return (
    <View style={styles.tabContentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>AI Scanner & Logging 📷</Text>
          <Text style={styles.subtitle}>Log nutrients using your camera or track hydration</Text>
        </View>
      </View>

      {/* Scanner content */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerButtons}>
          <TouchableOpacity style={styles.scanButton} onPress={() => handleImageSource(true)}>
            <Text style={styles.scanButtonText}>Take Photo 📷</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: '#1e2029', borderColor: '#2c2e3a' }]} 
            onPress={() => handleImageSource(false)}
          >
            <Text style={[styles.scanButtonText, { color: '#ffffff' }]}>Upload Image 🖼️</Text>
          </TouchableOpacity>
        </View>

        {scannedImage && (
          <View style={styles.previewCard}>
            <Image source={{ uri: scannedImage }} style={styles.previewImage} resizeMode="cover" />

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

      {/* Steps & Energy Burn Overview section in Data */}
      <View style={[styles.progressCard, { marginTop: 24 }]}>
        <Text style={styles.progressTitle}>Today's Activity Log</Text>
        <View style={styles.activityStatsRow}>
          <View style={styles.activityStatItem}>
            <Text style={styles.activityStatNum}>{steps.toLocaleString()}</Text>
            <Text style={styles.activityStatLabel}>Total Steps Walked</Text>
          </View>
          <View style={styles.activityStatItem}>
            <Text style={styles.activityStatNum}>{activeCalories} kcal</Text>
            <Text style={styles.activityStatLabel}>Watch Calories Burned</Text>
          </View>
        </View>
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
  scannerContainer: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 20,
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
    height: 300,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
  progressCard: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 24,
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
  activityStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  activityStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityStatNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34c759',
  },
  activityStatLabel: {
    fontSize: 11,
    color: '#a0a5b5',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default DataScreen;
