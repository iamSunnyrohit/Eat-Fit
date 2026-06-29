import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ExerciseScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const theme = {
    bg: isDarkMode ? '#131315' : '#F8F9FA',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    border: isDarkMode ? '#2A2A2C' : '#E5E7EB',
    inputBg: isDarkMode ? '#2A2A2C' : '#FFFFFF',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'yoga' | 'pilates' | 'strength'>('all');

  const workouts = [
    {
      id: '1',
      title: 'Vinyasa Core Power',
      tag: 'Intermediate',
      duration: '45 min',
      calories: '320 kcal',
      category: 'yoga',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: '2',
      title: 'HIIT Metabolic Burn',
      tag: 'Advanced',
      duration: '30 min',
      calories: '450 kcal',
      category: 'pilates',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: '3',
      title: 'Foundation Strength',
      tag: 'Beginner',
      duration: '50 min',
      calories: '210 kcal',
      category: 'strength',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=500&q=80',
    },
  ];

  // Filtering logic
  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || w.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.tabContentContainer, { backgroundColor: theme.bg }]}>
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

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.inputBg, borderColor: theme.border, borderWidth: isDarkMode ? 1 : 0 }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search exercises, muscle groups..."
          placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Performance Stats Cards Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.subText }]}>TOTAL WORKOUTS</Text>
          <Text style={styles.statValue}>
            <Text style={styles.greenText}>24</Text>
            <Text style={[styles.greyText, { color: theme.text }]}> this month</Text>
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.subText }]}>ACTIVE MINUTES</Text>
          <Text style={styles.statValue}>
            <Text style={styles.greenText}>840</Text>
            <Text style={[styles.greyText, { color: theme.text }]}> min</Text>
          </Text>
        </View>
      </View>

      {/* Weekly Goal Card */}
      <View style={[styles.goalCard, { backgroundColor: theme.card }]}>
        <View style={styles.goalHeaderRow}>
          <Text style={styles.goalTitle}>WEEKLY GOAL</Text>
          <Text style={styles.goalPercentage}>80%</Text>
        </View>
        <View style={[styles.goalTrack, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F3F4F6' }]}>
          <View style={styles.goalFill} />
        </View>
        <Text style={[styles.goalSubtitle, { color: theme.subText }]}>4 of 5 workouts completed</Text>
      </View>

      {/* Explore Categories row */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: activeCategory === 'all' ? '#24C76D' : theme.card, borderColor: activeCategory === 'all' ? '#24C76D' : theme.border }]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.categoryText, { color: activeCategory === 'all' ? '#FFFFFF' : theme.subText }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: activeCategory === 'yoga' ? '#24C76D' : theme.card, borderColor: activeCategory === 'yoga' ? '#24C76D' : theme.border }]}
            onPress={() => setActiveCategory('yoga')}
          >
            <Text style={[styles.categoryText, { color: activeCategory === 'yoga' ? '#FFFFFF' : theme.subText }]}>Yoga</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: activeCategory === 'pilates' ? '#24C76D' : theme.card, borderColor: activeCategory === 'pilates' ? '#24C76D' : theme.border }]}
            onPress={() => setActiveCategory('pilates')}
          >
            <Text style={[styles.categoryText, { color: activeCategory === 'pilates' ? '#FFFFFF' : theme.subText }]}>Pilates</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: activeCategory === 'strength' ? '#24C76D' : theme.card, borderColor: activeCategory === 'strength' ? '#24C76D' : theme.border }]}
            onPress={() => setActiveCategory('strength')}
          >
            <Text style={[styles.categoryText, { color: activeCategory === 'strength' ? '#FFFFFF' : theme.subText }]}>Strength Training</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Recommended for You list */}
      <View style={styles.recommendedSection}>
        <View style={styles.recommendedHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended for You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.workoutGrid, isLarge && styles.workoutGridLarge]}>
          {filteredWorkouts.map((workout) => (
            <View key={workout.id} style={[styles.workoutVideoCard, isLarge && styles.workoutVideoCardLarge, { backgroundColor: theme.card }]}>
              <View style={styles.videoThumbnailWrapper}>
                <Image source={{ uri: workout.image }} style={styles.videoThumbnail} resizeMode="cover" />
                <View style={[styles.difficultyBadge, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.9)' }]}>
                  <Text style={[styles.difficultyText, { color: theme.text }]}>⚡ {workout.tag}</Text>
                </View>
              </View>
              <View style={styles.workoutMeta}>
                <Text style={[styles.workoutTitle, { color: theme.text }]}>{workout.title}</Text>
                <View style={styles.workoutDetailsRow}>
                  <Text style={[styles.detailText, { color: theme.subText }]}>⏱️ {workout.duration}</Text>
                  <Text style={[styles.detailText, { color: theme.subText, marginLeft: 16 }]}>🔥 {workout.calories}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Exercise Catalog directory */}
      <View style={styles.catalogSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercise Catalog</Text>

        <TouchableOpacity style={[styles.catalogItemCard, { backgroundColor: theme.card }]}>
          <View style={[styles.catalogIconBadge, { backgroundColor: isDarkMode ? '#2C2C2E' : '#EEF2FF' }]}>
            <Text style={styles.catalogEmoji}>🏋️‍♂️</Text>
          </View>
          <View style={styles.catalogMeta}>
            <Text style={[styles.catalogTitle, { color: theme.text }]}>Full Body Weightlifting</Text>
            <Text style={[styles.catalogSubtitle, { color: theme.subText }]}>120 exercises</Text>
          </View>
          <Text style={styles.catalogArrow}>＞</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.catalogItemCard, { backgroundColor: theme.card }]}>
          <View style={[styles.catalogIconBadge, { backgroundColor: isDarkMode ? '#2C2C2E' : '#EBFDF2' }]}>
            <Text style={styles.catalogEmoji}>🧘‍♂️</Text>
          </View>
          <View style={styles.catalogMeta}>
            <Text style={[styles.catalogTitle, { color: theme.text }]}>Mobility & Stretching</Text>
            <Text style={[styles.catalogSubtitle, { color: theme.subText }]}>45 exercises</Text>
          </View>
          <Text style={styles.catalogArrow}>＞</Text>
        </TouchableOpacity>
      </View>
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
    color: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginTop: 10,
    marginBottom: 20,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 6,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
    elevation: 3,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  greenText: {
    color: '#24C76D',
  },
  greyText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: 'normal',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
    elevation: 3,
    marginBottom: 24,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  goalPercentage: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#24C76D',
  },
  goalTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    width: '80%',
    backgroundColor: '#24C76D',
    borderRadius: 4,
  },
  goalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 10,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },
  categoryList: {
    paddingVertical: 4,
  },
  categoryPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryPillActive: {
    backgroundColor: '#24C76D',
    borderColor: '#24C76D',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  recommendedSection: {
    marginBottom: 24,
  },
  recommendedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24C76D',
  },
  workoutVideoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
    elevation: 3,
    marginBottom: 16,
  },
  videoThumbnailWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  workoutMeta: {
    padding: 16,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  workoutDetailsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  catalogSection: {
    marginBottom: 20,
  },
  catalogItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  catalogIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogEmoji: {
    fontSize: 20,
  },
  catalogMeta: {
    flex: 1,
    marginLeft: 14,
  },
  catalogTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  catalogSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
  catalogArrow: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  workoutGrid: {
    width: '100%',
  },
  workoutGridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutVideoCardLarge: {
    width: '48%',
    marginHorizontal: '1%',
  },
});

export default ExerciseScreen;
