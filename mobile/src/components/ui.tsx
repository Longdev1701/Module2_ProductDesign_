import React from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, RefreshControl, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, FONT_SIZE } from '../lib/theme';

// ─── Loading Skeleton ───────────────────────────────────────────────────────
export function Skeleton({ height = 48, width = '100%', style }: {
  height?: number; width?: number | string; style?: object;
}) {
  return (
    <View style={[{ height, backgroundColor: C.surfaceDim, borderRadius: 10, opacity: 0.7 }, style as any]} />
  );
}

// ─── Screen Shell (header + scroll) ─────────────────────────────────────────
export function ScreenShell({
  title, subtitle, children, loading, onRefresh, refreshing, headerRight,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  headerRight?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={ss.root}>
      {/* Header with notch padding */}
      <View style={[ss.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={{ flex: 1 }}>
          <Text style={ss.headerTitle}>{title}</Text>
          {subtitle ? <Text style={ss.headerSub}>{subtitle}</Text> : null}
        </View>
        {headerRight}
      </View>

      {/* Content */}
      <ScrollView
        style={ss.scroll}
        contentContainerStyle={ss.scrollContent}
        refreshControl={
          onRefresh
            ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={C.gold} />
            : undefined
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={80} />
            <Skeleton height={80} />
            <Skeleton height={80} />
          </View>
        ) : children}
      </ScrollView>
    </View>
  );
}

// ─── Error Banner ────────────────────────────────────────────────────────────
export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={eb.box}>
      <Text style={eb.msg}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={eb.btn}>
          <Text style={eb.btnText}>Thử lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ title, desc, action, onAction }: {
  title: string; desc?: string; action?: string; onAction?: () => void;
}) {
  return (
    <View style={em.box}>
      <Text style={em.title}>{title}</Text>
      {desc ? <Text style={em.desc}>{desc}</Text> : null}
      {action && onAction && (
        <TouchableOpacity onPress={onAction} style={em.btn}>
          <Text style={em.btnText}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
const BATCH_STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  DRAFT:                { label: 'Nháp',             bg: C.slateBg,   text: C.slate   },
  COLLECTING_DOCUMENTS: { label: 'Thu thập hồ sơ',   bg: C.amberBg,   text: C.amber   },
  READY_FOR_CHECK:      { label: 'Sẵn sàng kiểm',    bg: C.blueBg,    text: C.blue    },
  CHECKING:             { label: 'Đang kiểm định',   bg: C.amberBg,   text: C.amber   },
  ACTION_REQUIRED:      { label: 'Cần xử lý',        bg: C.roseBg,    text: C.rose    },
  COMPLIANT:            { label: 'Tuân thủ',          bg: C.emeraldBg, text: C.emerald },
  NON_COMPLIANT:        { label: 'Vi phạm',           bg: C.roseBg,    text: C.rose    },
  EXPIRED:              { label: 'Hết hạn',           bg: C.slateBg,   text: C.slate   },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = BATCH_STATUS_MAP[status] ?? { label: status, bg: C.slateBg, text: C.slate };
  return (
    <View style={[bd.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[bd.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── KeyBadge (4 Khóa PHYTO / LAB / CO / PKG) ───────────────────────────────
export function KeyBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={[kb.badge, { backgroundColor: active ? C.emeraldBg : C.roseBg, borderColor: active ? C.emerald : C.rose }]}>
      <Text style={[kb.text, { color: active ? C.emerald : C.rose }]}>{label}</Text>
    </View>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[cd.card, style]}>{children}</View>;
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function PrimaryButton({ label, onPress, loading, disabled }: {
  label: string; onPress: () => void; loading?: boolean; disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[pb.btn, (loading || disabled) && { opacity: 0.55 }]}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" size="small" />
        : <Text style={pb.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.surface },
  header:      { paddingTop: 16, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.navy, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
  headerSub:   { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2, letterSpacing: 0.3 },
  scroll:      { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 32, gap: 10 },
});

const eb = StyleSheet.create({
  box: { backgroundColor: C.roseBg, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderWidth: 1, borderColor: '#FECDD3' },
  msg: { flex: 1, fontSize: FONT_SIZE.sm, color: C.rose, fontWeight: '600' },
  btn: { backgroundColor: C.rose, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: FONT_SIZE.xs, fontWeight: '700' },
});

const em = StyleSheet.create({
  box: { alignItems: 'center', padding: 32, gap: 8 },
  title: { fontSize: FONT_SIZE.md, fontWeight: '700', color: C.textPrimary, textAlign: 'center' },
  desc: { fontSize: FONT_SIZE.sm, color: C.textSecondary, textAlign: 'center' },
  btn: { marginTop: 8, backgroundColor: C.navyMid, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  btnText: { color: '#fff', fontSize: FONT_SIZE.sm, fontWeight: '700' },
});

const bd = StyleSheet.create({
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  text:  { fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 0.3 },
});

const kb = StyleSheet.create({
  badge: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 },
  text:  { fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
});

const cd = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.borderFaint, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
});

const pb = StyleSheet.create({
  btn:   { backgroundColor: C.navyMid, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#fff', fontSize: FONT_SIZE.base, fontWeight: '800', letterSpacing: 0.3 },
});
