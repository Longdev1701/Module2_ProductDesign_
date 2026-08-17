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
    return Math.round(
      ((Number(docState.phyto) + Number(docState.lab) + Number(docState.co) + Number(docState.packing)) / 4) * 100
    );
  }, [docState]);

  const toggleDoc = useCallback((key: keyof DocumentCheckState) => {
    setDocState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleScanSubmit = useCallback(() => {
    Alert.alert(
      'Xác nhận Thẩm định Thực địa',
      `Đã ghi nhận ${completionPct}% hồ sơ 4 Khóa KCS. Gửi yêu cầu thẩm định AI thành công!`,
      [{ text: 'Đóng' }]
    );
  }, [completionPct]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title Header */}
      <View style={styles.headerBox}>
        <Text style={styles.sectionBadge}>CHECKLIST KCS THỰC ĐỊA</Text>
        <Text style={styles.sectionTitle}>Nạp & Đối Soát 4 Khóa Chứng Thư KCS</Text>
      </View>

      {/* Completion Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>ĐỘ HOÀN THIỆN HỒ SƠ THÔNG QUAN</Text>
          <Text style={styles.progressPct}>{completionPct}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${completionPct}%` }]} />
        </View>
      </View>

      {/* 4 Keys Checklist Cards */}
      <View style={styles.cardsList}>
        <TouchableOpacity
          style={[styles.keyRow, docState.phyto && styles.keyRowActive]}
          onPress={() => toggleDoc('phyto')}
          activeOpacity={0.8}
        >
          <View style={[styles.checkBadge, docState.phyto ? styles.checkBadgeActive : styles.checkBadgeInactive]}>
            <Text style={styles.checkIcon}>{docState.phyto ? '✓' : '!'}</Text>
          </View>
          <View style={styles.keyInfo}>
            <Text style={styles.keyTitle}>1. Giấy Kiểm dịch Thực vật (Phyto)</Text>
            <Text style={styles.keyDesc}>Cấp bởi Cục BVTV — Hạn dùng 14 ngày</Text>
          </View>
          <Text style={[styles.keyActionText, docState.phyto && styles.keyActionTextActive]}>
            {docState.phyto ? 'Đã Nạp' : 'Nạp File'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.keyRow, docState.lab && styles.keyRowActive]}
          onPress={() => toggleDoc('lab')}
          activeOpacity={0.8}
        >
          <View style={[styles.checkBadge, docState.lab ? styles.checkBadgeActive : styles.checkBadgeInactive]}>
            <Text style={styles.checkIcon}>{docState.lab ? '✓' : '!'}</Text>
          </View>
          <View style={styles.keyInfo}>
            <Text style={styles.keyTitle}>2. Phiếu Phân Tích Lab Cadmium</Text>
            <Text style={styles.keyDesc}>Chỉ tiêu GB 2762-2022 (≤ 0.05 mg/kg)</Text>
          </View>
          <Text style={[styles.keyActionText, docState.lab && styles.keyActionTextActive]}>
            {docState.lab ? 'Đã Nạp' : 'Nạp File'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.keyRow, docState.co && styles.keyRowActive]}
          onPress={() => toggleDoc('co')}
          activeOpacity={0.8}
        >
          <View style={[styles.checkBadge, docState.co ? styles.checkBadgeActive : styles.checkBadgeInactive]}>
            <Text style={styles.checkIcon}>{docState.co ? '✓' : '!'}</Text>
          </View>
          <View style={styles.keyInfo}>
            <Text style={styles.keyTitle}>3. Chứng Nhận Xuất Xứ (C/O Form E)</Text>
            <Text style={styles.keyDesc}>Áp dụng thuế suất ưu đãi ACFTA 0%</Text>
          </View>
          <Text style={[styles.keyActionText, docState.co && styles.keyActionTextActive]}>
            {docState.co ? 'Đã Nạp' : 'Nạp File'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.keyRow, docState.packing && styles.keyRowActive]}
          onPress={() => toggleDoc('packing')}
          activeOpacity={0.8}
        >
          <View style={[styles.checkBadge, docState.packing ? styles.checkBadgeActive : styles.checkBadgeInactive]}>
            <Text style={styles.checkIcon}>{docState.packing ? '✓' : '!'}</Text>
          </View>
          <View style={styles.keyInfo}>
            <Text style={styles.keyTitle}>4. Bảng Kê Đóng Gói (Packing List)</Text>
            <Text style={styles.keyDesc}>Quy cách thùng 15kg song ngữ Việt - Trung</Text>
          </View>
          <Text style={[styles.keyActionText, docState.packing && styles.keyActionTextActive]}>
            {docState.packing ? 'Đã Nạp' : 'Nạp File'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleScanSubmit} activeOpacity={0.85}>
        <Text style={styles.submitBtnText}>⚡ ĐỐI SOÁT AI CHUYÊN SÂU</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: '#FAF8FF',
  },
  headerBox: {
    gap: 2,
  },
  sectionBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00143B',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    shadowColor: '#00236f',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  progressPct: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
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
    borderRadius: 4,
  },
  cardsList: {
    gap: 12,
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  keyRowActive: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeActive: {
    backgroundColor: '#10B981',
  },
  checkBadgeInactive: {
    backgroundColor: '#EF4444',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  keyInfo: {
    flex: 1,
    gap: 2,
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
  keyActionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  keyActionTextActive: {
    color: '#059669',
  },
  submitBtn: {
    backgroundColor: '#00236f',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00236f',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
