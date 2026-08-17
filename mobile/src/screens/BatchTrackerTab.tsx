import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MobileBatchItem, LoadingStatus } from '../types';
import { fetchMobileBatches } from '../api/client';
import { BatchItemCard } from '../components/BatchItemCard';

export function BatchTrackerTab() {
  const [status, setStatus] = useState<LoadingStatus>('idle');
  const [batches, setBatches] = useState<MobileBatchItem[]>([]);

  const loadBatchesData = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchMobileBatches();
      setBatches(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadBatchesData();
  }, [loadBatchesData]);

  const renderHeader = useMemo(() => {
    return (
      <View style={styles.headerArea}>
        <Text style={styles.sectionTitle}>QUẢN LÝ LÔ HÀNG SẦU RIÊNG XUẤT KHẨU</Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: MobileBatchItem) => item.id, []);

  const renderItem = useCallback(({ item }: { item: MobileBatchItem }) => {
    return <BatchItemCard item={item} />;
  }, []);

  const renderEmpty = useCallback(() => {
    if (status === 'loading') return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Chưa có lô hàng xuất khẩu nào</Text>
        <Text style={styles.emptyDesc}>Các lô sầu riêng mới được khởi tạo sẽ hiển thị tại đây.</Text>
      </View>
    );
  }, [status]);

  if (status === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00236f" />
        <Text style={styles.loadingText}>Đang nạp danh sách Lô hàng xuất khẩu...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Không thể nạp dữ liệu lô hàng từ Backend API</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadBatchesData}>
          <Text style={styles.retryBtnText}>🔄 Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={batches}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00236f',
    letterSpacing: 0.5,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
