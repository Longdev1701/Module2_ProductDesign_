import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { api } from '../lib/api';
import {
  ScreenShell, Card, StatusBadge, KeyBadge,
  ErrorBanner, EmptyState, Skeleton,
} from '../components/ui';
import { C, FONT_SIZE } from '../lib/theme';

interface DashboardSummary {
  totalBatches: number;
  complianceRate: number;
  actionRequiredBatches: number;
  criticalLegalAlerts: number;
  totalExportVolumeTons?: number;
  readyVolumeTons?: number;
  readyContainersEstimate?: number;
  readyValueVndBillion?: number;
}

interface RecentBatch {
  id: string;
  batchCode: string;
  productName: string;
  category?: string;
  status: string;
  hasPhyto: boolean;
  hasLab: boolean;
  hasCo: boolean;
  hasPacking: boolean;
  quantity: number;
  unit: string;
}

interface ActionItem {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  deadlineText: string;
}

export function DashboardScreen() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [batches, setBatches] = useState<RecentBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actionItems: ActionItem[] = useMemo(() => [
    {
      id: 'act-1',
      title: 'Lô DURIAN-2024-889: Thiếu Phiếu Lab Cadmium GB 2762',
      severity: 'critical',
      deadlineText: 'Cần nạp trước giờ đóng container',
    },
    {
      id: 'act-2',
      title: 'Giấy Kiểm dịch Thực vật Phyto: Đếm ngược 14 ngày',
      severity: 'warning',
      deadlineText: 'Hạn chót thông quan: 28/08/2026',
    },
  ], []);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const res = await api.get<{
        summary: DashboardSummary;
        recentBatches: RecentBatch[];
      }>('/dashboard/overview');

      if (res && res.summary) {
        setSummary(res.summary);
        setBatches(res.recentBatches || []);
      } else {
        const fallbackSummary = await api.get<DashboardSummary>('/dashboard/summary');
        setSummary(fallbackSummary);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Không tải được dữ liệu điều hành.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const readyContainers = useMemo(() => {
    if (!summary) return '0.0';
    return summary.readyContainersEstimate?.toFixed(1) ?? ((summary.readyVolumeTons || 0) * 0.05).toFixed(1);
  }, [summary]);

  const readyValue = useMemo(() => {
    if (!summary) return '0.0';
    return summary.readyValueVndBillion?.toFixed(2) ?? ((summary.readyVolumeTons || 0) * 0.12).toFixed(2);
  }, [summary]);

  return (
    <ScreenShell
      title="Ra-da & Trung tâm Điều hành"
      subtitle="Nghị định thư GACC 2024 — Mã HS: 0810.60.00"
      loading={loading}
      refreshing={refreshing}
      onRefresh={() => fetchData(true)}
    >
      {error && <ErrorBanner message={error} onRetry={() => fetchData()} />}

      {/* Cadmium GB 2762-2022 & Phyto Alert Banner (Feature #1) */}
      <View style={s.radarAlertBox}>
        <View style={s.radarHeader}>
          <View style={s.radarBadge}>
            <Text style={s.radarBadgeText}>RA-DA PHÁP LÝ GACC</Text>
          </View>
          <Text style={s.radarTime}>Kiểm định tức thì</Text>
        </View>
        <Text style={s.radarTitle}>Chỉ tiêu Cadmium & Hạn Kiểm dịch TV Phyto</Text>
        <View style={s.radarMetricsRow}>
          <View style={s.radarMetric}>
            <Text style={s.radarMetricLabel}>Ngưỡng Cadmium (GB 2762)</Text>
            <Text style={s.radarMetricVal}>≤ 0.05 mg/kg</Text>
          </View>
          <View style={s.radarDivider} />
          <View style={s.radarMetric}>
            <Text style={s.radarMetricLabel}>Thời hạn Phyto</Text>
            <Text style={s.radarMetricVal}>14 ngày</Text>
          </View>
        </View>
      </View>

      {/* KPI Grid 2x2 with Container & Value Valuation (Feature #3) */}
      {summary && (
        <View style={s.kpiGrid}>
          <KpiCard
            title="Sản lượng An toàn"
            value={summary.readyVolumeTons ?? summary.totalExportVolumeTons ?? 0}
            unit="Tấn"
            subtext={`≈ ${readyContainers} Cont · ${readyValue} Tỷ`}
            accent={C.navyMid}
          />
          <KpiCard
            title="Tỷ lệ Tuân thủ"
            value={summary.complianceRate}
            unit="%"
            subtext="Theo chuẩn GACC 2024"
            accent={summary.complianceRate >= 80 ? C.emerald : C.rose}
          />
          <KpiCard
            title="Cần Xử lý"
            value={summary.actionRequiredBatches}
            unit="Lô"
            subtext="Thiếu khóa chứng thư"
            accent={summary.actionRequiredBatches > 0 ? C.rose : C.emerald}
          />
          <KpiCard
            title="Tổng Lô Xuất khẩu"
            value={summary.totalBatches}
            unit="Lô"
            subtext="Mã HS: 0810.60.00"
            accent={C.amber}
          />
        </View>
      )}

      {/* Action Items Widget (Parity with Web ActionRequiredWidget) */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Hồ sơ & Việc cần Xử lý Ngay</Text>
        <Text style={s.sectionHint}>Ưu tiên cao</Text>
      </View>

      <View style={s.actionItemsList}>
        {actionItems.map((item) => (
          <View
            key={item.id}
            style={[
              s.actionItemCard,
              { borderLeftColor: item.severity === 'critical' ? C.rose : C.amber },
            ]}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={s.actionItemTitle}>{item.title}</Text>
              <Text style={s.actionItemDeadline}>{item.deadlineText}</Text>
            </View>
            <View
              style={[
                s.actionItemTag,
                { backgroundColor: item.severity === 'critical' ? C.roseBg : C.amberBg },
              ]}
            >
              <Text
                style={[
                  s.actionItemTagText,
                  { color: item.severity === 'critical' ? C.rose : C.amber },
                ]}
              >
                {item.severity === 'critical' ? 'KHẨN' : 'CẢNH BÁO'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Batches List */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Lô hàng Xuất khẩu Gần nhất (4 Khóa)</Text>
        <Text style={s.sectionHint}>Nhấn để xem chi tiết</Text>
      </View>

      {batches.length === 0 && !loading ? (
        <EmptyState
          title="Chưa có lô hàng nào"
          desc="Khởi tạo lô hàng đầu tiên trong tab Sản phẩm để thẩm định 4 Khóa."
        />
      ) : (
        batches.map((b) => <BatchRowMemo key={b.id} batch={b} />)
      )}
    </ScreenShell>
  );
}

// ─── KPI Card Component ──────────────────────────────────────────────────────
const KpiCard = React.memo(function KpiCard({
  title, value, unit, subtext, accent,
}: {
  title: string; value: number; unit: string; subtext?: string; accent: string;
}) {
  return (
    <View style={[kpi.card, { borderLeftColor: accent }]}>
      <Text style={kpi.title} numberOfLines={1}>{title}</Text>
      <View style={kpi.row}>
        <Text style={[kpi.value, { color: accent }]}>{value}</Text>
        <Text style={kpi.unit}>{unit}</Text>
      </View>
      {subtext ? <Text style={kpi.subtext} numberOfLines={1}>{subtext}</Text> : null}
    </View>
  );
});

// ─── Batch Row Component ─────────────────────────────────────────────────────
const BatchRowMemo = React.memo(function BatchRow({ batch }: { batch: RecentBatch }) {
  return (
    <Card style={br.card}>
      <View style={br.topRow}>
        <View style={br.codeBox}>
          <Text style={br.code}>{batch.batchCode}</Text>
        </View>
        <StatusBadge status={batch.status} />
      </View>

      <Text style={br.product} numberOfLines={1}>{batch.productName}</Text>

      <View style={br.bottomRow}>
        <View style={br.keys}>
          <KeyBadge label="Phyto" active={batch.hasPhyto} />
          <KeyBadge label="Lab" active={batch.hasLab} />
          <KeyBadge label="CO" active={batch.hasCo} />
          <KeyBadge label="Pkg" active={batch.hasPacking} />
        </View>
        <Text style={br.qty}>{batch.quantity} {batch.unit}</Text>
      </View>
    </Card>
  );
});

// ─── Top-level StyleSheet ────────────────────────────────────────────────────
const s = StyleSheet.create({
  radarAlertBox: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderLeftWidth: 4,
    borderLeftColor: C.amber,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  radarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radarBadge: {
    backgroundColor: C.amberBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  radarBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#C2410C',
    letterSpacing: 0.4,
  },
  radarTime: {
    fontSize: FONT_SIZE.xs,
    color: C.textMuted,
    fontWeight: '600',
  },
  radarTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: C.textPrimary,
  },
  radarMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceDim,
    borderRadius: 8,
    padding: 10,
  },
  radarMetric: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  radarDivider: {
    width: 1,
    height: 24,
    backgroundColor: C.borderFaint,
  },
  radarMetricLabel: {
    fontSize: 9,
    color: C.textSecondary,
    fontWeight: '700',
  },
  radarMetricVal: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '900',
    color: C.navyMid,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: C.textSecondary,
    letterSpacing: 0.5,
  },
  sectionHint: {
    fontSize: 10,
    color: C.textMuted,
  },
  actionItemsList: {
    gap: 8,
  },
  actionItemCard: {
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: C.borderFaint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionItemTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: C.textPrimary,
  },
  actionItemDeadline: {
    fontSize: 10,
    color: C.textMuted,
  },
  actionItemTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actionItemTagText: {
    fontSize: 9,
    fontWeight: '900',
  },
});

const kpi = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: C.borderFaint,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    gap: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSecondary,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  value: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
  },
  unit: {
    fontSize: FONT_SIZE.xs,
    color: C.textMuted,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 9,
    color: C.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
});

const br = StyleSheet.create({
  card: {
    gap: 6,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeBox: {
    backgroundColor: C.surfaceDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  code: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '900',
    color: C.navyMid,
    fontVariant: ['tabular-nums'],
  },
  product: {
    fontSize: FONT_SIZE.sm,
    color: C.textPrimary,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  keys: {
    flexDirection: 'row',
    gap: 4,
  },
  qty: {
    fontSize: FONT_SIZE.xs,
    color: C.textMuted,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
