import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.appTitle}>EAT AND FIT 🏃‍♂️</Text>
        <Text style={styles.tagline}>Track Smarter, Not Harder</Text>
        <Text style={styles.description}>
          A unified, cross-platform fitness hub designed to eliminate manual data entry by synchronizing seamlessly with your device's native health environment.
        </Text>
      </View>

      {/* Core Use Cases Definition */}
      <View style={styles.useCaseContainer}>
        <Text style={styles.sectionHeader}>Why Eat and Fit?</Text>
        
        <View style={styles.useCaseCard}>
          <Text style={styles.useCaseEmoji}>🔄</Text>
          <View style={styles.useCaseTextContent}>
            <Text style={styles.useCaseTitle}>Zero Manual Entry</Text>
            <Text style={styles.useCaseDesc}>
              Bridges directly with Apple HealthKit and Android Health Connect to import workouts and metrics in the background.
            </Text>
          </View>
        </View>

        <View style={styles.useCaseCard}>
          <Text style={styles.useCaseEmoji}>📈</Text>
          <View style={styles.useCaseTextContent}>
            <Text style={styles.useCaseTitle}>Actionable Analytics</Text>
            <Text style={styles.useCaseDesc}>
              Transforms raw biometric data points into interactive trend lines mapping long-term workout consistency.
            </Text>
          </View>
        </View>

        <View style={styles.useCaseCard}>
          <Text style={styles.useCaseEmoji}>🎯</Text>
          <View style={styles.useCaseTextContent}>
            <Text style={styles.useCaseTitle}>Caloric Alignment</Text>
            <Text style={styles.useCaseDesc}>
              Automatically tracks your net daily energy balance against custom macro and target goals.
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Onboarding Trigger */}
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={() => navigation.navigate('HomeSetup')} // Navigates to the Profile Setup Screen
      >
        <Text style={styles.ctaButtonText}>GET STARTED 🚀</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131419',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#4a90e2',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#a0a5b5',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  useCaseContainer: {
    width: '100%',
    marginVertical: 30,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  useCaseCard: {
    flexDirection: 'row',
    backgroundColor: '#1e2029',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  useCaseEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  useCaseTextContent: {
    flex: 1,
  },
  useCaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  useCaseDesc: {
    fontSize: 12,
    color: '#a0a5b5',
    marginTop: 4,
    lineHeight: 16,
  },
  ctaButton: {
    backgroundColor: '#34c759', // Green accent button
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default LandingScreen;
