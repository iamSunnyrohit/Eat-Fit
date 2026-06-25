import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface DashboardScreenProps {
  nickname: string;
  syncHealthDevices: boolean;
  consumedCalories: number;
  dailyCalorieTarget: number;
  activeCalories: number;
  steps: number;
  onEditProfilePress: () => void;
  onEnableSyncPress: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  nickname,
  syncHealthDevices,
  consumedCalories,
  dailyCalorieTarget,
  activeCalories,
  steps,
  onEditProfilePress,
  onEnableSyncPress,
}) => {
  const totalTarget = dailyCalorieTarget + (syncHealthDevices ? activeCalories : 0);
  
  const getCaloriePercentage = () => {
    const percentage = (consumedCalories / totalTarget) * 100;
    return Math.min(percentage, 100);
  };

  const pct = getCaloriePercentage();
  const dynamicBorders = {
    borderTopColor: pct >= 25 ? '#24C76D' : '#E5E7EB',
    borderRightColor: pct >= 50 ? '#24C76D' : '#E5E7EB',
    borderBottomColor: pct >= 75 ? '#24C76D' : '#E5E7EB',
    borderLeftColor: pct >= 95 ? '#24C76D' : '#E5E7EB',
  };

  return (
    <View style={styles.tabContentContainer}>
      {/* Top Bar matching screenshot */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>Eat & Fit</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.avatarImage}
          />
        </View>
      </View>

      {/* Welcome Title */}
      <View style={styles.welcomeSection}>
        <Text style={styles.progressSubtitle}>TODAY'S PROGRESS</Text>
        <Text style={styles.welcomeTitle}>Welcome back, {nickname}</Text>
      </View>

      {/* Main Goal Card with Circular Progress Ring */}
      <View style={styles.mainCard}>
        <Text style={styles.dailyGoalLabel}>Daily Goal</Text>
        <Text style={styles.dailyGoalValue}>
          <Text style={styles.greenText}>{consumedCalories.toLocaleString()}</Text>
          <Text style={styles.greyText}> / {dailyCalorieTarget.toLocaleString()} kcal</Text>
        </Text>
        <View style={styles.leftCaloriesBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.leftCaloriesText}>
            {Math.max(dailyCalorieTarget - consumedCalories + (syncHealthDevices ? activeCalories : 0), 0).toLocaleString()} kcal left
          </Text>
        </View>

        {/* Circular Progress Ring utilizing quadrants border color logic */}
        <View style={styles.ringOuter}>
          <View style={[styles.ringQuadrantBorder, dynamicBorders]}>
            <View style={styles.ringInner}>
              <Text style={styles.ringPercentage}>{Math.round(pct)}%</Text>
              <Text style={styles.ringSubLabel}>Consumed</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Secondary Metrics sub-cards */}
      <View style={styles.metricsRow}>
        {/* Active Calories Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E8FDF0' }]}>
              <Text style={styles.metricEmoji}>🏋️‍♂️</Text>
            </View>
            <Text style={styles.metricChangeText}>+12%</Text>
          </View>
          <Text style={styles.metricCardLabel}>Active Calories</Text>
          <Text style={styles.metricCardValue}>
            {activeCalories.toLocaleString()}{' '}
            <Text style={styles.metricUnitText}>kcal</Text>
          </Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFillGreen, { width: `${Math.min((activeCalories / 1000) * 100, 100)}%` }]} />
          </View>
        </View>

        {/* Workout Duration Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
              <Text style={styles.metricEmoji}>⏱️</Text>
            </View>
            <Text style={[styles.metricChangeText, { color: '#9CA3AF' }]}>Daily</Text>
          </View>
          <Text style={styles.metricCardLabel}>Workout Duration</Text>
          <Text style={styles.metricCardValue}>
            {Math.round(activeCalories / 15 + 20)}{' '}
            <Text style={styles.metricUnitText}>min</Text>
          </Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFillBlue, { width: '65%' }]} />
          </View>
        </View>
      </View>

      {/* Today's Nutrition Section */}
      <View style={styles.nutritionCard}>
        <View style={styles.nutritionHeader}>
          <View style={styles.nutritionTitleGroup}>
            <Text style={styles.nutritionForkKnife}>🥗</Text>
            <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
          </View>
          <TouchableOpacity onPress={onEditProfilePress}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Macros Bar charts */}
        <View style={styles.nutritionBarsContainer}>
          {/* Protein bar */}
          <View style={styles.nutritionBarColumn}>
            <View style={styles.barOuterTrack}>
              <View style={[styles.barFillGreen, { height: '55%' }]} />
            </View>
            <Text style={styles.macroLabel}>PROTEIN</Text>
            <Text style={styles.macroValue}>142g</Text>
            <View style={styles.macroIndicatorLineGreen} />
          </View>

          {/* Carbs bar */}
          <View style={styles.nutritionBarColumn}>
            <View style={styles.barOuterTrack}>
              <View style={[styles.barFillBlue, { height: '80%' }]} />
            </View>
            <Text style={styles.macroLabel}>CARBS</Text>
            <Text style={styles.macroValue}>265g</Text>
            <View style={styles.macroIndicatorLineBlue} />
          </View>

          {/* Fat bar */}
          <View style={styles.nutritionBarColumn}>
            <View style={styles.barOuterTrack}>
              <View style={[styles.barFillRed, { height: '40%' }]} />
            </View>
            <Text style={styles.macroLabel}>FAT</Text>
            <Text style={styles.macroValue}>58g</Text>
            <View style={styles.macroIndicatorLineRed} />
          </View>
        </View>
      </View>

      {/* Recent Activity List */}
      <View style={styles.recentActivitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>RECENT ACTIVITY</Text>
          <TouchableOpacity onPress={onEnableSyncPress}>
            <Text style={styles.moreIcon}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Morning Run */}
        <View style={styles.activityRow}>
          <View style={[styles.activityIconBadge, { backgroundColor: '#E8FDF0' }]}>
            <Text style={styles.activityBadgeText}>🏃‍♂️</Text>
          </View>
          <View style={styles.activityMeta}>
            <Text style={styles.activityName}>Morning Run</Text>
            <Text style={styles.activityTime}>Today, 7:15 AM</Text>
          </View>
          <View style={styles.activityMetricsRight}>
            <Text style={styles.activityCalBurn}>420 kcal</Text>
            <Text style={[styles.activitySubText, { color: '#24C76D' }]}>5.2 km</Text>
          </View>
        </View>

        {/* Healthy Bowl */}
        <View style={styles.activityRow}>
          <View style={[styles.activityIconBadge, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.activityBadgeText}>🍔</Text>
          </View>
          <View style={styles.activityMeta}>
            <Text style={styles.activityName}>Healthy Bowl</Text>
            <Text style={styles.activityTime}>Today, 1:30 PM</Text>
          </View>
          <View style={styles.activityMetricsRight}>
            <Text style={styles.activityCalBurn}>640 kcal</Text>
            <Text style={[styles.activitySubText, { color: '#3B82F6' }]}>High Protein</Text>
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
  refreshEmoji: {
    fontSize: 16,
  },
  welcomeSection: {
    marginVertical: 18,
  },
  progressSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 6,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  dailyGoalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  dailyGoalValue: {
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
  leftCaloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#24C76D',
    marginRight: 6,
  },
  leftCaloriesText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: 'bold',
  },
  ringOuter: {
    width: 146,
    height: 146,
    borderRadius: 73,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  ringQuadrantBorder: {
    width: 146,
    height: 146,
    borderRadius: 73,
    borderWidth: 10,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentage: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  ringSubLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
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
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricEmoji: {
    fontSize: 18,
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  metricCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  metricCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 6,
    marginBottom: 12,
  },
  metricUnitText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 'normal',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFillGreen: {
    height: '100%',
    backgroundColor: '#24C76D',
    borderRadius: 3,
  },
  progressBarFillBlue: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  nutritionCard: {
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
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nutritionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionForkKnife: {
    fontSize: 18,
  },
  nutritionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#24C76D',
    fontWeight: 'bold',
  },
  nutritionBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  nutritionBarColumn: {
    alignItems: 'center',
    width: 80,
  },
  barOuterTrack: {
    width: 48,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  barFillGreen: {
    width: '100%',
    backgroundColor: '#24C76D',
    borderRadius: 8,
  },
  barFillBlue: {
    width: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  barFillRed: {
    width: '100%',
    backgroundColor: '#FF6E5B',
    borderRadius: 8,
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  macroIndicatorLineGreen: {
    width: 32,
    height: 3,
    backgroundColor: '#24C76D',
    borderRadius: 1.5,
    marginTop: 6,
  },
  macroIndicatorLineBlue: {
    width: 32,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 1.5,
    marginTop: 6,
  },
  macroIndicatorLineRed: {
    width: 32,
    height: 3,
    backgroundColor: '#FF6E5B',
    borderRadius: 1.5,
    marginTop: 6,
  },
  recentActivitySection: {
    marginBottom: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  moreIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  activityRow: {
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
  activityIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBadgeText: {
    fontSize: 20,
  },
  activityMeta: {
    flex: 1,
    marginLeft: 14,
  },
  activityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },
  activityMetricsRight: {
    alignItems: 'flex-end',
  },
  activityCalBurn: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  activitySubText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 3,
  },
});

export default DashboardScreen;
