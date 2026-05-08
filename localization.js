/**
 * ============================================================
 *  RDW TV — Localization File
 *  Powered by RDW Store
 *  © 2025 Rimawi Digital World. All Rights Reserved.
 * ============================================================
 *
 *  Usage:
 *    import { STRINGS } from './localization';
 *    const t = (key) => STRINGS[currentLang][key];
 */

export const LANGUAGES = {
  ar: { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  en: { code: 'en', name: 'English', dir: 'ltr', flag: '🇬🇧' },
};

export const STRINGS = {
  /* ─── Arabic ─────────────────────────────── */
  ar: {
    /* App Meta */
    appName:            'RDW TV',
    appTagline:         'بوابتك للترفيه العربي والعالمي',
    poweredBy:          'مقدم من RDW Store',
    allRights:          'جميع الحقوق محفوظة © 2025',

    /* Navigation */
    home:               'الرئيسية',
    categories:         'التصنيفات',
    search:             'بحث',
    settings:           'الإعدادات',

    /* Home */
    trending:           '🔥 الأكثر مشاهدة',
    newToday:           '✨ جديد اليوم',
    recommended:        '⭐ موصى به',
    continueWatching:   'أكمل المشاهدة',
    seeAll:             'عرض الكل',
    featured:           'مميز',

    /* Categories */
    ramadan:            'رمضان',
    gulf:               'خليجي',
    arabic:             'عربي',
    turkish:            'تركي',
    foreign:            'أجنبي',
    movies:             'أفلام',

    /* Search */
    searchHint:         'ابحث عن مسلسل أو فيلم...',
    searchEmpty:        'اكتب للبحث في آلاف المسلسلات',
    noResults:          'لا توجد نتائج لـ',
    searchResults:      'نتائج البحث',
    recentSearches:     'عمليات البحث الأخيرة',
    clearHistory:       'مسح السجل',

    /* Detail */
    episodes:           'الحلقات',
    episode:            'حلقة',
    season:             'موسم',
    play:               '▶ مشاهدة',
    download:           '⬇ تحميل',
    share:              '↗ مشاركة',
    addToFav:           '♡ المفضلة',
    removeFromFav:      '♥ إزالة',
    description:        'القصة',
    cast:               'طاقم العمل',
    director:           'المخرج',
    year:               'السنة',
    rating:             'التقييم',
    duration:           'المدة',
    episodeCount:       'عدد الحلقات',

    /* Player */
    playerError:        'لا يمكن تشغيل هذا الفيديو',
    playerLoading:      'جاري التحميل...',
    quality:            'الجودة',
    qualityAuto:        'تلقائي',
    quality1080:        '1080p - Full HD',
    quality720:         '720p - HD',
    quality480:         '480p',
    speed:              'سرعة التشغيل',
    speedNormal:        'عادي',

    /* Settings */
    appearance:         'المظهر',
    language:           'اللغة',
    currentLang:        'العربية',
    switchLang:         'English',
    darkMode:           'الوضع الداكن',
    themeCyber:         'Cyber Dark',
    notifications:      'الإشعارات',
    newEpisodes:        'حلقات جديدة',
    newSeries:          'مسلسلات جديدة',
    autoPlay:           'تشغيل تلقائي',
    videoQuality:       'جودة الفيديو',
    clearCache:         'مسح الكاش',
    dataSaver:          'توفير البيانات',

    /* About */
    about:              'عن التطبيق',
    version:            'الإصدار',
    rights:             'حقوق الملكية',
    rightsDetail:       'جميع محتويات هذا التطبيق محمية بموجب قوانين حقوق الملكية الفكرية الدولية. لا يجوز إعادة نشر أي محتوى بدون إذن صريح من RDW Store.\n\nRDW Store © 2025 - Rimawi Digital World\nجميع الحقوق محفوظة.',
    privacy:            'سياسة الخصوصية',
    terms:              'الشروط والأحكام',
    contactUs:          'تواصل معنا',
    rateApp:            'قيّم التطبيق',

    /* Errors */
    networkError:       'لا يوجد اتصال بالإنترنت',
    serverError:        'حدث خطأ في الخادم، أعد المحاولة',
    loading:            'جاري التحميل...',
    retry:              'إعادة المحاولة',
    pullRefresh:        'اسحب للتحديث',

    /* Misc */
    ok:                 'موافق',
    cancel:             'إلغاء',
    close:              'إغلاق',
    save:               'حفظ',
    delete:             'حذف',
    edit:               'تعديل',
    back:               'رجوع →',
    next:               'التالي',
    prev:               'السابق',
    watchNow:           'شاهد الآن',
    new:                'جديد',
    hot:                'رائج',
    exclusive:          'حصري',
  },

  /* ─── English ────────────────────────────── */
  en: {
    /* App Meta */
    appName:            'RDW TV',
    appTagline:         'Your Gateway to Arabic & World Entertainment',
    poweredBy:          'Powered by RDW Store',
    allRights:          'All Rights Reserved © 2025',

    /* Navigation */
    home:               'Home',
    categories:         'Categories',
    search:             'Search',
    settings:           'Settings',

    /* Home */
    trending:           '🔥 Trending Now',
    newToday:           '✨ New Today',
    recommended:        '⭐ Recommended',
    continueWatching:   'Continue Watching',
    seeAll:             'See All',
    featured:           'Featured',

    /* Categories */
    ramadan:            'Ramadan',
    gulf:               'Gulf',
    arabic:             'Arabic',
    turkish:            'Turkish',
    foreign:            'Foreign',
    movies:             'Movies',

    /* Search */
    searchHint:         'Search series, movies...',
    searchEmpty:        'Start typing to search thousands of titles',
    noResults:          'No results found for',
    searchResults:      'Search Results',
    recentSearches:     'Recent Searches',
    clearHistory:       'Clear History',

    /* Detail */
    episodes:           'Episodes',
    episode:            'Episode',
    season:             'Season',
    play:               '▶ Watch Now',
    download:           '⬇ Download',
    share:              '↗ Share',
    addToFav:           '♡ Favorites',
    removeFromFav:      '♥ Remove',
    description:        'Description',
    cast:               'Cast',
    director:           'Director',
    year:               'Year',
    rating:             'Rating',
    duration:           'Duration',
    episodeCount:       'Episodes',

    /* Player */
    playerError:        'Cannot play this video',
    playerLoading:      'Loading...',
    quality:            'Quality',
    qualityAuto:        'Auto',
    quality1080:        '1080p - Full HD',
    quality720:         '720p - HD',
    quality480:         '480p',
    speed:              'Playback Speed',
    speedNormal:        'Normal',

    /* Settings */
    appearance:         'Appearance',
    language:           'Language',
    currentLang:        'English',
    switchLang:         'عربي',
    darkMode:           'Dark Mode',
    themeCyber:         'Cyber Dark',
    notifications:      'Notifications',
    newEpisodes:        'New Episodes',
    newSeries:          'New Series',
    autoPlay:           'Auto Play',
    videoQuality:       'Video Quality',
    clearCache:         'Clear Cache',
    dataSaver:          'Data Saver',

    /* About */
    about:              'About',
    version:            'Version',
    rights:             'Rights Reserved',
    rightsDetail:       'All content in this application is protected under international intellectual property laws. Reproduction of any content without explicit permission from RDW Store is prohibited.\n\nRDW Store © 2025 - Rimawi Digital World\nAll Rights Reserved.',
    privacy:            'Privacy Policy',
    terms:              'Terms & Conditions',
    contactUs:          'Contact Us',
    rateApp:            'Rate the App',

    /* Errors */
    networkError:       'No internet connection',
    serverError:        'Server error, please retry',
    loading:            'Loading...',
    retry:              'Retry',
    pullRefresh:        'Pull to refresh',

    /* Misc */
    ok:                 'OK',
    cancel:             'Cancel',
    close:              'Close',
    save:               'Save',
    delete:             'Delete',
    edit:               'Edit',
    back:               '← Back',
    next:               'Next',
    prev:               'Previous',
    watchNow:           'Watch Now',
    new:                'New',
    hot:                'Hot',
    exclusive:          'Exclusive',
  },
};

export default STRINGS;
