import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MobileKpiSummary, RegulationItem, LoadingStatus } from '../types';
import { fetchMobileSummary } from '../api/client';
import { RegulationItemCard } from '../components/RegulationItemCard';

const GACC_REGULATIONS: RegulationItem[] = [
  {
    id: 'reg-1',
    title: 'Lệnh 248 & 249 GACC Trung Quốc (Mã CIFER)',
    summary: 'Yêu cầu 100% mã số CIFER vùng trồng (PUC) và mã cơ sở đóng gói (PHC) in rõ ràng trên nhãn thùng carton song ngữ Việt - Trung.',
    hsCode: '0810.60.00',
    market: 'Trung Quốc (GACC)',
    urgency: 'high',
    effectiveDate: '15/01/2024',
  },
  {
    id: 'reg-2',
    title: 'Nghị định thư Hải quan GACC 2024 & Giấy Phyto',
    summary: 'Giấy chứng nhận Kiểm dịch thực vật (Phyto) có hiệu lực tối đa 14 ngày kể từ ngày cấp bởi Cục BVTV.',
    hsCode: '0810.60.00',
    market: 'Trung Quốc (GACC)',
    urgency: 'normal',
    effectiveDate: '20/03/2024',
  },
  {
    id: 'reg-3',
    title: 'Chỉ tiêu Kim loại nặng Cadmium GB 2762-2022',
    summary: 'Hàm lượng tối đa Cadmium trong sầu riêng tươi không được vượt quá 0.05 mg/kg. Cảnh báo đỏ tiệm cận 0.040 mg/kg.',
    hsCode: '0810.60.00',
    market: 'Trung Quốc (GACC)',
    urgency: 'high',
    effectiveDate: '30/12/2022',
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
        {/* Top Protocol Badge */}
        <View style={styles.protocolBadge}>
          <Text style={styles.protocolText}>
            🎯 NGHỊ ĐỊNH THƯ GACC TRUNG QUỐC — SẦU RIÊNG (HS: 0810.60.00)
          </Text>
        </View>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCardPrimary}>
            <Text style={styles.kpiLabelPrimary}>SẢN LƯỢNG SẴN SÀNG</Text>
            <Text style={styles.kpiValPrimary}>
              {summary ? summary.readyVolumeTons || 54.2 : '54.2'} Tấn
            </Text>
            <Text style={styles.kpiSubPrimary}>
              💰 ~{summary ? summary.readyValueBillionVnd || 6.5 : '6.5'} Tỷ VNĐ (~{summary ? summary.readyContainersEstimate || 2.7 : '2.7'} Cont)
            </Text>
          </View>

          <View style={styles.kpiCardWarning}>
            <Text style={styles.kpiLabelWarning}>CẢNH BÁO ĐIỂM MÙ</Text>
            <Text style={styles.kpiValWarning}>
              {summary ? summary.cadmiumAlertCount || 1 : '1'} Lô Cadmium
            </Text>
            <Text style={styles.kpiSubWarning}>
              ⏳ {summary ? summary.phytoExpiringCount || 2 : '2'} Lô Phyto ≤ 3 ngày
            </Text>
          </View>
        </View>

        {/* Cadmium Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertTitle}>LÁ CHẮN CADMIUM (GB 2762-2022)</Text>
          </View>
          <Text style={styles.alertDesc}>
            Lô DURIAN-2024-889 ghi nhận mức Cadmium <Text style={styles.boldAlert}>0.042 mg/kg</Text> (tiệm cận ngưỡng tối đa <Text style={styles.boldAlert}>0.05 mg/kg</Text>). Khuyến nghị đối soát phiếu Lab trước khi xuất bến.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>BẢNG TIN QUY ĐỊNH HẢI QUAN GACC MỚI NHẤT</Text>
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
        <Text style={styles.loadingText}>Đang quét Ra-da Pháp lý GACC...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Không thể nạp dữ liệu Ra-da</Text>
        <Text style={styles.errorDesc}>Vui lòng kiểm tra lại kết nối mạng Backend.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadRadarData} activeOpacity={0.8}>
          <Text style={styles.retryBtnText}>🔄 Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={GACC_REGULATIONS}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  headerArea: {
    gap: 14,
    marginBottom: 16,
  },
  protocolBadge: {
    backgroundColor: '#00143B',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  protocolText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFB800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCardPrimary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    shadowColor: '#00236f',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiLabelPrimary: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00236f',
  },
  kpiValPrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00143B',
  },
  kpiSubPrimary: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  kpiCardWarning: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  kpiLabelWarning: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  kpiValWarning: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  kpiSubWarning: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B45309',
  },
  alertBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertIcon: {
    fontSize: 16,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  alertDesc: {
    fontSize: 11,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  boldAlert: {
    fontWeight: 'bold',
    color: '#B91C1C',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#00236f',
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  errorDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#00236f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
