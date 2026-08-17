# Technical guidelines — React Native

Best practices bắt buộc follow khi code React Native. AI đọc file này trước khi tạo/sửa component.

---

## 🚀 Performance & rendering

- **List dài** → LUÔN dùng `FlatList` / `SectionList`, KHÔNG dùng `ScrollView + .map()`
  - `keyExtractor` return unique + stable ID (không dùng index)
  - `getItemLayout` khi item height fixed → skip measurement, scroll nhanh hơn
  - Item component wrap `React.memo` nếu list > 20 items
  - `windowSize={10}`, `maxToRenderPerBatch={10}` khi tune
- **List rất dài (>1000)** → cân nhắc `FlashList` từ `@shopify/flash-list`
- **`useMemo`** cho:
  - Compute nặng (> 1ms): filter/sort/reduce list
  - Object/array truyền xuống `React.memo` child hoặc Context Provider
  - Dep phải stable
- **`useCallback`** cho function truyền xuống memoized child hoặc dùng làm dep của effect
- **Tránh inline** khi truyền tới memoized component:
  - ❌ `<Item onPress={() => handle(id)} style={{ padding: 10 }} />`
  - ✅ `useCallback` + `StyleSheet.create()` extract
- **`StyleSheet.create()` OUTSIDE component** (top-level) — không tạo trong render body

---

## 🎨 UI patterns

- **Text**: MỌI text phải wrap `<Text>` (không như HTML) — RN sẽ throw error
- **Flexbox first**: hiếm khi cần `position: absolute`. `flex: 1` để fill parent
- **Padding vs margin**:
  - Padding = khoảng cách trong (parent → children)
  - Margin = khoảng cách ngoài (component-to-component)
  - Chọn 1 pattern nhất quán, tránh mix
- **Image**: dùng `expo-image` thay `Image` — có cache, blurhash placeholder, transition mượt
- **`numberOfLines={N}` + `ellipsizeMode="tail"`** cho text overflow
- **Touch target ≥ 44dp** (Apple) / **48dp** (Google) — `hitSlop={8}` nếu icon nhỏ
- **Loading states 4 phase**: `idle | loading | error | success` (không dùng boolean isLoading)
- **Empty state component** — không để screen trắng khi list rỗng

---

## 📱 Layout & keyboard

- **`SafeAreaProvider` + `useSafeAreaInsets()`** — tùy chỉnh padding theo notch/dynamic island
- **`KeyboardAvoidingView`** wrap mọi screen có form input
  - iOS: `behavior="padding"`
  - Android: `behavior="height"` hoặc manifest `windowSoftInputMode="adjustResize"`
- **`ScrollView keyboardShouldPersistTaps="handled"`** — cho phép tap button khi keyboard mở

---

## 🔄 State & effects

- **State cục bộ trước**: nếu chỉ 1 component dùng → `useState` local
- **Lift up** chỉ khi 2+ children cần share
- **Context cho cross-cutting** (theme, auth, i18n) — value phải wrap `useMemo` tránh re-render cascade
- **KHÔNG Redux/Zustand** cho small-medium app — services + hooks đủ
- **`useEffect` cleanup**: return function để cleanup subscription/timer/listener
- **Async trong effect**: KHÔNG `useEffect(async () => ...)` — wrap `(async () => {})()`
- **Deps array đầy đủ** — ESLint plugin `react-hooks/exhaustive-deps` warn stale closure
- **KHÔNG mutate state trong render** — luôn setState với new object/array

---

## 📝 Forms

- **Controlled input**: `<TextInput value={x} onChangeText={setX} />`
- **Validate on submit**, không on-every-keystroke (trừ email format check)
- **Focus next input**: `ref` + `onSubmitEditing={() => nextRef.current?.focus()}`
- **Debounce search input**: 300-500ms trước khi fire API call

---

## 🌐 Networking

- **Timeout cho fetch** — dùng AbortController (fetch không có timeout default)
- **Handle 4 case**: success / 4xx client error / 5xx server error / network error
- **Offline detection**: `@react-native-community/netinfo` listener → queue request
- **Retry** on transient error (5xx, network) với exponential backoff — không retry 4xx
- **Loading + error UI state** — không để user không biết gì đang xảy ra

---

## 💾 Storage

- **AsyncStorage async** → LUÔN `await`, không fire-and-forget nếu cần confirm
- **MMKV sync** → dùng khi cần blocking read (VD widget bridge)
- **JSON parse/stringify null-safe** — wrap try/catch, corrupt data → reset default
- **Schema migration**: khi thêm field mới, provide default value trong read logic

---

## 🚨 Errors

- **Global error handler**: `ErrorUtils.setGlobalHandler` bắt uncaught JS errors → log
- **Error boundary component** wrap top-level screens
- **User-facing message**: friendly ("Có lỗi, thử lại nha"), KHÔNG expose stack trace
- **Log errors** qua Sentry / custom logger
