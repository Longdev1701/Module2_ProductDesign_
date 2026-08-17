import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { fetchMobileSummary, fetchMobileBatches, MobileKpiSummary, MobileBatchItem } from './src/api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'scan' | 'tracker'>('radar');
  const [summary, setSummary] = useState<MobileKpiSummary | null>(null);
  const [batches, setBatches] = useState<MobileBatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('1');

  // Documents state for Tab 2
  const [docState, setDocState] = useState({
    phyto: true,
    lab: true,
    co: false,
    packing: true,
  });

  useEffect(() => {
    async function loadData() {
      const sData = await fetchMobileSummary();
      const bData = await fetchMobileBatches();
      setSummary(sData);
      setBatches(bData);
    }
    loadData();
  }, []);

  const completionPct =
    ((Number(docState.phyto) + Number(docState.lab) + Number(docState.co) + Number(docState.packing)) / 4) * 100;

  const toggleDoc = (key: keyof typeof docState) => {
    setDocState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001946" />

      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <View>
          <Text style={styles.headerSub}>AI COMPLIANCE NAVIGATOR</Text>
          <Text style={styles.headerTitle}>Themis LexiGuard Mobile</Text>
        </View>
      </View>

      {/* Main Content Body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* TAB 1: LEGAL RISK RADAR */}
        {activeTab === 'radar' && (
          <View style={styles.tabContent}>
            <View style={styles.protocolBadge}>
              <Text style={styles.protocolBadgeText}>
                🎯 GACC Trung Quốc — Sầu riêng (HS: 0810.60.00)
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
              <Text style={styles.alertTitle}>⚠️ CHỈ TIÊU CADMIUM (GB 2762-2022)</Text>
              <Text style={styles.alertDesc}>
                Lô DURIAN-2024-889 ghi nhận mức Cadmium <Text style={{ fontWeight: 'bold', color: '#B45309' }}>0.042 mg/kg</Text> (tiệm cận ngưỡng tối đa 0.05 mg/kg). Khuyến nghị đối soát kỹ phiếu Lab trước khi lăn bánh.
              </Text>
            </View>

            {/* Regulations Feed */}
            <Text style={styles.sectionTitle}>BẢNG TIN QUY ĐỊNH HẢI QUAN GACC</Text>
            <View style={styles.regCard}>
              <Text style={styles.regTitle}>Lệnh 248 & 249 GACC Trung Quốc</Text>
              <Text style={styles.regDesc}>
                Bắt buộc mã số CIFER vùng trồng (PUC) và mã cơ sở đóng gói (PHC) trên nhãn carton song ngữ Việt - Trung.
              </Text>
            </View>
            <View style={styles.regCard}>
              <Text style={styles.regTitle}>Nghị định thư Hải quan GACC 2024</Text>
              <Text style={styles.regDesc}>
                Giấy chứng nhận Kiểm dịch thực vật (Phyto) có hiệu lực 14 ngày kể từ ngày cấp bởi Cục BVTV.
              </Text>
            </View>
          </View>
        )}

        {/* TAB 2: FIELD COMPLIANCE SCAN */}
        {activeTab === 'scan' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>QUÉT & NẠP HỒ SƠ 4 KHÓA KCS THỰC ĐỊA</Text>

            {/* Completion Progress Bar */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>ĐỘ HOÀN THIỆN HỒ SƠ</Text>
                <Text style={styles.progressPct}>{completionPct}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${completionPct}%` }]} />
              </View>
            </View>

            {/* 4 Keys List */}
            <TouchableOpacity style={styles.keyRow} onPress={() => toggleDoc('phyto')}>
              <Text style={styles.keyIcon}>{docState.phyto ? '✅' : '🔴'}</Text>
              <View style={styles.keyInfo}>
                <Text style={styles.keyTitle}>1. Giấy Kiểm dịch Thực vật (Phyto)</Text>
                <Text style={styles.keyDesc}>Cấp bởi Cục BVTV — Hạn dùng 14 ngày</Text>
              </View>
              <Text style={styles.keyAction}>{docState.phyto ? 'Đã nạp' : 'Nạp file'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.keyRow} onPress={() => toggleDoc('lab')}>
              <Text style={styles.keyIcon}>{docState.lab ? '✅' : '🔴'}</Text>
              <View style={styles.keyInfo}>
                <Text style={styles.keyTitle}>2. Phiếu Phân Tích Lab Cadmium</Text>
                <Text style={styles.keyDesc}>Chỉ tiêu GB 2762-2022 (≤ 0.05 mg/kg)</Text>
              </View>
              <Text style={styles.keyAction}>{docState.lab ? 'Đã nạp' : 'Nạp file'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.keyRow} onPress={() => toggleDoc('co')}>
              <Text style={styles.keyIcon}>{docState.co ? '✅' : '🔴'}</Text>
              <View style={styles.keyInfo}>
                <Text style={styles.keyTitle}>3. Chứng Nhận Xuất Xứ (C/O Form E)</Text>
                <Text style={styles.keyDesc}>Áp dụng thuế suất ưu đãi ACFTA 0%</Text>
              </View>
              <Text style={styles.keyAction}>{docState.co ? 'Đã nạp' : 'Nạp file'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.keyRow} onPress={() => toggleDoc('packing')}>
              <Text style={styles.keyIcon}>{docState.packing ? '✅' : '🔴'}</Text>
              <View style={styles.keyInfo}>
                <Text style={styles.keyTitle}>4. Bảng Kê Đóng Gói (Packing List)</Text>
                <Text style={styles.keyDesc}>Quy cách thùng 15kg song ngữ Việt - Trung</Text>
              </View>
              <Text style={styles.keyAction}>{docState.packing ? 'Đã nạp' : 'Nạp file'}</Text>
            </TouchableOpacity>

            {/* Quick Upload CTA */}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => Alert.alert('Thông báo', 'Đã nạp chứng thư và gửi yêu cầu thẩm định AI thành công!')}
            >
              <Text style={styles.btnPrimaryText}>🚀 Quét & Gửi Thẩm Định Tuân Thủ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 3: EXPORT BATCH TRACKER */}
        {activeTab === 'tracker' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>QUẢN LÝ LÔ HÀNG SẦU RIÊNG XUẤT KHẨU</Text>

            {batches.map((item) => (
              <View key={item.id} style={styles.batchCard}>
                <View style={styles.batchHeader}>
                  <Text style={styles.batchCode}>{item.batchCode}</Text>
                  <Text style={styles.batchBadge}>
                    {item.status === 'READY_FOR_CHECK' ? 'AN TOÀN' : 'ĐANG CHỜ HỒ SƠ'}
                  </Text>
                </View>

                <Text style={styles.batchName}>{item.productName}</Text>

                <View style={styles.batchDetails}>
                  <Text style={styles.batchDetailText}>
                    📦 Khối lượng: <Text style={{ fontWeight: 'bold' }}>{item.quantity} tấn</Text> (~{(item.quantity * 0.12).toFixed(1)} Tỷ VNĐ)
                  </Text>
                  <Text style={styles.batchDetailText}>
                    🏬 Mã CIFER: {item.ciferCode} | PUC: {item.pucCode}
                  </Text>
                  {item.sealCode && (
                    <Text style={styles.batchDetailText}>
                      🔒 Mã Kẹp Chì Seal: <Text style={{ color: '#059669', fontWeight: 'bold' }}>{item.sealCode}</Text>
                    </Text>
                  )}
                  {item.sha256Hash && (
                    <Text style={styles.batchDetailText}>
                      🛡️ Hash SHA-256: <Text style={{ fontFamily: 'monospace' }}>{item.sha256Hash}</Text>
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'radar' && styles.navItemActive]}
          onPress={() => setActiveTab('radar')}
        >
          <Text style={styles.navIcon}>📡</Text>
          <Text style={[styles.navText, activeTab === 'radar' && styles.navTextActive]}>
            Ra-da Quy Định
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'scan' && styles.navItemActive]}
          onPress={() => setActiveTab('scan')}
        >
          <Text style={styles.navIcon}>📷</Text>
          <Text style={[styles.navText, activeTab === 'scan' && styles.navTextActive]}>
            Quét Thực Địa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'tracker' && styles.navItemActive]}
          onPress={() => setActiveTab('tracker')}
        >
          <Text style={styles.navIcon}>🚛</Text>
          <Text style={[styles.navText, activeTab === 'tracker' && styles.navTextActive]}>
            Lô Hàng Xuất
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001946',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#001946',
  },
  headerSub: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#FCD34D',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 32,
  },
  tabContent: {
    gap: 16,
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
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
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
    color: '#001946',
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
    padding: 14,
    borderRadius: 16,
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
    color: '#001946',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  regCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  regTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  regDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#001946',
  },
  progressPct: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  keyIcon: {
    fontSize: 20,
  },
  keyInfo: {
    flex: 1,
  },
  keyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  keyDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  keyAction: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  btnPrimary: {
    backgroundColor: '#001946',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  batchCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#001946',
  },
  batchBadge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  batchName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  batchDetails: {
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  batchDetailText: {
    fontSize: 11,
    color: '#64748B',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#001946',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#FFB800',
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  navTextActive: {
    color: '#FFB800',
    fontWeight: 'bold',
  },
});
