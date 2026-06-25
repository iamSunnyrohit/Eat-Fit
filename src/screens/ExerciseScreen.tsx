import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ExerciseScreen: React.FC = () => {
  const [activeWorkoutTab, setActiveWorkoutTab] = useState<'yoga' | 'pilates' | 'strength'>('yoga');

  return (
    <View style={styles.tabContentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Exercise Program 🏃‍♂️</Text>
          <Text style={styles.subtitle}>Follow these sets for core balance and muscle toning</Text>
        </View>
      </View>

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
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>Sun Salutation (Surya Namaskar)</Text>
                <Text style={styles.workoutDesc}>3 Sets × 5 Rounds | Control breathing and core alignment</Text>
              </View>
            </View>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutNumber}>02</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>Warrior II Hold</Text>
                <Text style={styles.workoutDesc}>3 Sets × 60 Sec Hold | Maintain deep leg lunging positions</Text>
              </View>
            </View>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutNumber}>03</Text>
              <View style={{ flex: 1 }}>
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
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>The Hundred</Text>
                <Text style={styles.workoutDesc}>3 Sets × 100 Pumps | Deep abdominal control and pumping arms</Text>
              </View>
            </View>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutNumber}>02</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>Single Leg Stretch</Text>
                <Text style={styles.workoutDesc}>3 Sets × 15 Reps | Pull knee to chest, keep other leg extended</Text>
              </View>
            </View>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutNumber}>03</Text>
              <View style={{ flex: 1 }}>
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
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>Dumbbell Squats</Text>
                <Text style={styles.workoutDesc}>3 Sets × 12 Reps | Deep squat, control descent, power up</Text>
              </View>
            </View>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutNumber}>02</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>Bench Press / Push-ups</Text>
                <Text style={styles.workoutDesc}>3 Sets × 10 Reps | Push from chest, target triceps & shoulders</Text>
              </View>
            </View>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutNumber}>03</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>Dumbbell Romanian Deadlifts</Text>
                <Text style={styles.workoutDesc}>3 Sets × 12 Reps | Target hamstrings and glute engagements</Text>
              </View>
            </View>
          </View>
        )}
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

export default ExerciseScreen;
