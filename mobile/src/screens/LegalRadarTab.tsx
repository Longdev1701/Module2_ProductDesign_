import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MobileKpiSummary, RegulationItem, LoadingStatus } from '../types';
import { fetchMobileSummary } from '../api/client';
import { RegulationItemCard } from '../components/RegulationItemCard';

const MOCK_REGULATIONS: RegulationItem[] = [
  {
    id: 'reg-1',
    title: 'Lệnh 248 & 249 GACC Trung Quốc (CIFER)',
    description: 'Bắt buộc mã số CIFER vùng trồng (PUC) và mã cơ sở đóng gói (PHC) trên nhãn carton song ngữ Việt - Trung.',
    authority: 'Tổng cục Hải quan Trung Quốc',
    issuedDate: '2024-01-15',
  },
  {
    id: 'reg-2',
    title: 'Nghị định thư Hải quan GACC 2024',
    description: 'Giấy chứng nhận Kiểm dịch thực vật (Phyto) có hiệu lực 14 ngày kể từ ngày cấp bởi Cục BVTV.',
    authority: 'Bộ NN&PTNT Việt Nam',
    issuedDate: '2024-03-20',
  },
  {
    id: 'reg-3',
    title: 'Tiêu chuẩn Cadmium GB 2762-2022',
    description: 'Hàm lượng tối đa Cadmium trong sầu riêng tươi không vượt quá 0.05 mg/kg. Cảnh báo khẩn khi tiệm cận 0.040 mg/kg.',
    authority: 'Bộ Y tế Trung Quốc (NHC)',
    issuedDate: '2022-12-30',
  },
];

export function LegalRadarTab() {
  const [status, setStatus] = useState<LoadingStatus>('idle');
  const [summary, setSummary] = useState<MobileKpiSummary | null>(null);

  const loadRadarData = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchMobileSummary();
      setSummary(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadRadarData();
  }, [loadRadarData]);

  const renderHeader = useMemo(() => {
    return (
      <View style={styles.headerArea}>
        <View style={styles.protocolBadge}>
          <Text style={styles.protocolBadgeText}>
            🎯 Hải quan Trung Quốc (GACC) — Sầu riêng (HS: 0810.60.00)
          </Text>
        </View>

        {/* KPI Summary Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>SẢN LƯỢNG AN TOÀN</Text>
            <Text style={styles.kpiValue}>
              {summary ? summary.readyVolumeTons : '54.2'} tấn
            </Text>
            <Text style={styles.kpiSub}>
              💰 ~{summary ? summary.readyValueBillionVnd : '6.5'} Tỷ VNĐ ({summary ? summary.readyContainersEstimate : '2.7'} Cont)
            </Text>
          </View>

          <View style={[styles.kpiCard, styles.kpiCardWarning]}>
            <Text style={styles.kpiLabelWarning}>CẢNH BÁO ĐIỂM MÙ</Text>
            <Text style={styles.kpiValueWarning}>
              {summary ? summary.cadmiumAlertCount : '1'} Lô Cadmium
            </Text>
            <Text style={styles.kpiSubWarning}>
              ⏳ {summary ? summary.phytoExpiringCount : '2'} Lô Phyto ≤ 3 ngày
            </Text>
          </View>
        </View>

        {/* Blind Spot Alert Banner */}
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>⚠️ LÁ CHẮN CADMIUM (GB 2762-2022)</Text>
          <Text style={styles.alertDesc}>
            Lô DURIAN-2024-889 ghi nhận mức Cadmium <Text style={{ fontWeight: 'bold', color: '#B45309' }}>0.042 mg/kg</Text> (tiệm cận ngưỡng tối đa 0.05 mg/kg). Khuyến nghị đối soát phiếu Lab trước khi lăn bánh.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>BẢNG TIN QUY ĐỊNH HẢI QUAN GACC</Text>
      </View>
    );
  }, [summary]);

  const keyExtractor = useCallback((item: RegulationItem) => item.id, []);

  const renderItem = useCallback(({ item }: { item: RegulationItem }) => {
    return <RegulationItemCard item={item} />;
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00236f" />
        <Text style={styles.loadingText}>Đang nạp quy định Ra-da GACC...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Không thể kết nối đến máy chủ quy định GACC</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadRadarData}>
          <Text style={styles.retryBtnText}>🔄 Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={MOCK_REGULATIONS}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerArea: {
    gap: 16,
    marginBottom: 12,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#475569',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: '#00236f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  protocolBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  protocolBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#c5c5d3',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiCardWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  kpiLabelWarning: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B45309',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00236f',
    marginVertical: 4,
  },
  kpiValueWarning: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D97706',
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: '#475569',
  },
  kpiSubWarning: {
    fontSize: 11,
    color: '#92400E',
  },
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
    borderRadius: 24,
    gap: 4,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  alertDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00236f',
    marginTop: 8,
    letterSpacing: 0.5,
  },
});
