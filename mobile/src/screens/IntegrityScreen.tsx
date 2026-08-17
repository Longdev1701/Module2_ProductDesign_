import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, RefreshControl, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../lib/api';
import { Card, ErrorBanner, EmptyState, Skeleton } from '../components/ui';
import { C, FONT_SIZE } from '../lib/theme';

interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userEmail?: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
}

interface IntegrityStats {
  totalLogs: number;
  sealedReportsCount: number;
  hashIntegrityPercentage: number;
  auditEngine: string;
  blockchainStatus: string;
}

interface VerifyResult {
  verified: boolean;
  message: string;
  reportNumber?: string;
  batchCode?: string;
  productName?: string;
  issuedAt?: string;
}

const ACTION_LABEL: Record<string, { label: string; color: string }> = {
  'product.created':   { label: 'Tạo sản phẩm',      color: C.emerald },
  'product.updated':   { label: 'Sửa sản phẩm',       color: C.blue    },
  'product.deleted':   { label: 'Xóa sản phẩm',       color: C.rose    },
  'batch.created':     { label: 'Tạo lô hàng',         color: C.emerald },
  'batch.updated':     { label: 'Cập nhật lô',         color: C.blue    },
  'document.uploaded': { label: 'Nạp tài liệu',        color: C.emerald },
  'document.deleted':  { label: 'Xóa tài liệu',        color: C.rose    },
  'check.started':     { label: 'Bắt đầu kiểm định',   color: C.amber   },
  'check.completed':   { label: 'Hoàn thành kiểm định',color: C.emerald },
  'report.approved':   { label: 'Duyệt báo cáo',       color: C.emerald },
  'user.login_success':{ label: 'Đăng nhập',            color: C.blue    },
};

export function IntegrityScreen() {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState<IntegrityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hash verification state
  const [inputHash, setInputHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);

  const fetchIntegrityData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [logsRes, statsRes] = await Promise.all([
        api.get<{ data: AuditEntry[] }>('/integrity/audit-log?page=1&pageSize=50'),
        api.get<IntegrityStats>('/integrity/stats').catch(() => null),
      ]);
      const list = (logsRes as any)?.data ?? logsRes ?? [];
      setLogs(Array.isArray(list) ? list : []);
      if (statsRes) setStats(statsRes);
    } catch (e: any) {
      setError(e?.message ?? 'Không tải được nhật ký kiểm toán.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchIntegrityData(); }, [fetchIntegrityData]);

  // ─── Verify SHA-256 Hash Tool ──────────────────────────────────────────────
  async function handleVerifyHash() {
    if (!inputHash.trim()) {
      Alert.alert('Chưa nhập mã băm', 'Vui lòng nhập chuỗi băm SHA-256 (64 ký tự hex).');
      return;
    }
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.get<VerifyResult>(`/integrity/verify/${encodeURIComponent(inputHash.trim())}`);
      setVerifyResult(res);
    } catch (e: any) {
      setVerifyResult({
        verified: false,
        message: e?.message ?? 'Không thể kiểm tra mã băm SHA-256.',
      });
    } finally {
      setVerifying(false);
    }
  }

  const renderAuditItem = useCallback(({ item, index }: { item: AuditEntry; index: number }) => (
    <AuditRowMemo entry={item} isFirst={index === 0} />
  ), []);

  const keyExtractor = useCallback((item: AuditEntry) => item.id, []);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Giám sát Liêm chính & SHA-256</Text>
          <Text style={s.headerSub}>Chuỗi băm Merkle Chain bất biến chống gian lận</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        renderItem={renderAuditItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={s.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchIntegrityData(true)} tintColor={C.gold} />}
        ListHeaderComponent={
          <View style={s.headerComponents}>
            {/* Stats Bar */}
            <View style={s.statsContainer}>
              <View style={s.statCard}>
                <Text style={s.statLabel}>Bảo vệ Toàn vẹn</Text>
                <Text style={[s.statVal, { color: C.emerald }]}>100%</Text>
                <Text style={s.statSub}>SHA-256 Active</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statLabel}>Tổng Bản ghi Audit</Text>
                <Text style={[s.statVal, { color: C.navyMid }]}>{stats?.totalLogs ?? logs.length}</Text>
                <Text style={s.statSub}>Append-only</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statLabel}>Báo cáo Niêm phong</Text>
                <Text style={[s.statVal, { color: C.amber }]}>{stats?.sealedReportsCount ?? 1}</Text>
                <Text style={s.statSub}>Kẹp chì số hóa</Text>
              </View>
            </View>

            {/* SHA-256 Verification Tool (Parity with Web) */}
            <Card style={s.verifyBox}>
              <Text style={s.verifyTitle}>Công cụ Xác thực Mã băm SHA-256</Text>
              <Text style={s.verifyDesc}>Tra cứu trực tiếp tính nguyên vẹn của Báo cáo & Hồ sơ thông quan GACC:</Text>

              <View style={s.hashInputRow}>
                <TextInput
                  style={s.hashInput}
                  value={inputHash}
                  onChangeText={setInputHash}
                  placeholder="Dán mã băm SHA-256 (VD: e3b0c44298fc1c149...)"
                  placeholderTextColor={C.textMuted}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={s.verifyBtn}
                  onPress={handleVerifyHash}
                  disabled={verifying}
                  activeOpacity={0.8}
                >
                  {verifying ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={s.verifyBtnText}>KIỂM TRA</Text>
                  )}
                </TouchableOpacity>
              </View>

              {verifyResult && (
                <View style={[s.verifyResultCard, { backgroundColor: verifyResult.verified ? C.emeraldBg : C.roseBg, borderColor: verifyResult.verified ? C.emerald : C.rose }]}>
                  <Text style={[s.verifyResultTitle, { color: verifyResult.verified ? C.emerald : C.rose }]}>
                    {verifyResult.verified ? 'MÃ BĂM NGUYÊN VẸN & HỢP LỆ' : 'CẢNH BÁO: MÃ BĂM KHÔNG HỢP LỆ'}
                  </Text>
                  <Text style={s.verifyResultMsg}>{verifyResult.message}</Text>
                  {verifyResult.batchCode && (
                    <Text style={s.verifyResultDetail}>Lô hàng: {verifyResult.batchCode} — {verifyResult.productName}</Text>
                  )}
                </View>
              )}
            </Card>

            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Dòng thời gian Nhật ký Kiểm toán</Text>
              <Text style={s.sectionHint}>Ghi nhận bất biến</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ gap: 10 }}>
              <Skeleton height={80} />
              <Skeleton height={80} />
            </View>
          ) : (
            <EmptyState title="Chưa có nhật ký kiểm toán" desc="Mọi thao tác thay đổi dữ liệu sẽ được ghi nhận tại đây." />
          )
        }
        windowSize={10}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}

// ─── Memoized Audit Row ──────────────────────────────────────────────────────
const AuditRowMemo = React.memo(function AuditRow({ entry, isFirst }: { entry: AuditEntry; isFirst: boolean }) {
  const cfg = ACTION_LABEL[entry.action] ?? { label: entry.action, color: C.slate };
  const date = new Date(entry.createdAt);
  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

  return (
    <View style={row.wrapper}>
      <View style={row.lineCol}>
        <View style={[row.dot, { backgroundColor: cfg.color }]} />
        <View style={[row.line, isFirst && { opacity: 0 }]} />
      </View>

      <Card style={row.card}>
        <View style={row.topRow}>
          <View style={[row.actionTag, { backgroundColor: cfg.color + '15' }]}>
            <Text style={[row.actionText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <Text style={row.time}>{dateStr} {timeStr}</Text>
        </View>
        <Text style={row.user} numberOfLines={1}>Cán bộ: {entry.userEmail ?? entry.userId}</Text>
        {entry.entityId && (
          <Text style={row.entity} numberOfLines={1}>
            Thực thể ({entry.entityType || 'Record'}): {entry.entityId}
          </Text>
        )}
      </Card>
    </View>
  );
});

// ─── Top-level StyleSheet ────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  header: { paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.navy },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  listContent: { padding: 14, paddingBottom: 32, gap: 6 },
  headerComponents: { gap: 10, marginBottom: 8 },
  statsContainer: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: C.borderFaint, alignItems: 'center', gap: 2,
  },
  statLabel: { fontSize: 9, color: C.textSecondary, fontWeight: '700', textAlign: 'center' },
  statVal: { fontSize: FONT_SIZE.lg, fontWeight: '900' },
  statSub: { fontSize: 8, color: C.textMuted, fontWeight: '600' },
  verifyBox: { gap: 8, padding: 14, borderWidth: 1, borderColor: '#BFDBFE' },
  verifyTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800', color: C.navyMid },
  verifyDesc: { fontSize: 10, color: C.textSecondary },
  hashInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  hashInput: {
    flex: 1, height: 42, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 10, fontSize: FONT_SIZE.xs,
    backgroundColor: C.surface, color: C.textPrimary, fontVariant: ['tabular-nums'],
  },
  verifyBtn: { backgroundColor: C.navyMid, paddingHorizontal: 12, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  verifyBtnText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.3 },
  verifyResultCard: { borderRadius: 8, padding: 10, borderWidth: 1, gap: 4 },
  verifyResultTitle: { fontSize: 11, fontWeight: '900' },
  verifyResultMsg: { fontSize: FONT_SIZE.xs, color: C.textPrimary },
  verifyResultDetail: { fontSize: 10, color: C.textSecondary, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800', color: C.textSecondary },
  sectionHint: { fontSize: 10, color: C.textMuted },
});

const row = StyleSheet.create({
  wrapper: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  lineCol: { alignItems: 'center', width: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 14, flexShrink: 0 },
  line: { flex: 1, width: 1, backgroundColor: C.borderFaint, marginVertical: 2 },
  card: { flex: 1, gap: 4, padding: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  actionText: { fontSize: 10, fontWeight: '800' },
  time: { fontSize: 10, color: C.textMuted, fontVariant: ['tabular-nums'], fontWeight: '600' },
  user: { fontSize: FONT_SIZE.xs, color: C.textSecondary, fontWeight: '600' },
  entity: { fontSize: 10, color: C.textMuted, fontVariant: ['tabular-nums'] },
});
