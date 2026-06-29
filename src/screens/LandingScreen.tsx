import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Platform,
  ImageBackground,
  Animated,
  useWindowDimensions
} from 'react-native';

const LandingScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCard, setSelectedCard] = useState<number>(1);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const isSmallMobile = width < 500;

  // Scanner animation
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        })
      ])
    ).start();
  }, [scanAnim]);

  const scannerTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 275], // mealImage height (300) minus scanLine height (3)
  });

  // Hero Section Parallax and Zoom
  const heroScale = scrollY.interpolate({
    inputRange: [-150, 0, 300],
    outputRange: [1.15, 1, 0.95],
    extrapolate: 'clamp',
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [-150, 0, 300],
    outputRange: [-40, 0, 50],
    extrapolate: 'clamp',
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  // Section 1: AI Calorie Scanner (starts around scroll y = 250 to 500)
  const sec1Opacity = scrollY.interpolate({
    inputRange: [250, 500],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const sec1TranslateY = scrollY.interpolate({
    inputRange: [250, 500],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  // Section 2: Wearable Sync & Macro Progress (starts around scroll y = 550 to 800)
  const sec2Opacity = scrollY.interpolate({
    inputRange: [550, 800],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const sec2TranslateY = scrollY.interpolate({
    inputRange: [550, 800],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  // Section 3: Expert-Led Programs (starts around scroll y = 900 to 1200)
  const sec3Opacity = scrollY.interpolate({
    inputRange: [900, 1200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const sec3TranslateY = scrollY.interpolate({
    inputRange: [900, 1200],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  // Section 4: Pro Membership (starts around scroll y = 1400 to 1700)
  const proOpacity = scrollY.interpolate({
    inputRange: [1400, 1700],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const proTranslateY = scrollY.interpolate({
    inputRange: [1400, 1700],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  // Section 5: Footer Portal (starts around scroll y = 1850 to 2150)
  const footerOpacity = scrollY.interpolate({
    inputRange: [1850, 2150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const footerTranslateY = scrollY.interpolate({
    inputRange: [1850, 2150],
    outputRange: [30, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: Platform.OS !== 'web' }
      )}
    >
      {/* Top Header Bar */}
      <View style={[styles.header, isLarge && { maxWidth: 1100, alignSelf: 'center' }]}>
        <Text style={styles.headerLogo}>Eat & Fit</Text>
        <TouchableOpacity
          style={styles.headerLoginBtn}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.headerLoginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <Animated.View
        style={{
          transform: [
            { scale: heroScale },
            { translateY: heroTranslateY }
          ],
          opacity: heroOpacity,
          width: '100%',
          maxWidth: 1100,
          alignSelf: 'center',
        }}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80' }}
          style={styles.heroBackground}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            {/* Tagline & Description group */}
            <View style={{ alignItems: 'center', width: '100%', paddingVertical: 10 }}>
              <Text style={styles.tagline}>Precision Fitness,{"\n"}<Text style={styles.greenText}>AI-Powered</Text></Text>
              <Text style={styles.description}>
                The ultimate high-performance ecosystem integrating clinical nutritional precision with data-driven movement. Experience health tracking re-engineered for the elite.
              </Text>
            </View>

            {/* Main Hero CTA */}
            <TouchableOpacity
              style={[styles.heroCtaBtn, { marginBottom: 30 }]}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.heroCtaText}>Get Started  →</Text>
            </TouchableOpacity>

            {/* Reviews, Ratings & Active Users Panel */}
            <View style={styles.heroStatsCard}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatHighlightValue}>★ 4.9</Text>
                <Text style={styles.heroStatLabel}>12K+ Reviews</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>150K+</Text>
                <Text style={styles.heroStatLabel}>Active Users</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>99.4%</Text>
                <Text style={styles.heroStatLabel}>Precision</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Feature Section 1: AI Calorie Scanner */}
      <Animated.View
        style={{
          opacity: sec1Opacity,
          transform: [{ translateY: sec1TranslateY }],
          width: '100%',
          maxWidth: 1100,
          alignSelf: 'center',
        }}
      >
        <View style={[styles.section, isLarge && styles.rowSection]}>
          <View style={isLarge ? [styles.leftCol, { marginRight: 40 }] : null}>
            <Text style={styles.sectionHeader}>Scan. Identify. Track.</Text>
            <Text style={styles.sectionSub}>
              Our proprietary neural engine identifies ingredients from a single photo. Point, shoot, and maintain clinical precision.
            </Text>
          </View>

          <View style={[isLarge ? styles.rightCol : null, { width: '100%' }]}>
            <View style={styles.mockScannerCard}>
              <View style={styles.mealImageContainer}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpOwktnkXU58s3Mj6UiWnSpYHjJ1yz_4pc2Atg1AnUVj0D8Mkfo9DTA6h6x6Qy7u_XFcqE3n0QOA3c4WhKnMTDJNZOxz9-hc6_JfkETlvp1EusqjorFDXhLgcKsEgPyrxXDV2gZxDJd8TE8nh2KlI2YWxHOfhA5JSqRE8RaFQcVLjGxhp1czTwpTihjRyQx3PV_lO_n_Hk8REmFVNUesaVDuf05sQ5nn_bCgRxGgyqFu3PNq8PZ2g1hYiw0Qg9OPfAEmWwJkyjHQ' }}
                  style={styles.mealImage}
                  resizeMode="cover"
                />
                <Animated.View style={[styles.scanLine, { transform: [{ translateY: scannerTranslateY }] }]} />
              </View>
              <View style={styles.scannerHeader}>
                <View style={styles.scannerBadge}>
                  <Text style={styles.scannerBadgeText}>● SCANNING...</Text>
                </View>
                <Text style={styles.mealTitle}>Salmon Power Bowl</Text>
                <Text style={styles.kcalCount}>642 kcal</Text>
              </View>

              <View style={styles.macroGrid}>
                <View style={styles.macroCell}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={[styles.macroVal, { color: '#56e472' }]}>42g</Text>
                </View>
                <View style={styles.macroCell}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={[styles.macroVal, { color: '#aac7ff' }]}>38g</Text>
                </View>
                <View style={styles.macroCell}>
                  <Text style={styles.macroLabel}>Fats</Text>
                  <Text style={[styles.macroVal, { color: '#ffb8af' }]}>22g</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Feature Section 2: Macro Analytics & Wearable Sync */}
      <Animated.View
        style={{
          opacity: sec2Opacity,
          transform: [{ translateY: sec2TranslateY }],
          width: '100%',
          maxWidth: 1100,
          alignSelf: 'center',
        }}
      >
        <View style={[styles.section, isLarge && styles.rowSection]}>
          {isLarge ? (
            <>
              <View style={[styles.rightCol, { marginRight: 40 }]}>
                <View style={styles.glassCard}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Daily Target Progress</Text>
                    <Text style={styles.progressPercent}>75%</Text>
                  </View>
                  <View style={styles.miniProgressContainer}>
                    <Text style={styles.miniLabel}>Protein (142 / 180g)</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '78%' }]} />
                    </View>
                  </View>

                  {/* Sync status cards */}
                  <View style={styles.syncRow}>
                    <View style={styles.syncCard}>
                      <Text style={styles.syncTitle}>Apple HealthKit</Text>
                      <Text style={styles.syncSub}>Synced</Text>
                    </View>
                    <View style={styles.syncCard}>
                      <Text style={styles.syncTitle}>Health Connect</Text>
                      <Text style={styles.syncSub}>Synced</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.leftCol}>
                <Text style={styles.sectionHeader}>Master Your Macros</Text>
                <Text style={styles.sectionSub}>
                  Deep-dive into physiological metrics. Seamless wearable synchronization keeps your stats updated.
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionHeader}>Master Your Macros</Text>
              <Text style={styles.sectionSub}>
                Deep-dive into physiological metrics. Seamless wearable synchronization keeps your stats updated.
              </Text>

              <View style={styles.glassCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Daily Target Progress</Text>
                  <Text style={styles.progressPercent}>75%</Text>
                </View>
                <View style={styles.miniProgressContainer}>
                  <Text style={styles.miniLabel}>Protein (142 / 180g)</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '78%' }]} />
                  </View>
                </View>

                {/* Sync status cards */}
                <View style={styles.syncRow}>
                  <View style={styles.syncCard}>
                    <Text style={styles.syncTitle}>Apple HealthKit</Text>
                    <Text style={styles.syncSub}>Synced</Text>
                  </View>
                  <View style={styles.syncCard}>
                    <Text style={styles.syncTitle}>Health Connect</Text>
                    <Text style={styles.syncSub}>Synced</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </Animated.View>

      {/* Feature Section 3: Expert-Led Programs */}
      <Animated.View
        style={{
          opacity: sec3Opacity,
          transform: [{ translateY: sec3TranslateY }],
          width: '100%',
          maxWidth: 1100,
          alignSelf: 'center',
        }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Expert-Led Programs</Text>
          <Text style={styles.sectionSub}>
            Professional guidance adapted to your specific recovery capacity.
          </Text>

          <View style={[styles.programsList, isLarge && styles.rowPrograms]}>
            {/* Yoga Card */}
            <View style={[styles.programCard, isLarge && styles.programCardLarge, { borderLeftColor: '#56e472' }]}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrZ_Zouy3bGmwdbCRqEfh1no9AP6svHumn01VlzCxDASEe2F51Z79tTad9PBg2-tYgcf6hQAObrQnPSCgLd5KmlNotsrfcGcVzCgQkuQrgUQEiJMw87yvi9iK6x5643ZaDrbd3OHkFte_8NkwLJjtvIFuGQdgdC_PvYNt5VFxl99wf31IWzwS6Wb_RJQD-3aGV63QdHola6JOJb12Yg91bOHGhfX3XMyEJZihW9__stoyTE8fg7fcMsfy3v1LyUjBx8sXQQMIMhw' }}
                style={styles.programImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              <View style={styles.programContent}>
                <Text style={styles.programLabel}>MOBILITY</Text>
                <Text style={styles.programTitleText}>Athletic Yoga</Text>
                <Text style={styles.programDesc}>Enhance recovery and range of motion.</Text>
              </View>
            </View>

            {/* Strength Card */}
            <View style={[styles.programCard, isLarge && styles.programCardLarge, { borderLeftColor: '#aac7ff' }]}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcx6Tm457lPhQBgKrFCsk4BePcOktwGk7hlKRv4Sj5MDhPPgzZ1Ezuwc8NpWSMDwnDbO91BXwr9oE_JghOo8Z4JY-q64HTP1_asKhv3-TrQZumthJKg7pSv85Fsc22PfIdvBozCt0wVVBQUXHGhH5cSOWxt6ZCFqzjaiUG_1kJFm1JEz65arklExHq-7QGk7jzWNR3RmaPT5xnMt3hCUPE19DdTjTHfvigU9TkwGzwVnuK3FL-tSdlw2X44VLCs4zgMhrSo0yWJQ' }}
                style={styles.programImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              <View style={styles.programContent}>
                <Text style={styles.programLabel}>HYPERTROPHY</Text>
                <Text style={styles.programTitleText}>Strength & Power</Text>
                <Text style={styles.programDesc}>Science-based progressive overload.</Text>
              </View>
            </View>

            {/* Pilates Card */}
            <View style={[styles.programCard, isLarge && styles.programCardLarge, { borderLeftColor: '#ffb8af' }]}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmgg0nh2TgLSZbCaEx9vE8oVJTCpWdGRtXxXmvVpwvmnAMb-GuyO9U7zxkOR4fctLz_BM0cxmTx0CoNryi1ZI4eeUrqtrQMlt53DHsKB_gqZx6BK11VZ7HhqSyruMpdDqC5eOLbqTeEaB4fv1OUtWOcguj8UBgVDKD4O4vXwao7eCCtMBFNj8KjUlG_OV9zU08gBlP25bgkbuO8laFK30i4_rMVXXYRPQgEPuzUp7WsDMWjHryTeCPafH5-yfcwUipY_TJ1LiMNg' }}
                style={styles.programImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              <View style={styles.programContent}>
                <Text style={styles.programLabel}>CORE STABILITY</Text>
                <Text style={styles.programTitleText}>Advanced Pilates</Text>
                <Text style={styles.programDesc}>Technical core stability and control.</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Pro Membership Callout */}
      <Animated.View
        style={{
          opacity: proOpacity,
          transform: [{ translateY: proTranslateY }],
          width: '100%',
          maxWidth: 1100,
          alignSelf: 'center',
        }}
      >
        <View style={styles.proSection}>
          <Text style={styles.proLabel}>★ PRO MEMBER STATUS</Text>
          <Text style={styles.proTitle}>Elevate Your Standard</Text>
          <Text style={styles.proDesc}>
            Access global leaderboards, expert forums, and verified bio-data metrics.
          </Text>

          {/* Price Cards Row */}
          <View style={[styles.priceCardsRow, isSmallMobile && styles.priceCardsRowVertical]}>
            {/* Monthly Plan */}
            <Pressable
              onPress={() => setSelectedCard(0)}
              style={[
                styles.priceCard,
                isSmallMobile && styles.priceCardVertical,
                {
                  borderColor: selectedCard === 0 ? '#56e472' : '#3a3a3c',
                  borderWidth: selectedCard === 0 ? 1.8 : 1,
                  backgroundColor: selectedCard === 0 ? '#262830' : '#1e2025',
                  boxShadow: selectedCard === 0 ? '0px 4px 8px rgba(86, 228, 114, 0.22)' : 'none',
                  transform: [{ scale: selectedCard === 0 ? 1.03 : 1.0 }],
                }
              ]}
            >
              <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <Text style={styles.priceTitle}>Monthly Plan</Text>
                <Text style={styles.priceSub}>Billed monthly</Text>
              </View>
              <Text style={styles.priceVal}>₹300<Text style={styles.pricePeriod}>/mo</Text></Text>
            </Pressable>

            {/* 3-Month Plan */}
            <Pressable
              onPress={() => setSelectedCard(1)}
              style={[
                styles.priceCard,
                isSmallMobile && styles.priceCardVertical,
                {
                  borderColor: selectedCard === 1 ? '#56e472' : '#3a3a3c',
                  borderWidth: selectedCard === 1 ? 1.8 : 1,
                  backgroundColor: selectedCard === 1 ? '#262830' : '#1e2025',
                  boxShadow: selectedCard === 1 ? '0px 4px 8px rgba(86, 228, 114, 0.22)' : 'none',
                  transform: [{ scale: selectedCard === 1 ? 1.03 : 1.0 }],
                }
              ]}
            >
              <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>POPULAR</Text>
                </View>
                <Text style={styles.priceTitle}>3-Month Plan</Text>
                <Text style={styles.priceSub}>Billed quarterly</Text>
              </View>
              <Text style={styles.priceVal}>₹799<Text style={styles.pricePeriod}>/3m</Text></Text>
            </Pressable>

            {/* Annual Plan */}
            <Pressable
              onPress={() => setSelectedCard(2)}
              style={[
                styles.priceCard,
                isSmallMobile && styles.priceCardVertical,
                {
                  borderColor: selectedCard === 2 ? '#56e472' : '#3a3a3c',
                  borderWidth: selectedCard === 2 ? 1.8 : 1,
                  backgroundColor: selectedCard === 2 ? '#262830' : '#1e2025',
                  boxShadow: selectedCard === 2 ? '0px 4px 8px rgba(86, 228, 114, 0.22)' : 'none',
                  transform: [{ scale: selectedCard === 2 ? 1.03 : 1.0 }],
                }
              ]}
            >
              <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <Text style={styles.priceTitle}>Annual Plan</Text>
                <Text style={styles.priceSub}>Billed yearly</Text>
              </View>
              <Text style={styles.priceVal}>₹1800<Text style={styles.pricePeriod}>/yr</Text></Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Final CTA Portal Trigger */}
      <Animated.View
        style={{
          opacity: footerOpacity,
          transform: [{ translateY: footerTranslateY }],
          width: '100%',
          maxWidth: 1100,
          alignSelf: 'center',
        }}
      >
        <View style={styles.footerPortal}>
          <Text style={styles.footerText}>Ready to re-engineer your health?</Text>
          <TouchableOpacity
            style={styles.footerCtaBtn}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.footerCtaText}>Start Your Transformation</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={{ height: 80 }} />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131315',
    padding: 20,
    width: '100%',
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 45 : 35,
    marginBottom: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#56e472',
  },
  headerLoginBtn: {
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  headerLoginText: {
    color: '#56e472',
    fontSize: 13,
    fontWeight: '600',
  },
  heroBackground: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 48,
  },
  heroImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    width: '100%',
    backgroundColor: 'rgba(19, 19, 21, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  heroStatsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  heroStatHighlightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  heroStatLabel: {
    fontSize: 9,
    color: '#939397',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tagline: {
    fontSize: 38,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 18,
  },
  greenText: {
    color: '#56e472',
  },
  description: {
    fontSize: 15,
    color: '#d1d1d6',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  heroCtaBtn: {
    backgroundColor: '#56e472',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(86, 228, 114, 0.35)',
    elevation: 5,
  },
  heroCtaText: {
    color: '#002107',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 44,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 13,
    color: '#939397',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  mockScannerCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    width: '100%',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scannerBadge: {
    backgroundColor: 'rgba(86, 228, 114, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  scannerBadgeText: {
    color: '#56e472',
    fontSize: 11,
    fontWeight: 'bold',
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginLeft: 12,
  },
  kcalCount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCell: {
    flex: 1,
    backgroundColor: '#2a2a2c',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#3d4a3c',
  },
  macroLabel: {
    fontSize: 11,
    color: '#939397',
    marginBottom: 4,
  },
  macroVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  glassCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#56e472',
  },
  miniProgressContainer: {
    marginBottom: 16,
  },
  miniLabel: {
    fontSize: 12,
    color: '#939397',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#131315',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#56e472',
    borderRadius: 3,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncCard: {
    flex: 1,
    backgroundColor: '#2a2a2c',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  syncTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  syncSub: {
    fontSize: 11,
    color: '#56e472',
    marginTop: 2,
  },
  programsList: {
    width: '100%',
  },
  programCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    overflow: 'hidden',
    height: 220,
    justifyContent: 'flex-end',
  },
  programContent: {
    zIndex: 1,
  },
  programLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#939397',
    letterSpacing: 1,
    marginBottom: 4,
  },
  programTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  programDesc: {
    fontSize: 12,
    color: '#939397',
    marginTop: 4,
  },
  proSection: {
    backgroundColor: 'rgba(86, 228, 114, 0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(86, 228, 114, 0.35)',
    marginBottom: 44,
    width: '100%',
    boxShadow: '0px 6px 15px rgba(86, 228, 114, 0.12)',
  },
  proLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#56e472',
    letterSpacing: 1,
    marginBottom: 6,
  },
  proTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  proDesc: {
    fontSize: 13,
    color: '#939397',
    lineHeight: 18,
    marginBottom: 16,
  },
  priceCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  priceCard: {
    flex: 1,
    backgroundColor: '#1e2025',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#3a3a3d',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  popularCard: {
    borderColor: '#56e472',
    borderWidth: 1.8,
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  priceSub: {
    fontSize: 10,
    color: '#a9abb0',
    marginTop: 3,
    textAlign: 'center',
    lineHeight: 12,
  },
  priceVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#56e472',
    textAlign: 'center',
    marginTop: 6,
  },
  pricePeriod: {
    fontSize: 9,
    color: '#939397',
    fontWeight: 'normal',
  },
  badgeContainer: {
    backgroundColor: '#56e472',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    alignSelf: 'center',
    marginBottom: 4,
  },
  badgeText: {
    color: '#002107',
    fontSize: 8,
    fontWeight: 'bold',
  },
  footerPortal: {
    alignItems: 'center',
    marginVertical: 45,
    width: '100%',
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  footerCtaBtn: {
    backgroundColor: '#56e472',
    paddingVertical: 18,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 6px 10px rgba(86, 228, 114, 0.45)',
    elevation: 6,
  },
  footerCtaText: {
    color: '#002107',
    fontSize: 18,
    fontWeight: '800',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  programImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(53, 53, 67, 0.65)',
    borderRadius: 14,
  },
  // Responsive / Custom Layout extensions
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    flex: 1.1,
  },
  rowPrograms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  programCardLarge: {
    flex: 1,
    marginHorizontal: 8,
    height: 250,
  },
  priceCardsRowVertical: {
    flexDirection: 'column',
  },
  priceCardVertical: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 12,
    minHeight: 110,
  },
  mealImageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    boxShadow: '0px 4px 10px rgba(86, 228, 114, 0.15)',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#56e472',
    boxShadow: '0px 0px 8px rgba(86, 228, 114, 0.8)',
  },
});

export default LandingScreen;
