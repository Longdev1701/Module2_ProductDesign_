import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MobileBatchItem } from '../types';

interface BatchItemCardProps {
  item: MobileBatchItem;
}

export const BatchItemCard = React.memo(function BatchItemCard({ item }: BatchItemCardProps) {
  return (
    <View style={styles.batchCard}>
      <View style={styles.batchHeader}>
        <Text style={styles.batchCode}>{item.batchCode}</Text>
        <Text style={styles.batchBadge}>
          {item.status === 'READY_FOR_CHECK' ? 'AN TOÀN' : 'ĐANG CHỜ HỒ SƠ'}
        </Text>
      </View>

      <Text style={styles.batchName} numberOfLines={1} ellipsizeMode="tail">
        {item.productName}
      </Text>

      <View style={styles.batchDetails}>
        <Text style={styles.batchDetailText}>
          📦 Khối lượng: <Text style={{ fontWeight: 'bold' }}>{item.quantity} tấn</Text> (~{(item.quantity * 0.12).toFixed(1)} Tỷ VNĐ)
        </Text>
        <Text style={styles.batchDetailText} numberOfLines={1} ellipsizeMode="tail">
          🏬 CIFER: {item.ciferCode} | PUC: {item.pucCode} | PHC: {item.phcCode}
        </Text>
        {item.sealCode && (
          <Text style={styles.batchDetailText}>
            🔒 Kẹp Chì Seal: <Text style={{ color: '#059669', fontWeight: 'bold' }}>{item.sealCode}</Text>
          </Text>
        )}
        {item.sha256Hash && (
          <Text style={styles.batchDetailText} numberOfLines={1} ellipsizeMode="middle">
            🛡️ Hash SHA-256: {item.sha256Hash}
          </Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  batchCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#c5c5d3',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00236f',
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
    marginVertical: 4,
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
});
