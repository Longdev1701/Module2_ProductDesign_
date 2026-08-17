import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MobileBatchItem } from '../api/client';

interface BatchItemCardProps {
  item: MobileBatchItem;
}

export const BatchItemCard = React.memo(function BatchItemCard({ item }: BatchItemCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY_FOR_CHECK':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', label: '✅ SẴN SÀNG KIỂM TRA' };
      case 'COLLECTING_DOCUMENTS':
        return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', label: '📄 THU THẬP HỒ SƠ' };
      case 'CHECKING':
        return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', label: '⚙️ ĐANG ĐỐI SOÁT AI' };
      case 'ACTION_REQUIRED':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', label: '⚠️ CẦN XỬ LÝ GẮP' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', label: status };
    }
  };

  const statusStyle = getStatusColor(item.status);

  return (
    <View style={styles.card}>
      {/* Top Batch Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeCode}>
          <Text style={styles.badgeCodeText}>📦 {item.batchCode}</Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
        </View>
      </View>

      {/* Product Name */}
      <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">
        {item.productName}
      </Text>

      {/* Financial & Volume Metrics */}
      <View style={styles.metricsBox}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>SẢN LƯỢNG THỰC</Text>
          <Text style={styles.metricValue}>{item.quantity} {item.unit}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>ƯỚC TÍNH XE CONT</Text>
          <Text style={styles.metricValue}>~{(item.quantity / 20).toFixed(1)} Container</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>GIÁ TRỊ XUẤT KHẨU</Text>
          <Text style={[styles.metricValue, { color: '#D97706' }]}>~{(item.quantity * 0.12).toFixed(2)} Tỷ VNĐ</Text>
        </View>
      </View>

      {/* GACC Codes Row */}
      <View style={styles.codesRow}>
        <Text style={styles.codeItem}>CIFER: <Text style={styles.codeVal}>{item.ciferCode || 'CVNM2401240001'}</Text></Text>
        <Text style={styles.codeItem}>PHC: <Text style={styles.codeVal}>{item.phcCode || 'VN-TGPH-0012'}</Text></Text>
        <Text style={styles.codeItem}>PUC: <Text style={styles.codeVal}>{item.pucCode || 'VN-TGOR-0095'}</Text></Text>
      </View>

      {/* Cryptographic Seal & SHA-256 Hash */}
      {item.sealCode && (
        <View style={styles.cryptoBox}>
          <View style={styles.cryptoRow}>
            <Text style={styles.cryptoLabel}>🔒 MÃ KẸP CHÌ SEAL:</Text>
            <Text style={styles.cryptoVal}>{item.sealCode}</Text>
          </View>
          {item.sha256Hash && (
            <View style={styles.cryptoRow}>
              <Text style={styles.cryptoLabel}>🔑 BĂM CHỐNG GIẢ (SHA-256):</Text>
              <Text style={styles.hashVal}>{item.sha256Hash}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeCode: {
    backgroundColor: '#00143B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCodeText: {
    color: '#FFB800',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  codesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  codeItem: {
    fontSize: 10,
    color: '#78350F',
    fontWeight: 'bold',
  },
  codeVal: {
    color: '#B45309',
    fontFamily: 'monospace',
  },
  cryptoBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 10,
    borderRadius: 10,
    gap: 4,
  },
  cryptoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cryptoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  cryptoVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#15803D',
  },
  hashVal: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#166534',
  },
});
