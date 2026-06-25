import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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

  return (
    <View style={styles.tabContentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {nickname}! 👋</Text>
          <Text style={styles.subtitle}>
            {syncHealthDevices ? '⌚ Apple Watch Connected' : '⌚ Device Sync Disabled'}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileBadge} onPress={onEditProfilePress}>
          <Text style={styles.profileBadgeText}>Edit Profile</Text>
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
              {Math.max(dailyCalorieTarget - consumedCalories + (syncHealthDevices ? activeCalories : 0), 0)}
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
                backgroundColor: consumedCalories > totalTarget ? '#ff3b30' : '#34c759'
              }
            ]}
          />
        </View>
        <Text style={styles.progressBarPercentage}>{Math.round(getCaloriePercentage())}% budget consumed</Text>
      </View>

      {/* Apple Watch Integration Section */}
      {syncHealthDevices ? (
        <View style={styles.watchSyncCard}>
          <View style={styles.watchSyncHeader}>
            <Text style={styles.watchSyncTitle}>⌚ Apple Watch Sync Active</Text>
            <View style={styles.watchStatusBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.watchStatusText}>Live</Text>
            </View>
          </View>
          
          <View style={styles.watchMetricsRow}>
            {/* Steps metric */}
            <View style={styles.watchMetricBox}>
              <Text style={styles.watchEmoji}>👣</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.watchMetricValue} numberOfLines={1}>{steps.toLocaleString()}</Text>
                <Text style={styles.watchMetricLabel}>Steps Today</Text>
              </View>
            </View>

            {/* Active Calories metric */}
            <View style={styles.watchMetricBox}>
              <Text style={styles.watchEmoji}>🔥</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.watchMetricValue} numberOfLines={1}>+{activeCalories} kcal</Text>
                <Text style={styles.watchMetricLabel}>Active Burned</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.watchSyncOfflineCard}>
          <View style={styles.watchSyncHeader}>
            <Text style={styles.watchSyncTitleOffline}>⌚ Apple Watch Not Synced</Text>
            <TouchableOpacity style={styles.connectWatchButton} onPress={onEnableSyncPress}>
              <Text style={styles.connectWatchButtonText}>Enable Sync</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.watchSyncOfflineDesc}>
            Enable Device Sync in profile settings to dynamically import steps and active calories from your Apple Watch.
          </Text>
        </View>
      )}

      {/* Simple Dashboard Overview Stats */}
      <View style={styles.dashboardStatsGrid}>
        <View style={styles.statMiniCard}>
          <Text style={styles.statMiniTitle}>Active Focus</Text>
          <Text style={styles.statMiniValue}>Fat Burn</Text>
        </View>
        <View style={styles.statMiniCard}>
          <Text style={styles.statMiniTitle}>Consistency</Text>
          <Text style={[styles.statMiniValue, { color: '#34c759' }]}>94% 🔥</Text>
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
  watchSyncCard: {
    backgroundColor: 'rgba(30, 32, 41, 0.75)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.25)',
    marginBottom: 24,
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  watchSyncOfflineCard: {
    backgroundColor: '#1e2029',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2c2e3a',
    marginBottom: 24,
  },
  watchSyncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  watchSyncTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34c759',
  },
  watchSyncTitleOffline: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#a0a5b5',
  },
  watchStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34c759',
    marginRight: 6,
  },
  watchStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#34c759',
    textTransform: 'uppercase',
  },
  watchMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  watchMetricBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 20, 25, 0.6)',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(44, 46, 58, 0.5)',
  },
  watchEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  watchMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  watchMetricLabel: {
    fontSize: 10,
    color: '#a0a5b5',
    marginTop: 2,
  },
  watchSyncOfflineDesc: {
    fontSize: 12,
    color: '#6c7281',
    lineHeight: 18,
  },
  connectWatchButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  connectWatchButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  dashboardStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: '#1e2029',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#2c2e3a',
    alignItems: 'center',
  },
  statMiniTitle: {
    fontSize: 10,
    color: '#a0a5b5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statMiniValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 6,
  },
});

export default DashboardScreen;
