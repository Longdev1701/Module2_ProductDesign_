import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RegulationItem } from '../types';

interface RegulationItemCardProps {
  item: RegulationItem;
}

export const RegulationItemCard = React.memo(function RegulationItemCard({ item }: RegulationItemCardProps) {
  return (
    <View style={[styles.card, item.urgency === 'high' && styles.highRiskBorder]}>
      <View style={styles.headerRow}>
        <Text style={styles.hsCodeBadge}>{item.hsCode}</Text>
        <Text style={[styles.urgencyText, item.urgency === 'high' ? styles.urgentText : styles.normalText]}>
          {item.urgency === 'high' ? '⚠️ NGUY CƠ CAO' : 'ℹ️ THÔNG TIN'}
        </Text>
      </View>

      <Text style={styles.regTitle} numberOfLines={2} ellipsizeMode="tail">
        {item.title}
      </Text>

      <Text style={styles.regDesc} numberOfLines={3} ellipsizeMode="tail">
        {item.summary}
      </Text>

      <View style={styles.regFooter}>
        <Text style={styles.regMeta}>Thị trường: {item.market}</Text>
        <Text style={styles.regMeta}>Cập nhật: {item.effectiveDate}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    gap: 6,
  },
  highRiskBorder: {
    borderLeftColor: '#EF4444',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hsCodeBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00236f',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  urgentText: {
    color: '#DC2626',
  },
  normalText: {
    color: '#2563EB',
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
  regFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  regMeta: {
    fontSize: 10,
    color: '#64748B',
  },
});
