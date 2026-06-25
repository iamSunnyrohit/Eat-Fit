import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface DataScreenProps {
  steps: number;
  activeCalories: number;
  consumedCalories: number;
  setConsumedCalories: React.Dispatch<React.SetStateAction<number>>;
}

const DataScreen: React.FC<DataScreenProps> = ({
  steps,
  activeCalories,
  consumedCalories,
  setConsumedCalories,
}) => {
  // Navigation active tab: 'calories' | 'minutes'
  const [activityMode, setActivityMode] = useState<'calories' | 'minutes'>('calories');

  // Chart width state dynamically calculated via onLayout
  const [chartWidth, setChartWidth] = useState(300);

  // Dynamic values depending on activityMode and native HealthKit activeCalories sync
  const dataValues = activityMode === 'calories'
    ? [180, 290, 260, activeCalories > 0 ? activeCalories : 642, 530, 220, 580]
    : [25, 45, 35, activeCalories > 0 ? Math.round(activeCalories / 7.1) : 90, 75, 30, 80];

  // Map vector line chart coordinates
  const chartHeight = 120;
  const chartBottomPadding = 20;
  const chartPadding = 16;
  const minVal = 0;
  const maxVal = Math.max(...dataValues) * 1.15; // 15% top padding headroom
  const availableWidth = chartWidth - chartPadding * 2;

  const points = dataValues.map((val, idx) => {
    const x = chartPadding + (availableWidth / 6) * idx;
    const y = chartHeight - ((val - minVal) / (maxVal - minVal)) * (chartHeight - chartBottomPadding);
    return { x, y, val };
  });

  // Calculate dynamic vector segments center-to-center
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const cx = (p1.x + p2.x) / 2 - distance / 2;
    const cy = (p1.y + p2.y) / 2 - 3.5 / 2; // Thickness correction

    segments.push(
      <View
        key={`seg-${i}`}
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          width: distance,
          height: 3.5,
          backgroundColor: '#24C76D',
          borderRadius: 2,
          transform: [{ rotate: `${angle}rad` }],
        }}
      />
    );
  }

  const peakPoint = points[3];
  const tooltipText = activityMode === 'calories'
    ? `${Math.round(peakPoint.val)} kcal`
    : `${Math.round(peakPoint.val)} min`;

  return (
    <View style={styles.tabContentContainer}>
      {/* Top Bar matching design */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>Eat & Fit</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.avatarImage}
          />
        </View>
      </View>

      {/* Title section */}
      <View style={styles.titleSection}>
        <Text style={styles.weeklyProgressTitle}>Weekly Progress</Text>
        <View style={styles.weekTagContainer}>
          <Text style={styles.weekTagText}>WEEK 42</Text>
        </View>
      </View>

      {/* Calories / Minutes toggle selector pill */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, activityMode === 'calories' && styles.toggleButtonActive]}
          onPress={() => setActivityMode('calories')}
        >
          <Text style={[styles.toggleText, activityMode === 'calories' && styles.toggleTextActive]}>
            Calories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, activityMode === 'minutes' && styles.toggleButtonActive]}
          onPress={() => setActivityMode('minutes')}
        >
          <Text style={[styles.toggleText, activityMode === 'minutes' && styles.toggleTextActive]}>
            Minutes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Dotted Grid Line Graph Card */}
      <View style={styles.chartCard}>
        <View 
          style={styles.chartArea}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
        >
          {/* Horizontal dotted grid tracks */}
          <View style={[styles.gridTrack, { top: 20 }]} />
          <View style={[styles.gridTrack, { top: 70 }]} />
          <View style={[styles.gridTrack, { top: 120 }]} />

          {/* Render connecting line segments */}
          {chartWidth > 0 && segments}

          {/* Render vertex dots */}
          {chartWidth > 0 && points.map((p, idx) => {
            const isPeak = idx === 3;
            return (
              <View
                key={`dot-${idx}`}
                style={{
                  position: 'absolute',
                  left: p.x - (isPeak ? 6 : 4),
                  top: p.y - (isPeak ? 6 : 4),
                  width: isPeak ? 12 : 8,
                  height: isPeak ? 12 : 8,
                  borderRadius: isPeak ? 6 : 4,
                  backgroundColor: isPeak ? '#FFFFFF' : '#24C76D',
                  borderWidth: isPeak ? 3 : 0,
                  borderColor: '#24C76D',
                  zIndex: 10,
                }}
              />
            );
          })}

          {/* Highlighted Tooltip over peak */}
          {chartWidth > 0 && (
            <View
              style={{
                position: 'absolute',
                left: peakPoint.x - 45,
                top: peakPoint.y - 42,
                width: 90,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: '#24C76D',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
                zIndex: 20,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#24C76D' }}>
                {tooltipText}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Weekdays Axis */}
        <View style={styles.daysLabelsRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Text key={day} style={styles.dayLabelText}>{day}</Text>
          ))}
        </View>
      </View>

      {/* Summary metrics dual-column progress rows */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg Daily Burn</Text>
          <Text style={styles.metricValue}>
            {activityMode === 'calories' ? '542 kcal' : '46 min'}
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFillGreen, { width: '75%' }]} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Training</Text>
          <Text style={[styles.metricValue, { color: '#3B82F6' }]}>
            {activityMode === 'calories' ? '324 min' : '210 min'}
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFillBlue, { width: '60%' }]} />
          </View>
        </View>
      </View>

      {/* Recent Activity logs */}
      <View style={styles.recentLogsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Log item 1 */}
        <View style={styles.logCard}>
          <View style={[styles.logIconWrapper, { backgroundColor: '#E8FDF0' }]}>
            <Text style={styles.logEmoji}>🏋️‍♂️</Text>
          </View>
          <View style={styles.logDetails}>
            <Text style={styles.logTitle}>Functional Training</Text>
            <Text style={styles.logSubtitle}>45 min • Today, 08:30 AM</Text>
          </View>
          <View style={styles.logRight}>
            <Text style={styles.logMetricValue}>480 kcal</Text>
            <Text style={styles.logSubIcon}>⌚</Text>
          </View>
        </View>

        {/* Log item 2 */}
        <View style={styles.logCard}>
          <View style={[styles.logIconWrapper, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.logEmoji}>🏃‍♂️</Text>
          </View>
          <View style={styles.logDetails}>
            <Text style={styles.logTitle}>Morning Trail Run</Text>
            <Text style={styles.logSubtitle}>32 min • Yesterday</Text>
          </View>
          <View style={styles.logRight}>
            <Text style={styles.logMetricValue}>320 kcal</Text>
            <Text style={styles.logSubIcon}>❤️</Text>
          </View>
        </View>

        {/* Log item 3 */}
        <View style={styles.logCard}>
          <View style={[styles.logIconWrapper, { backgroundColor: '#FFEBE8' }]}>
            <Text style={styles.logEmoji}>🥗</Text>
          </View>
          <View style={styles.logDetails}>
            <Text style={styles.logTitle}>Active Recovery</Text>
            <Text style={styles.logSubtitle}>20 min • Oct 21</Text>
          </View>
          <View style={styles.logRight}>
            <Text style={styles.logMetricValue}>120 kcal</Text>
            <Text style={styles.logSubIcon}>🔁</Text>
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
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  weeklyProgressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  weekTagContainer: {
    backgroundColor: 'rgba(36, 199, 109, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  weekTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#24C76D',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#24C76D',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  chartCard: {
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
  chartArea: {
    height: 140,
    position: 'relative',
  },
  gridTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  daysLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 14,
  },
  dayLabelText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    width: 32,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#24C76D',
    marginTop: 8,
    marginBottom: 12,
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
  recentLogsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24C76D',
  },
  logCard: {
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
  logIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logEmoji: {
    fontSize: 20,
  },
  logDetails: {
    flex: 1,
    marginLeft: 14,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  logSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
  logRight: {
    alignItems: 'flex-end',
  },
  logMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  logSubIcon: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default DataScreen;
