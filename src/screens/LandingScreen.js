import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image
} from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>Eat & Fit</Text>
        <TouchableOpacity
          style={styles.headerLoginBtn}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.headerLoginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.tagline}>Precision Fitness, <Text style={styles.greenText}>AI-Powered</Text></Text>
        <Text style={styles.description}>
          The ultimate high-performance ecosystem integrating clinical nutritional precision with data-driven movement. Experience health tracking re-engineered for the elite.
        </Text>

        {/* Main Hero CTA */}
        <TouchableOpacity
          style={styles.heroCtaBtn}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.heroCtaText}>Get Started  →</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Section 1: AI Calorie Scanner */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Scan. Identify. Track.</Text>
        <Text style={styles.sectionSub}>
          Our proprietary neural engine identifies ingredients from a single photo. Point, shoot, and maintain clinical precision.
        </Text>

        <View style={styles.mockScannerCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpOwktnkXU58s3Mj6UiWnSpYHjJ1yz_4pc2Atg1AnUVj0D8Mkfo9DTA6h6x6Qy7u_XFcqE3n0QOA3c4WhKnMTDJNZOxz9-hc6_JfkETlvp1EusqjorFDXhLgcKsEgPyrxXDV2gZxDJd8TE8nh2KlI2YWxHOfhA5JSqRE8RaFQcVLjGxhp1czTwpTihjRyQx3PV_lO_n_Hk8REmFVNUesaVDuf05sQ5nn_bCgRxGgyqFu3PNq8PZ2g1hYiw0Qg9OPfAEmWwJkyjHQ' }}
            style={styles.mealImage}
            resizeMode="cover"
          />
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

      {/* Feature Section 2: Macro Analytics & Wearable Sync */}
      <View style={styles.section}>
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
      </View>

      {/* Feature Section 3: Expert-Led Programs */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Expert-Led Programs</Text>
        <Text style={styles.sectionSub}>
          Professional guidance adapted to your specific recovery capacity.
        </Text>

        <View style={styles.programsList}>
          {/* Yoga Card */}
          <View style={[styles.programCard, { borderLeftColor: '#56e472' }]}>
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
          <View style={[styles.programCard, { borderLeftColor: '#aac7ff' }]}>
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
          <View style={[styles.programCard, { borderLeftColor: '#ffb8af' }]}>
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

      {/* Pro Membership Callout */}
      <View style={styles.proSection}>
        <Text style={styles.proLabel}>★ PRO MEMBER STATUS</Text>
        <Text style={styles.proTitle}>Elevate Your Standard</Text>
        <Text style={styles.proDesc}>
          Access global leaderboards, expert forums, and verified bio-data metrics.
        </Text>

        {/* Monthly Plan */}
        <View style={[styles.priceCard, { marginBottom: 10 }]}>
          <View>
            <Text style={styles.priceTitle}>Monthly Plan</Text>
            <Text style={styles.priceSub}>Billed every month</Text>
          </View>
          <Text style={styles.priceVal}>₹300 <Text style={styles.pricePeriod}>/ mo</Text></Text>
        </View>

        {/* 3-Month Plan */}
        <View style={[styles.priceCard, styles.popularCard, { marginBottom: 10 }]}>
          <View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>POPULAR</Text>
            </View>
            <Text style={styles.priceTitle}>3-Month Plan</Text>
            <Text style={styles.priceSub}>Billed quarterly (₹266/mo)</Text>
          </View>
          <Text style={styles.priceVal}>₹799 <Text style={styles.pricePeriod}>/ 3 mos</Text></Text>
        </View>

        {/* Annual Plan */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceTitle}>Annual Plan</Text>
            <Text style={styles.priceSub}>Billed yearly (₹150/mo)</Text>
          </View>
          <Text style={styles.priceVal}>₹1800 <Text style={styles.pricePeriod}>/ yr</Text></Text>
        </View>
      </View>

      {/* Final CTA Portal Trigger */}
      <View style={styles.footerPortal}>
        <Text style={styles.footerText}>Ready to re-engineer your health?</Text>
        <TouchableOpacity
          style={styles.footerCtaBtn}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.footerCtaText}>Start Your Transformation</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131315',
    padding: 20,
  },
  header: {
    marginTop: 20,
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  tagline: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  greenText: {
    color: '#56e472',
  },
  description: {
    fontSize: 14,
    color: '#939397',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  heroCtaBtn: {
    backgroundColor: '#56e472',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#56e472',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
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
    padding: 16,
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
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    overflow: 'hidden',
  },
  programContent: {
    flex: 1,
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
    backgroundColor: 'rgba(86, 228, 114, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(86, 228, 114, 0.2)',
    marginBottom: 44,
    width: '100%',
  },
  proLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#56e472',
    letterSpacing: 1,
    marginBottom: 6,
  },
  proTitle: {
    fontSize: 20,
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
  priceCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c',
  },
  popularCard: {
    borderColor: '#56e472',
    borderWidth: 1.5,
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceSub: {
    fontSize: 11,
    color: '#939397',
    marginTop: 3,
  },
  priceVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#56e472',
  },
  pricePeriod: {
    fontSize: 11,
    color: '#939397',
    fontWeight: 'normal',
  },
  badgeContainer: {
    backgroundColor: '#56e472',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    color: '#002107',
    fontSize: 9,
    fontWeight: 'bold',
  },
  footerPortal: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  footerCtaBtn: {
    backgroundColor: '#56e472',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#56e472',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  footerCtaText: {
    color: '#002107',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
  },
  programImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 19, 21, 0.75)',
    borderRadius: 14,
  },
});

export default LandingScreen;
