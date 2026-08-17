import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RegulationItem } from '../types';

interface RegulationItemCardProps {
  item: RegulationItem;
}

export const RegulationItemCard = React.memo(function RegulationItemCard({ item }: RegulationItemCardProps) {
  return (
    <View style={styles.regCard}>
      <Text style={styles.regTitle} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={styles.regDesc} numberOfLines={3} ellipsizeMode="tail">
        {item.description}
      </Text>
      <View style={styles.regFooter}>
        <Text style={styles.regMeta}>🏛️ {item.authority}</Text>
        <Text style={styles.regMeta}>📅 {item.issuedDate}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  regCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#c5c5d3',
    marginBottom: 12,
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
  regFooter: {
    flexDirection: 'row',
    justify.content: 'space-between',
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
