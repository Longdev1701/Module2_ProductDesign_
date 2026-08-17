import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { DocumentCheckState } from '../types';

export function FieldScanTab() {
  const [docState, setDocState] = useState<DocumentCheckState>({
    phyto: true,
    lab: true,
    co: false,
    packing: true,
  });

  const completionPct = useMemo(() => {
    return (
      ((Number(docState.phyto) + Number(docState.lab) + Number(docState.co) + Number(docState.packing)) / 4) * 100
    );
  }, [docState]);

  const toggleDoc = useCallback((key: keyof DocumentCheckState) => {
    setDocState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleScanSubmit = useCallback(() => {
    Alert.alert(
      'Xác nhận Thẩm định',
      `Đã ghi nhận ${completionPct}% hồ sơ 4 Khóa KCS. Gửi yêu cầu thẩm định AI thành công!`,
      [{ text: 'Đóng' }]
    );
  }, [completionPct]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>QUÉT & NẠP HỒ SƠ 4 KHÓA KCS THỰC ĐỊA</Text>

      {/* Completion Progress Bar */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>ĐỘ HOÀN THIỆN HỒ SƠ THÔNG QUAN</Text>
          <Text style={styles.progressPct}>{completionPct}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${completionPct}%` }]} />
        </View>
      </View>

      {/* 4 Keys Checklist */}
      <TouchableOpacity
        style={styles.keyRow}
        onPress={() => toggleDoc('phyto')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.keyIcon}>{docState.phyto ? '✅' : '🔴'}</Text>
        <View style={styles.keyInfo}>
          <Text style={styles.keyTitle}>1. Giấy Kiểm dịch Thực vật (Phyto)</Text>
          <Text style={styles.keyDesc}>Cấp bởi Cục BVTV — Hạn dùng 14 ngày</Text>
        </View>
        <Text style={styles.keyAction}>{docState.phyto ? 'Đã nạp' : 'Nạp file'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.keyRow}
        onPress={() => toggleDoc('lab')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.keyIcon}>{docState.lab ? '✅' : '🔴'}</Text>
        <View style={styles.keyInfo}>
          <Text style={styles.keyTitle}>2. Phiếu Phân Tích Lab Cadmium</Text>
          <Text style={styles.keyDesc}>Chỉ tiêu GB 2762-2022 (≤ 0.05 mg/kg)</Text>
        </View>
        <Text style={styles.keyAction}>{docState.lab ? 'Đã nạp' : 'Nạp file'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.keyRow}
        onPress={() => toggleDoc('co')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.keyIcon}>{docState.co ? '✅' : '🔴'}</Text>
        <View style={styles.keyInfo}>
          <Text style={styles.keyTitle}>3. Chứng Nhận Xuất Xứ (C/O Form E)</Text>
          <Text style={styles.keyDesc}>Áp dụng thuế suất ưu đãi ACFTA 0%</Text>
        </View>
        <Text style={styles.keyAction}>{docState.co ? 'Đã nạp' : 'Nạp file'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.keyRow}
        onPress={() => toggleDoc('packing')}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.keyIcon}>{docState.packing ? '✅' : '🔴'}</Text>
        <View style={styles.keyInfo}>
          <Text style={styles.keyTitle}>4. Bảng Kê Đóng Gói (Packing List)</Text>
          <Text style={styles.keyDesc}>Quy cách thùng 15kg song ngữ Việt - Trung</Text>
        </View>
        <Text style={styles.keyAction}>{docState.packing ? 'Đã nạp' : 'Nạp file'}</Text>
      </TouchableOpacity>

      {/* Quick Upload CTA */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleScanSubmit} activeOpacity={0.8}>
        <Text style={styles.btnPrimaryText}>🚀 Quét & Gửi Thẩm Định Tuân Thủ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00236f',
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#c5c5d3',
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00236f',
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
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#c5c5d3',
    minHeight: 56,
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
    backgroundColor: '#00236f',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
