/**
 * ============================================================
 *  RDW TV — React Native App
 *  Powered by RDW Store
 *  © 2025 Rimawi Digital World. All Rights Reserved.
 * ============================================================
 *
 *  DEPENDENCIES (run before use):
 *    npm install @react-navigation/native @react-navigation/bottom-tabs
 *    npm install react-native-screens react-native-safe-area-context
 *    npm install @react-native-async-storage/async-storage
 *    npm install react-native-video
 *    npm install react-native-skeleton-placeholder  (optional, built-in shimmer used here)
 *    npx pod-install  (iOS only)
 */

import React, {
  createContext, useContext, useState, useEffect, useRef, useCallback
} from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
  TextInput, Image, Dimensions, StatusBar, ActivityIndicator,
  Animated, Switch, Platform, Linking, Alert, I18nManager,
  RefreshControl, Modal, SafeAreaView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';

// ─── Constants ──────────────────────────────────────────────
const API_BASE  = 'https://api.dfkz.site/alooy/';
const API_SEARCH = (q) => `${API_BASE}?q=${encodeURIComponent(q)}`;
const API_SERIES = (id) => `${API_BASE}series.php?id=${id}`;

const COLORS = {
  bg:      '#0b0e14',
  bg2:     '#111620',
  bg3:     '#181d28',
  card:    '#161c28',
  accent:  '#00d4ff',
  accent2: '#0099bb',
  text:    '#e8eaf0',
  text2:   '#8892a4',
  text3:   '#4a5568',
  border:  '#1e2a3a',
  danger:  '#ff4757',
  success: '#2ed573',
};

const CATEGORIES = [
  { key: 'ramadan',  labelAr: 'رمضان',  labelEn: 'Ramadan',  emoji: '🌙' },
  { key: 'gulf',     labelAr: 'خليجي',  labelEn: 'Gulf',     emoji: '🏖️' },
  { key: 'arabic',   labelAr: 'عربي',   labelEn: 'Arabic',   emoji: '🌹' },
  { key: 'turkish',  labelAr: 'تركي',   labelEn: 'Turkish',  emoji: '🇹🇷' },
  { key: 'foreign',  labelAr: 'أجنبي',  labelEn: 'Foreign',  emoji: '🌍' },
  { key: 'movies',   labelAr: 'أفلام',  labelEn: 'Movies',   emoji: '🎬' },
];

// ─── Localization ────────────────────────────────────────────
const STRINGS = {
  ar: {
    appName:        'RDW TV',
    poweredBy:      'مقدم من RDW Store',
    allRights:      'جميع الحقوق محفوظة © 2025',
    home:           'الرئيسية',
    categories:     'التصنيفات',
    search:         'بحث',
    settings:       'الإعدادات',
    trending:       'الأكثر مشاهدة',
    newToday:       'جديد اليوم',
    seeAll:         'عرض الكل',
    noResults:      'لا توجد نتائج',
    searchHint:     'ابحث عن مسلسل أو فيلم...',
    searchEmpty:    'اكتب للبحث في آلاف المسلسلات',
    episodes:       'الحلقات',
    episode:        'حلقة',
    play:           'مشاهدة',
    loading:        'جاري التحميل...',
    error:          'حدث خطأ، أعد المحاولة',
    retry:          'إعادة المحاولة',
    appearance:     'المظهر',
    language:       'اللغة',
    darkMode:       'الوضع الداكن',
    notifications:  'الإشعارات',
    about:          'عن التطبيق',
    version:        'الإصدار',
    rights:         'حقوق الملكية',
    rightsDetail:   'جميع محتويات هذا التطبيق محمية بموجب قوانين حقوق الملكية الفكرية. RDW Store © 2025',
    privacy:        'سياسة الخصوصية',
    currentLang:    'العربية',
    switchLang:     'English',
    quality:        'جودة الفيديو',
    qualityVal:     'تلقائي',
    autoPlay:       'تشغيل تلقائي',
  },
  en: {
    appName:        'RDW TV',
    poweredBy:      'Powered by RDW Store',
    allRights:      'All Rights Reserved © 2025',
    home:           'Home',
    categories:     'Categories',
    search:         'Search',
    settings:       'Settings',
    trending:       'Trending Now',
    newToday:       'New Today',
    seeAll:         'See All',
    noResults:      'No results found',
    searchHint:     'Search series, movies...',
    searchEmpty:    'Start typing to search thousands of titles',
    episodes:       'Episodes',
    episode:        'Episode',
    play:           'Watch Now',
    loading:        'Loading...',
    error:          'Something went wrong, please retry',
    retry:          'Retry',
    appearance:     'Appearance',
    language:       'Language',
    darkMode:       'Dark Mode',
    notifications:  'Notifications',
    about:          'About',
    version:        'Version',
    rights:         'Rights Reserved',
    rightsDetail:   'All content in this app is protected by intellectual property laws. RDW Store © 2025',
    privacy:        'Privacy Policy',
    currentLang:    'English',
    switchLang:     'عربي',
    quality:        'Video Quality',
    qualityVal:     'Auto',
    autoPlay:       'Auto Play',
  },
};

// ─── Context ─────────────────────────────────────────────────
const AppContext = createContext({});
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [lang, setLang]   = useState('ar');
  const [isRTL, setIsRTL] = useState(true);

  const t = useCallback((key) => STRINGS[lang]?.[key] ?? key, [lang]);

  const toggleLang = useCallback(async () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    await AsyncStorage.setItem('rdw_lang', next);
    I18nManager.forceRTL(next === 'ar');
    setLang(next);
    setIsRTL(next === 'ar');
  }, [lang]);

  useEffect(() => {
    AsyncStorage.getItem('rdw_lang').then((saved) => {
      if (saved) { setLang(saved); setIsRTL(saved === 'ar'); }
    });
  }, []);

  return (
    <AppContext.Provider value={{ lang, isRTL, t, toggleLang }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────
function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true); setError(null);
    try {
      const res  = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

// ─── Skeleton Loader ─────────────────────────────────────────
function Skeleton({ width, height, borderRadius = 8, style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: COLORS.border, opacity }, style]}
    />
  );
}

function SkeletonCard() {
  return (
    <View style={{ width: 110, marginEnd: 10 }}>
      <Skeleton width={110} height={160} borderRadius={10} />
      <Skeleton width={80}  height={8}   borderRadius={4}  style={{ marginTop: 6 }} />
      <Skeleton width={55}  height={8}   borderRadius={4}  style={{ marginTop: 4 }} />
    </View>
  );
}

// ─── Media Card ──────────────────────────────────────────────
function MediaCard({ item, onPress }) {
  const { isRTL } = useApp();
  if (!item) return <SkeletonCard />;

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.75}
      style={{ width: 110, marginEnd: 10 }}>
      <View style={styles.cardImgWrap}>
        {item.poster ? (
          <Image source={{ uri: item.poster }} style={styles.cardImg} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImg, styles.cardPlaceholder]}>
            <Text style={{ fontSize: 32 }}>🎬</Text>
          </View>
        )}
        {item.category && (
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{item.category}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]} numberOfLines={2}>
        {item.title || item.name}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Section Row ─────────────────────────────────────────────
function SectionRow({ title, data, loading, onPress, onSeeAll }) {
  const { t, isRTL } = useApp();
  const skeletons = Array(4).fill(null);

  return (
    <View style={{ marginBottom: 8 }}>
      <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>{t('seeAll')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={loading ? skeletons : (data || skeletons)}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        inverted={isRTL}
        renderItem={({ item }) =>
          loading
            ? <SkeletonCard />
            : <MediaCard item={item} onPress={onPress} />
        }
      />
    </View>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const { t, lang, isRTL } = useApp();
  const [activeChip, setActiveChip] = useState('ramadan');
  const [refreshing, setRefreshing]  = useState(false);
  const [allData, setAllData]        = useState({});
  const [loading, setLoading]        = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80], outputRange: [1, 0.85], extrapolate: 'clamp'
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API_BASE);
      const json = await res.json();
      // Expected: { ramadan:[...], gulf:[...], arabic:[...], turkish:[...], foreign:[...], movies:[...] }
      // or array with category field — adapt as needed:
      if (Array.isArray(json)) {
        const grouped = {};
        CATEGORIES.forEach(c => { grouped[c.key] = []; });
        json.forEach(item => {
          const k = item.category?.toLowerCase();
          if (grouped[k]) grouped[k].push(item);
        });
        setAllData(grouped);
      } else {
        setAllData(json);
      }
    } catch (e) {
      console.warn('Fetch error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const openDetail = useCallback((item) => {
    navigation.navigate('Detail', { id: item.id, title: item.title || item.name });
  }, [navigation]);

  const categoryLabel = useCallback((cat) => {
    const found = CATEGORIES.find(c => c.key === cat);
    return found ? (lang === 'ar' ? found.labelAr : found.labelEn) : cat;
  }, [lang]);

  const heroBg = allData.ramadan?.[0]?.poster || null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Header */}
        <Animated.View style={[styles.homeHeader, { opacity: headerOpacity }]}>
          <View style={isRTL ? styles.rowReverse : styles.row}>
            <View>
              <Text style={styles.logoText}>RDW TV</Text>
              <Text style={styles.poweredBy}>{t('poweredBy')}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={{ color: COLORS.text2, fontSize: 20 }}>🔔</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          {heroBg
            ? <Image source={{ uri: heroBg }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            : <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0d1a2e', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 64, opacity: 0.3 }}>🎬</Text>
              </View>
          }
          <View style={styles.heroGradient} />
          <View style={[styles.heroContent, isRTL && { alignItems: 'flex-end' }]}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {lang === 'ar' ? '🔥 مميز' : '🔥 Featured'}
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              {allData.ramadan?.[0]?.title || (lang === 'ar' ? 'أحدث المسلسلات' : 'Latest Series')}
            </Text>
            <Text style={styles.heroMeta}>
              {lang === 'ar' ? 'دراما · رمضان 2025' : 'Drama · Ramadan 2025'}
            </Text>
          </View>
        </View>

        {/* Category Chips */}
        <FlatList
          data={CATEGORIES}
          horizontal
          keyExtractor={(c) => c.key}
          showsHorizontalScrollIndicator={false}
          inverted={isRTL}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveChip(item.key)}
              style={[styles.chip, activeChip === item.key && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeChip === item.key && styles.chipTextActive]}>
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Active Category Section */}
        <SectionRow
          title={`${CATEGORIES.find(c => c.key === activeChip)?.emoji} ${categoryLabel(activeChip)}`}
          data={allData[activeChip]}
          loading={loading}
          onPress={openDetail}
          onSeeAll={() => navigation.navigate('CategoryList', { category: activeChip })}
        />

        {/* All Sections */}
        {CATEGORIES.filter(c => c.key !== activeChip).map(cat => (
          <SectionRow
            key={cat.key}
            title={`${cat.emoji} ${lang === 'ar' ? cat.labelAr : cat.labelEn}`}
            data={allData[cat.key]}
            loading={loading}
            onPress={openDetail}
            onSeeAll={() => navigation.navigate('CategoryList', { category: cat.key })}
          />
        ))}

        <Footer />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─── CATEGORIES SCREEN ───────────────────────────────────────
function CategoriesScreen({ navigation }) {
  const { t, lang, isRTL } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>{t('categories')}</Text>
      </View>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.catCard}
            onPress={() => navigation.navigate('CategoryList', { category: item.key })}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</Text>
            <Text style={styles.catCardLabel}>
              {lang === 'ar' ? item.labelAr : item.labelEn}
            </Text>
            <Text style={styles.catCardCount}>
              {lang === 'ar' ? 'اضغط للاستعراض' : 'Tap to browse'}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={<Footer />}
      />
    </SafeAreaView>
  );
}

// ─── SEARCH SCREEN ───────────────────────────────────────────
function SearchScreen({ navigation }) {
  const { t, isRTL } = useApp();
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res  = await fetch(API_SEARCH(q));
      const json = await res.json();
      setResults(Array.isArray(json) ? json : json.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChangeText = (text) => {
    setQuery(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(text), 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>{t('search')}</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, isRTL && styles.rowReverse]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, isRTL && { textAlign: 'right' }]}
          placeholder={t('searchHint')}
          placeholderTextColor={COLORS.text3}
          value={query}
          onChangeText={onChangeText}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
            <Text style={{ color: COLORS.text2, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 24 }} />
      )}

      {!query && !loading && (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🎬</Text>
          <Text style={styles.emptyText}>{t('searchEmpty')}</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultItem, isRTL && styles.rowReverse]}
            onPress={() => navigation.navigate('Detail', { id: item.id, title: item.title || item.name })}
            activeOpacity={0.75}
          >
            <View style={styles.resultThumb}>
              {item.poster
                ? <Image source={{ uri: item.poster }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                : <Text style={{ fontSize: 28 }}>🎭</Text>
              }
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={[styles.resultTitle, isRTL && { textAlign: 'right' }]} numberOfLines={2}>
                {item.title || item.name}
              </Text>
              <Text style={[styles.resultMeta, isRTL && { textAlign: 'right' }]}>
                {item.category || ''}{item.year ? ` · ${item.year}` : ''}
              </Text>
              {item.rating && (
                <Text style={styles.resultRating}>⭐ {item.rating}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('noResults')}</Text>
            </View>
          ) : null
        }
        ListFooterComponent={<Footer />}
      />
    </SafeAreaView>
  );
}

// ─── SETTINGS SCREEN ─────────────────────────────────────────
function SettingsScreen() {
  const { t, lang, isRTL, toggleLang } = useApp();
  const [notif, setNotif]     = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showRights, setShowRights] = useState(false);

  const SettingItem = ({ icon, label, value, right }) => (
    <View style={[styles.settingItem, isRTL && styles.rowReverse]}>
      <View style={[styles.settingIconWrap]}><Text style={{ fontSize: 16 }}>{icon}</Text></View>
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      {right}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>{t('settings')}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}><Text style={{ fontSize: 32 }}>📺</Text></View>
          <View style={{ flex: 1, paddingHorizontal: 14 }}>
            <Text style={styles.profileName}>RDW TV</Text>
            <Text style={styles.profileSub}>{t('poweredBy')}</Text>
          </View>
        </View>

        {/* Appearance */}
        <Text style={styles.settingGroup}>{t('appearance')}</Text>
        <View style={styles.settingCard}>
          <SettingItem icon="🌙" label={t('darkMode')} value="Cyber Dark"
            right={<Switch value={true} trackColor={{ true: COLORS.accent }} thumbColor="#fff" />}
          />
          <View style={styles.divider} />
          <SettingItem icon="🌐" label={t('language')} value={t('currentLang')}
            right={
              <TouchableOpacity onPress={toggleLang} style={styles.langPill}>
                <Text style={styles.langPillText}>{t('switchLang')}</Text>
              </TouchableOpacity>
            }
          />
          <View style={styles.divider} />
          <SettingItem icon="🔔" label={t('notifications')}
            right={
              <Switch value={notif} onValueChange={setNotif}
                trackColor={{ true: COLORS.accent }} thumbColor="#fff" />
            }
          />
          <View style={styles.divider} />
          <SettingItem icon="▶️" label={t('autoPlay')}
            right={
              <Switch value={autoPlay} onValueChange={setAutoPlay}
                trackColor={{ true: COLORS.accent }} thumbColor="#fff" />
            }
          />
          <View style={styles.divider} />
          <SettingItem icon="🎥" label={t('quality')} value={t('qualityVal')} />
        </View>

        {/* About */}
        <Text style={styles.settingGroup}>{t('about')}</Text>
        <View style={styles.settingCard}>
          <SettingItem icon="ℹ️" label={t('version')} value="1.0.0" />
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setShowRights(true)}>
            <SettingItem icon="🛡️" label={t('rights')} value="RDW Store © 2025"
              right={<Text style={{ color: COLORS.text3, fontSize: 16 }}>›</Text>}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <SettingItem icon="⚡" label="Powered by" value="RDW Store" />
        </View>

        <Footer />
      </ScrollView>

      {/* Rights Modal */}
      <Modal visible={showRights} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🛡️ {t('rights')}</Text>
            <Text style={[styles.modalBody, isRTL && { textAlign: 'right' }]}>
              {t('rightsDetail')}
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowRights(false)}>
              <Text style={styles.modalBtnText}>
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── DETAIL SCREEN ───────────────────────────────────────────
function DetailScreen({ route, navigation }) {
  const { id, title } = route.params;
  const { t, lang, isRTL } = useApp();
  const { data, loading, error, refetch } = useFetch(API_SERIES(id));
  const [playerUrl, setPlayerUrl] = useState(null);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator color={COLORS.accent} size="large" />
        <Text style={[styles.text2, { marginTop: 12 }]}>{t('loading')}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={{ color: COLORS.danger, marginBottom: 12 }}>{t('error')}</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>{t('retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const series = data || {};
  const episodes = series.episodes || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()}
          style={[styles.backBtn, isRTL && { alignSelf: 'flex-end' }]}>
          <Text style={styles.backText}>{isRTL ? '→ رجوع' : '← Back'}</Text>
        </TouchableOpacity>

        {/* Poster */}
        <View style={styles.detailPosterWrap}>
          {series.poster
            ? <Image source={{ uri: series.poster }} style={styles.detailPoster} resizeMode="cover" />
            : <View style={[styles.detailPoster, styles.cardPlaceholder]}>
                <Text style={{ fontSize: 60 }}>🎬</Text>
              </View>
          }
          <View style={styles.heroGradient} />
        </View>

        <View style={{ padding: 16 }}>
          <Text style={[styles.detailTitle, isRTL && { textAlign: 'right' }]}>
            {series.title || series.name || title}
          </Text>
          <View style={[styles.detailMeta, isRTL && styles.rowReverse]}>
            {series.year && <Text style={styles.detailMetaChip}>{series.year}</Text>}
            {series.category && <Text style={styles.detailMetaChip}>{series.category}</Text>}
            {series.rating && <Text style={styles.detailMetaChip}>⭐ {series.rating}</Text>}
          </View>
          {series.description && (
            <Text style={[styles.detailDesc, isRTL && { textAlign: 'right' }]}>
              {series.description}
            </Text>
          )}

          {/* Episodes */}
          {episodes.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
                {t('episodes')} ({episodes.length})
              </Text>
              {episodes.map((ep, idx) => (
                <TouchableOpacity
                  key={ep.id || idx}
                  style={[styles.episodeItem, isRTL && styles.rowReverse]}
                  onPress={() => setPlayerUrl(ep.url || ep.stream_url)}
                  activeOpacity={0.75}
                >
                  <View style={styles.epNumber}>
                    <Text style={styles.epNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.epTitle, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
                      {ep.title || `${t('episode')} ${idx + 1}`}
                    </Text>
                    {ep.duration && (
                      <Text style={styles.epMeta}>{ep.duration}</Text>
                    )}
                  </View>
                  <Text style={styles.playBtn}>▶</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
        <Footer />
      </ScrollView>

      {/* Video Player Modal */}
      {playerUrl && (
        <Modal visible={!!playerUrl} animationType="slide">
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Video
              source={{ uri: playerUrl }}
              style={{ flex: 1 }}
              controls
              resizeMode="contain"
              onError={(e) => Alert.alert('Error', 'Cannot play this video')}
            />
            <TouchableOpacity
              style={styles.closePlayer}
              onPress={() => setPlayerUrl(null)}
            >
              <Text style={styles.closePlayerText}>✕</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// ─── CATEGORY LIST SCREEN ────────────────────────────────────
function CategoryListScreen({ route, navigation }) {
  const { category } = route.params;
  const { lang, isRTL } = useApp();
  const { data, loading, error, refetch } = useFetch(API_BASE);
  const cat = CATEGORIES.find(c => c.key === category);
  const label = lang === 'ar' ? cat?.labelAr : cat?.labelEn;

  let items = [];
  if (data) {
    items = Array.isArray(data)
      ? data.filter(i => i.category?.toLowerCase() === category)
      : (data[category] || []);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.screenHeader, isRTL && styles.rowReverse]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginEnd: 12 }}>
          <Text style={{ color: COLORS.accent, fontSize: 20 }}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{cat?.emoji} {label}</Text>
      </View>

      {loading && <ActivityIndicator color={COLORS.accent} style={{ marginTop: 32 }} size="large" />}
      {error && (
        <TouchableOpacity onPress={refetch} style={[styles.retryBtn, { alignSelf: 'center', marginTop: 24 }]}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={loading ? Array(6).fill(null) : items}
        keyExtractor={(_, i) => String(i)}
        numColumns={3}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
        renderItem={({ item }) =>
          loading
            ? <SkeletonCard />
            : <MediaCard item={item} onPress={(i) => navigation.navigate('Detail', { id: i.id, title: i.title || i.name })} />
        }
        ListFooterComponent={<Footer />}
      />
    </SafeAreaView>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  const { t } = useApp();
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Powered by <Text style={{ color: COLORS.accent }}>RDW Store</Text>
      </Text>
      <Text style={styles.footerSub}>{t('allRights')}</Text>
    </View>
  );
}

// ─── TAB NAVIGATOR ───────────────────────────────────────────
const Tab = createBottomTabNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CatsMain" component={CategoriesScreen} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { t, isRTL } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.text3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
      }}
    >
      <Tab.Screen name="Home"       component={HomeStack}
        options={{ tabBarLabel: t('home'),       tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
      <Tab.Screen name="Categories" component={CategoriesStack}
        options={{ tabBarLabel: t('categories'), tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗂️</Text> }} />
      <Tab.Screen name="Search"     component={SearchStack}
        options={{ tabBarLabel: t('search'),     tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔍</Text> }} />
      <Tab.Screen name="Settings"   component={SettingsScreen}
        options={{ tabBarLabel: t('settings'),   tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text> }} />
    </Tab.Navigator>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea:         { flex: 1, backgroundColor: COLORS.bg },
  center:           { justifyContent: 'center', alignItems: 'center' },
  row:              { flexDirection: 'row', alignItems: 'center' },
  rowReverse:       { flexDirection: 'row-reverse', alignItems: 'center' },

  /* Header */
  homeHeader:       { padding: 16, paddingBottom: 8 },
  logoText:         { fontSize: 24, fontWeight: '900', color: COLORS.accent, letterSpacing: 3 },
  poweredBy:        { fontSize: 9, color: COLORS.text3, letterSpacing: 1, marginTop: 1 },
  notifBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.card,
                      borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  screenHeader:     { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 8 },
  screenTitle:      { fontSize: 20, fontWeight: '800', color: COLORS.text },

  /* Hero */
  heroBanner:       { margin: 16, height: 200, borderRadius: 18, overflow: 'hidden' },
  heroGradient:     { ...StyleSheet.absoluteFillObject,
                      backgroundColor: 'transparent',
                      background: 'linear-gradient(to top, rgba(11,14,20,0.95), transparent)' },
  heroContent:      { position: 'absolute', bottom: 14, left: 14, right: 14 },
  heroBadge:        { backgroundColor: COLORS.accent, alignSelf: 'flex-start',
                      paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  heroBadgeText:    { color: '#000', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  heroTitle:        { fontSize: 18, fontWeight: '800', color: COLORS.text },
  heroMeta:         { fontSize: 11, color: COLORS.text2, marginTop: 2 },

  /* Chips */
  chip:             { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
                      borderWidth: 1, borderColor: COLORS.border, marginEnd: 8 },
  chipActive:       { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText:         { fontSize: 11, color: COLORS.text2, fontWeight: '600' },
  chipTextActive:   { color: '#000' },

  /* Sections */
  sectionHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                      paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle:     { fontSize: 15, fontWeight: '700', color: COLORS.text },
  seeAll:           { fontSize: 11, color: COLORS.accent },

  /* Cards */
  cardImgWrap:      { width: 110, height: 160, borderRadius: 10, overflow: 'hidden',
                      backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  cardImg:          { width: '100%', height: '100%' },
  cardPlaceholder:  { alignItems: 'center', justifyContent: 'center' },
  cardBadge:        { position: 'absolute', bottom: 6, left: 6,
                      backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 6, paddingVertical: 2,
                      borderRadius: 4 },
  cardBadgeText:    { fontSize: 8, color: COLORS.accent, fontWeight: '700' },
  cardTitle:        { fontSize: 10, color: COLORS.text2, marginTop: 5, textAlign: 'center', lineHeight: 14 },

  /* Categories screen */
  catCard:          { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
                      borderRadius: 16, padding: 16, alignItems: 'center' },
  catCardLabel:     { fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 4 },
  catCardCount:     { fontSize: 9, color: COLORS.text3, marginTop: 3 },

  /* Search */
  searchBar:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16,
                      backgroundColor: COLORS.bg2, borderWidth: 1, borderColor: COLORS.border,
                      borderRadius: 14, paddingHorizontal: 12, marginBottom: 12, height: 46 },
  searchIcon:       { fontSize: 16, marginEnd: 8 },
  searchInput:      { flex: 1, color: COLORS.text, fontSize: 13 },
  emptyState:       { alignItems: 'center', paddingVertical: 60 },
  emptyText:        { color: COLORS.text3, fontSize: 13, textAlign: 'center', maxWidth: 240 },

  /* Result items */
  resultItem:       { flexDirection: 'row', paddingVertical: 12,
                      borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: 'center' },
  resultThumb:      { width: 60, height: 85, borderRadius: 8, backgroundColor: COLORS.card,
                      alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  resultTitle:      { fontSize: 13, fontWeight: '700', color: COLORS.text },
  resultMeta:       { fontSize: 10, color: COLORS.text2, marginTop: 3 },
  resultRating:     { fontSize: 10, color: COLORS.accent, marginTop: 4 },

  /* Settings */
  profileCard:      { margin: 16, backgroundColor: COLORS.card, borderRadius: 16,
                      borderWidth: 1, borderColor: COLORS.border,
                      padding: 16, flexDirection: 'row', alignItems: 'center' },
  profileAvatar:    { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.bg3,
                      alignItems: 'center', justifyContent: 'center' },
  profileName:      { fontSize: 16, fontWeight: '800', color: COLORS.text },
  profileSub:       { fontSize: 11, color: COLORS.accent, marginTop: 2 },
  settingGroup:     { fontSize: 11, color: COLORS.text3, marginHorizontal: 16,
                      marginBottom: 8, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' },
  settingCard:      { marginHorizontal: 16, backgroundColor: COLORS.card,
                      borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  settingItem:      { flexDirection: 'row', alignItems: 'center', padding: 14 },
  settingIconWrap:  { width: 36, height: 36, borderRadius: 9,
                      backgroundColor: 'rgba(0,212,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  settingLabel:     { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  settingValue:     { fontSize: 10, color: COLORS.text2, marginTop: 1 },
  divider:          { height: 1, backgroundColor: COLORS.border, marginStart: 62 },
  langPill:         { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8,
                      borderWidth: 1, borderColor: COLORS.accent },
  langPillText:     { color: COLORS.accent, fontSize: 11, fontWeight: '700' },

  /* Detail */
  backBtn:          { margin: 16, alignSelf: 'flex-start' },
  backText:         { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  detailPosterWrap: { height: 260, backgroundColor: COLORS.card },
  detailPoster:     { width: '100%', height: '100%' },
  detailTitle:      { fontSize: 22, fontWeight: '900', color: COLORS.text, marginBottom: 8 },
  detailMeta:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  detailMetaChip:   { backgroundColor: COLORS.bg3, color: COLORS.accent, fontSize: 10,
                      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
                      borderWidth: 1, borderColor: COLORS.border },
  detailDesc:       { fontSize: 13, color: COLORS.text2, lineHeight: 20 },
  episodeItem:      { flexDirection: 'row', alignItems: 'center',
                      backgroundColor: COLORS.card, borderRadius: 10, padding: 12,
                      marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  epNumber:         { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.bg3,
                      alignItems: 'center', justifyContent: 'center' },
  epNumberText:     { color: COLORS.accent, fontSize: 13, fontWeight: '700' },
  epTitle:          { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  epMeta:           { fontSize: 10, color: COLORS.text2 },
  playBtn:          { color: COLORS.accent, fontSize: 18 },
  closePlayer:      { position: 'absolute', top: 44, right: 16, width: 36, height: 36,
                      borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)',
                      alignItems: 'center', justifyContent: 'center' },
  closePlayerText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  retryBtn:         { backgroundColor: COLORS.accent, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryBtnText:     { color: '#000', fontWeight: '700', fontSize: 13 },
  text2:            { color: COLORS.text2, fontSize: 13 },

  /* Modal */
  modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalCard:        { backgroundColor: COLORS.bg2, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                      padding: 24, borderTopWidth: 1, borderColor: COLORS.border },
  modalTitle:       { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  modalBody:        { fontSize: 13, color: COLORS.text2, lineHeight: 22 },
  modalBtn:         { marginTop: 20, backgroundColor: COLORS.accent, borderRadius: 12,
                      padding: 14, alignItems: 'center' },
  modalBtnText:     { color: '#000', fontWeight: '800', fontSize: 14 },

  /* Tab Bar */
  tabBar:           { backgroundColor: COLORS.bg2, borderTopColor: COLORS.border,
                      borderTopWidth: 1, height: 64, paddingTop: 6 },

  /* Footer */
  footer:           { alignItems: 'center', padding: 20, paddingTop: 12 },
  footerText:       { fontSize: 11, color: COLORS.text3 },
  footerSub:        { fontSize: 9, color: COLORS.text3, marginTop: 3 },
});
