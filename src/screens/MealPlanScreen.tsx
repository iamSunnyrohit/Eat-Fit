import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

const MealPlanScreen: React.FC = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.tabContentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Recommended Meal Plan 🥣</Text>
          <Text style={styles.subtitle}>Structured recipes and macro balances tailored for you</Text>
        </View>
      </View>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recipeList}
        snapToInterval={222}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
      >
        {[
          {
            id: '1',
            title: 'Keto Baked Salmon 🥩',
            kcal: '580 kcal',
            macros: [
              { label: 'Fats (28g)', width: '80%', color: '#ff9500' },
              { label: 'Protein (42g)', width: '90%', color: '#34c759' },
              { label: 'Fiber (2g)', width: '10%', color: '#4a90e2' },
            ],
          },
          {
            id: '2',
            title: 'Quinoa Protein Salad 🥗',
            kcal: '450 kcal',
            macros: [
              { label: 'Fats (11g)', width: '35%', color: '#ff9500' },
              { label: 'Protein (22g)', width: '50%', color: '#34c759' },
              { label: 'Fiber (9g)', width: '75%', color: '#4a90e2' },
            ],
          },
          {
            id: '3',
            title: 'Berry Protein Oats 🥣',
            kcal: '310 kcal',
            macros: [
              { label: 'Fats (5g)', width: '15%', color: '#ff9500' },
              { label: 'Protein (18g)', width: '40%', color: '#34c759' },
              { label: 'Fiber (7g)', width: '55%', color: '#4a90e2' },
            ],
          },
        ].map((recipe, index) => {
          const inputRange = [
            (index - 1) * 222,
            index * 222,
            (index + 1) * 222,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1.05, 0.9],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.75, 1.0, 0.75],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={recipe.id}
              style={[
                styles.recipeCard,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <View>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeKcal}>{recipe.kcal}</Text>
              </View>

              <View style={styles.macroBarContainer}>
                {recipe.macros.map((macro: any, midx: number) => (
                  <View key={midx} style={{ marginBottom: 6 }}>
                    <Text style={styles.macroLabel}>{macro.label}</Text>
                    <View style={styles.macroBarBg}>
                      <View style={[styles.macroBarFill, { width: macro.width, backgroundColor: macro.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.nutritionalTipCard}>
        <Text style={styles.tipHeader}>💡 Macro Balance Tip</Text>
        <Text style={styles.tipText}>
          Consuming high quality proteins within 45 minutes of active watch exercises supports optimal recovery and lean muscle toning. Keep hydrated with at least 3 liters of water.
        </Text>
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
  recipeList: {
    paddingVertical: 4,
  },
  recipeCard: {
    width: 210,
    height: 210,
    backgroundColor: '#1e2029',
    borderRadius: 14,
    padding: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2c2e3a',
    justifyContent: 'space-between',
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
  nutritionalTipCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.25)',
    marginTop: 24,
    marginBottom: 20,
  },
  tipHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    color: '#a0a5b5',
    lineHeight: 18,
  },
});

export default MealPlanScreen;
