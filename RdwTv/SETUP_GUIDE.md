# 📱 RDW TV — دليل الإعداد والبناء الكامل
**Powered by RDW Store · © 2025 Rimawi Digital World**

---

## 🛠️ المتطلبات الأساسية

| المتطلب | الإصدار المطلوب |
|--------|---------------|
| Node.js | >= 18 |
| React Native CLI | Latest |
| Xcode (للـ IPA) | >= 15 |
| CocoaPods | >= 1.14 |
| Ruby | >= 3.0 |

---

## ⚡ الإعداد السريع

### 1. تثبيت الـ dependencies

```bash
# استنسخ أو أنشئ المجلد
mkdir RDW_TV && cd RDW_TV

# ثبّت React Native CLI
npm install -g react-native-cli

# نسخ الملفات (App.js + localization.js + package.json)
# ثم نفّذ:
npm install

# للـ iOS فقط:
cd ios && pod install && cd ..
```

### 2. تشغيل التطبيق (Testing)

```bash
# Android
npx react-native run-android

# iOS Simulator
npx react-native run-ios

# iOS على جهاز حقيقي
npx react-native run-ios --device "iPhone Name"
```

---

## 📦 بناء IPA للتوزيع

### الطريقة 1: Xcode (الموصى بها)

```bash
# 1. فتح مشروع Xcode
open ios/RdwTv.xcworkspace

# 2. في Xcode:
#    - اختر جهازك الحقيقي أو "Any iOS Device"
#    - Product → Archive
#    - بعد اكتمال الـ Archive → Distribute App
#    - اختر "Ad Hoc" أو "App Store Connect"
#    - Export → ستحصل على ملف .ipa
```

### الطريقة 2: CLI Build

```bash
cd ios && xcodebuild \
  -workspace RdwTv.xcworkspace \
  -scheme RdwTv \
  -configuration Release \
  -archivePath ./build/RdwTv.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath ./build/RdwTv.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath ./build/IPA
```

### الطريقة 3: بدون Apple Developer (Sideload)

```bash
# استخدم AltStore أو Sideloadly أو TrollStore
# 1. بناء Debug IPA:
npx react-native run-ios --configuration Debug --device

# 2. أو استخدم Xcode → Product → Build For → Running
# 3. اسحب الـ .app من DerivedData وضمّها في IPA يدوياً
```

---

## 🔧 ملف ExportOptions.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>ad-hoc</string>  <!-- أو app-store-connect -->
  <key>teamID</key>
  <string>YOUR_TEAM_ID</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>stripSwiftSymbols</key>
  <true/>
  <key>uploadBitcode</key>
  <false/>
  <key>compileBitcode</key>
  <false/>
</dict>
</plist>
```

---

## 🎨 تخصيص التطبيق

### تغيير اسم التطبيق
```
ios/RdwTv/Info.plist → CFBundleDisplayName → "RDW TV"
android/app/src/main/res/values/strings.xml → app_name → "RDW TV"
```

### تغيير الأيقونة
```bash
# ضع أيقونة 1024×1024 في المجلد
# ثم استخدم:
npx react-native-asset
# أو أداة: https://appicon.co
```

### تغيير Bundle ID
```
ios/RdwTv.xcodeproj → Signing & Capabilities → Bundle Identifier
→ com.rdwstore.rdwtv
```

---

## 📡 API Reference

| الـ Endpoint | الوصف |
|-------------|-------|
| `GET https://api.dfkz.site/alooy/` | كل المسلسلات |
| `GET https://api.dfkz.site/alooy/?q={query}` | بحث |
| `GET https://api.dfkz.site/alooy/series.php?id={id}` | تفاصيل + حلقات |

### بنية البيانات المتوقعة

```json
// GET /
[
  {
    "id": "123",
    "title": "الهيبة",
    "poster": "https://...",
    "category": "arabic",
    "year": "2025",
    "rating": "8.5"
  }
]

// GET /series.php?id=123
{
  "id": "123",
  "title": "الهيبة",
  "poster": "https://...",
  "description": "قصة الدراما...",
  "category": "arabic",
  "year": "2025",
  "episodes": [
    { "id": "ep1", "title": "الحلقة 1", "url": "https://stream.m3u8", "duration": "45 دقيقة" }
  ]
}
```

---

## 🌐 وصف التطبيق للمتجر

### عربي
**RDW TV** هو وجهتك الأولى لمتابعة أحدث المسلسلات والأفلام.
استمتع بتجربة مشاهدة فريدة مع دعم كامل للغة العربية والإنجليزية،
وتصميم عصري وسريع يوفر لك كل ما تحتاجه من دراما رمضان،
مسلسلات تركية، أجنبية، وأفلام حصرية.
التطبيق مقدم لكم من **متجر RDW Store** لضمان أفضل جودة وأداء.

**المميزات:**
- 🌙 مسلسلات رمضانية، خليجية، عربية، تركية وأجنبية
- 🎬 أفلام حصرية عالية الجودة
- 🌐 دعم كامل للغتين العربية والإنجليزية (RTL/LTR)
- 🔍 بحث فوري في آلاف العناوين
- 📱 تصميم داكن عصري وسهل الاستخدام
- ⚡ تشغيل سريع وسلس

---

### English
**RDW TV** is your ultimate destination for the latest series and movies.
Enjoy a unique viewing experience with full Arabic and English support.
Featuring a sleek, fast design, it brings you everything from Ramadan dramas
to Turkish and Foreign series, plus exclusive movies.
Brought to you by **RDW Store** for premium quality and performance.

**Features:**
- 🌙 Ramadan, Gulf, Arabic, Turkish & Foreign series
- 🎬 Exclusive high-quality movies
- 🌐 Full bilingual support Arabic & English (RTL/LTR)
- 🔍 Real-time search across thousands of titles
- 📱 Sleek dark UI with smooth navigation
- ⚡ Fast & smooth streaming

---

## 📋 App Store Metadata

| Field | Value |
|-------|-------|
| App Name | RDW TV |
| Bundle ID | com.rdwstore.rdwtv |
| Category | Entertainment |
| Age Rating | 12+ |
| Version | 1.0.0 |
| Copyright | © 2025 Rimawi Digital World |
| Developer | RDW Store |
| Keywords AR | مسلسلات, أفلام, تركي, رمضان, عربي, بث مباشر |
| Keywords EN | Arabic series, Turkish drama, streaming, movies, Ramadan |

---

**© 2025 Rimawi Digital World — Powered by RDW Store**
