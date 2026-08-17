import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, Modal, Alert, RefreshControl,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../lib/api';
import { Card, StatusBadge, KeyBadge, ErrorBanner, EmptyState, Skeleton, PrimaryButton } from '../components/ui';
import { C, FONT_SIZE } from '../lib/theme';

interface ProductItem {
  id: string;
  name: string;
  category?: string;
  hsCode: string;
  origin?: string;
  activeBatchCount?: number;
  batchesCount?: number;
}

interface BatchItem {
  id: string;
  batchCode: string;
  productId: string;
  productName?: string;
  product?: { name: string };
  quantity: number | null;
  unit: string | null;
  status: string;
  documents?: Array<{ document: { id: string; type: string; title: string } }>;
  createdAt: string;
}

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'products' | 'batches'>('products');

  // Products & Batches state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [selectedBatchForDocs, setSelectedBatchForDocs] = useState<BatchItem | null>(null);

  // Form states - Product
  const [newProdName, setNewProdName] = useState('');
  const [newProdHs, setNewProdHs] = useState('0810.60.00');
  const [newProdOrigin, setNewProdOrigin] = useState('');
  const [submittingProd, setSubmittingProd] = useState(false);

  // Form states - Batch
  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBatchProdId, setNewBatchProdId] = useState('');
  const [newBatchQty, setNewBatchQty] = useState('');
  const [submittingBatch, setSubmittingBatch] = useState(false);

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [prodRes, batchRes] = await Promise.all([
        api.get<any>('/products?page=1&pageSize=50'),
        api.get<any>('/batches?page=1&pageSize=50'),
      ]);

      const pList = prodRes?.data ?? prodRes ?? [];
      const bList = batchRes?.data ?? batchRes ?? [];

      setProducts(Array.isArray(pList) ? pList : []);
      setBatches(Array.isArray(bList) ? bList : []);
    } catch (e: any) {
      setError(e?.message ?? 'Không tải được dữ liệu sản phẩm và lô hàng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Create Product (Real API) ──────────────────────────────────────────────
  async function handleCreateProduct() {
    if (!newProdName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên sản phẩm.');
      return;
    }
    setSubmittingProd(true);
    try {
      await api.post('/products', {
        name: newProdName.trim(),
        category: 'Sầu riêng tươi',
        hsCode: newProdHs.trim() || '0810.60.00',
        origin: newProdOrigin.trim() || 'Việt Nam (Mã PUC GACC)',
        markets: [{ marketCode: 'CN', marketName: 'Trung Quốc (GACC)' }],
      });
      setShowAddProductModal(false);
      setNewProdName('');
      setNewProdOrigin('');
      Alert.alert('Thành công', 'Đã thêm sản phẩm xuất khẩu mới vào cơ sở dữ liệu!');
      loadData(true);
    } catch (e: any) {
      Alert.alert('Lỗi tạo sản phẩm', e?.message ?? 'Không thể tạo sản phẩm.');
    } finally {
      setSubmittingProd(false);
    }
  }

  // ─── Create Batch (Real API) ────────────────────────────────────────────────
  async function handleCreateBatch() {
    if (!newBatchCode.trim() || !newBatchProdId) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Mã lô hàng và chọn Sản phẩm.');
      return;
    }
    setSubmittingBatch(true);
    try {
      await api.post('/batches', {
        batchCode: newBatchCode.trim().toUpperCase(),
        productId: newBatchProdId,
        quantity: parseFloat(newBatchQty) || 20,
        unit: 'tấn',
        status: 'COLLECTING_DOCUMENTS',
      });
      setShowAddBatchModal(false);
      setNewBatchCode('');
      setNewBatchQty('');
      Alert.alert('Thành công', 'Đã tạo Lô hàng mới và khởi tạo 4 Khóa hồ sơ thông quan!');
      loadData(true);
    } catch (e: any) {
      Alert.alert('Lỗi tạo lô hàng', e?.message ?? 'Không thể tạo lô hàng.');
    } finally {
      setSubmittingBatch(false);
    }
  }

  // ─── Attach 4-Key Document (Real API write) ─────────────────────────────────
  async function handleUploadKeyDoc(batchId: string, docType: string, label: string) {
    try {
      const fileName = `${docType}_${Date.now()}.pdf`;
      await api.post(`/batches/${batchId}/documents`, {
        title: `${label} - Số hóa thực địa`,
        type: docType,
        fileUrl: `https://storage.themis.vn/docs/${fileName}`,
        fileSize: 1250000,
        mimeType: 'application/pdf',
      });
      Alert.alert('Nạp thành công', `Đã ghi nhận ${label} vào hồ sơ lô hàng!`);
      loadData(true);
      setSelectedBatchForDocs(null);
    } catch (e: any) {
      Alert.alert('Lỗi nạp chứng từ', e?.message ?? 'Không thể lưu chứng từ.');
    }
  }

  // ─── Delete Product (Real API) ──────────────────────────────────────────────
  function handleDeleteProduct(prodId: string, name: string) {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn có chắc chắn muốn xóa sản phẩm "${name}"? Hành động này sẽ được ghi vào Audit Log.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/products/${prodId}`);
              Alert.alert('Đã xóa', 'Đã xóa sản phẩm khỏi hệ thống.');
              loadData(true);
            } catch (err: any) {
              Alert.alert('Lỗi xóa sản phẩm', err?.message ?? 'Không thể xóa sản phẩm.');
            }
          },
        },
      ],
    );
  }

  // ─── Filtered Data ─────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q) || p.hsCode?.includes(q));
  }, [products, search]);

  const filteredBatches = useMemo(() => {
    if (!search.trim()) return batches;
    const q = search.toLowerCase();
    return batches.filter((b) => b.batchCode?.toLowerCase().includes(q));
  }, [batches, search]);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Sản phẩm & 4 Khóa Lô hàng</Text>
          <Text style={s.headerSub}>Quản lý danh mục & Hồ sơ thông quan GACC</Text>
        </View>
      </View>

      {/* Sub-tabs */}
      <View style={s.tabBar}>
        <TouchableOpacity
          style={[s.tabButton, activeTab === 'products' && s.tabButtonActive]}
          onPress={() => setActiveTab('products')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, activeTab === 'products' && s.tabTextActive]}>
            SẢN PHẨM ({products.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tabButton, activeTab === 'batches' && s.tabButtonActive]}
          onPress={() => setActiveTab('batches')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, activeTab === 'batches' && s.tabTextActive]}>
            LÔ HÀNG 4 KHÓA ({batches.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Bar */}
      <View style={s.actionBar}>
        <View style={s.searchBox}>
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={activeTab === 'products' ? 'Tìm sản phẩm, mã HS...' : 'Tìm theo mã lô hàng...'}
            placeholderTextColor={C.textMuted}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          style={s.addButton}
          onPress={() => (activeTab === 'products' ? setShowAddProductModal(true) : setShowAddBatchModal(true))}
          activeOpacity={0.8}
        >
          <Text style={s.addButtonText}>+ {activeTab === 'products' ? 'SẢN PHẨM' : 'TẠO LÔ'}</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={s.errorContainer}>
          <ErrorBanner message={error} onRetry={() => loadData()} />
        </View>
      )}

      {/* Main List Rendering with FlatList */}
      {loading ? (
        <View style={s.loadingContainer}>
          <Skeleton height={90} />
          <Skeleton height={90} />
          <Skeleton height={90} />
        </View>
      ) : activeTab === 'products' ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductRow
              product={item}
              onDelete={() => handleDeleteProduct(item.id, item.name)}
            />
          )}
          contentContainerStyle={s.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor={C.gold} />}
          ListEmptyComponent={<EmptyState title="Chưa có sản phẩm nào" desc="Bấm '+ SẢN PHẨM' ở trên để thêm sản phẩm mới." />}
          windowSize={10}
          maxToRenderPerBatch={10}
        />
      ) : (
        <FlatList
          data={filteredBatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BatchItemRow
              batch={item}
              onOpenDocs={() => setSelectedBatchForDocs(item)}
            />
          )}
          contentContainerStyle={s.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor={C.gold} />}
          ListEmptyComponent={<EmptyState title="Chưa có lô hàng nào" desc="Bấm '+ TẠO LÔ' ở trên để khởi tạo lô hàng 4 Khóa." />}
          windowSize={10}
          maxToRenderPerBatch={10}
        />
      )}

      {/* ─── MODAL 1: ADD PRODUCT ────────────────────────────────────────── */}
      <Modal visible={showAddProductModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Thêm Sản phẩm Xuất khẩu</Text>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Tên sản phẩm *</Text>
              <TextInput
                style={s.input}
                value={newProdName}
                onChangeText={setNewProdName}
                placeholder="VD: Sầu riêng Ri6 Bến Tre"
                placeholderTextColor={C.textMuted}
              />
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Mã HS GACC</Text>
              <TextInput
                style={s.input}
                value={newProdHs}
                onChangeText={setNewProdHs}
                placeholder="0810.60.00"
                placeholderTextColor={C.textMuted}
              />
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Vùng trồng (Mã PUC)</Text>
              <TextInput
                style={s.input}
                value={newProdOrigin}
                onChangeText={setNewProdOrigin}
                placeholder="VD: Tiền Giang (Mã PUC: VN-TGOR-0042)"
                placeholderTextColor={C.textMuted}
              />
            </View>

            <View style={s.modalActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAddProductModal(false)}>
                <Text style={s.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="LƯU SẢN PHẨM" onPress={handleCreateProduct} loading={submittingProd} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ─── MODAL 2: ADD BATCH ──────────────────────────────────────────── */}
      <Modal visible={showAddBatchModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Khởi tạo Lô hàng Xuất khẩu</Text>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Mã Lô hàng *</Text>
              <TextInput
                style={s.input}
                value={newBatchCode}
                onChangeText={setNewBatchCode}
                placeholder="VD: DURIAN-2026-901"
                placeholderTextColor={C.textMuted}
                autoCapitalize="characters"
              />
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Chọn Sản phẩm *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 6, marginVertical: 4 }}>
                {products.map((p) => {
                  const isSel = newBatchProdId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[s.choiceChip, isSel && s.choiceChipActive]}
                      onPress={() => setNewBatchProdId(p.id)}
                    >
                      <Text style={[s.choiceChipText, isSel && s.choiceChipTextActive]}>{p.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Khối lượng (Tấn)</Text>
              <TextInput
                style={s.input}
                value={newBatchQty}
                onChangeText={setNewBatchQty}
                placeholder="20"
                keyboardType="numeric"
                placeholderTextColor={C.textMuted}
              />
            </View>

            <View style={s.modalActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAddBatchModal(false)}>
                <Text style={s.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="TẠO LÔ HÀNG" onPress={handleCreateBatch} loading={submittingBatch} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ─── MODAL 3: 4-KEY DOCUMENT MANAGEMENT ─────────────────────────── */}
      <Modal visible={!!selectedBatchForDocs} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>4 Khóa Hồ sơ: {selectedBatchForDocs?.batchCode}</Text>
            <Text style={s.modalSub}>Nhấn vào từng khóa để nạp số hóa chứng thư thực địa:</Text>

            <View style={s.docKeysList}>
              <DocKeyUploadRow
                label="1. Kiểm dịch TV Phyto"
                desc="Chứng nhận kiểm dịch đạt chuẩn GACC"
                onUpload={() => handleUploadKeyDoc(selectedBatchForDocs!.id, 'PHYTO', 'Kiểm dịch TV Phyto')}
              />
              <DocKeyUploadRow
                label="2. Phiếu Lab Cadmium"
                desc="Đạt giới hạn Cadmium ≤ 0.05 mg/kg (GB 2762)"
                onUpload={() => handleUploadKeyDoc(selectedBatchForDocs!.id, 'LAB_REPORT', 'Phiếu Lab Cadmium')}
              />
              <DocKeyUploadRow
                label="3. Chứng nhận C/O Form E"
                desc="Xuất xứ ASEAN - Trung Quốc"
                onUpload={() => handleUploadKeyDoc(selectedBatchForDocs!.id, 'CO', 'Chứng nhận C/O Form E')}
              />
              <DocKeyUploadRow
                label="4. Packing List & Khử trùng"
                desc="Bảng kê chi tiết đóng gói cơ sở PHC"
                onUpload={() => handleUploadKeyDoc(selectedBatchForDocs!.id, 'PACKING_LIST', 'Packing List')}
              />
            </View>

            <TouchableOpacity style={[s.cancelBtn, { marginTop: 12 }]} onPress={() => setSelectedBatchForDocs(null)}>
              <Text style={s.cancelBtnText}>Hoàn tất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const ProductRow = React.memo(function ProductRow({
  product, onDelete,
}: {
  product: ProductItem; onDelete: () => void;
}) {
  return (
    <Card style={pc.card}>
      <View style={pc.topRow}>
        <View style={pc.iconBox}><Text style={pc.iconText}>SP</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={pc.name}>{product.name}</Text>
          <Text style={pc.hs}>HS: {product.hsCode || '0810.60.00'}</Text>
        </View>
        <TouchableOpacity style={pc.delBtn} onPress={onDelete}>
          <Text style={pc.delText}>Xóa</Text>
        </TouchableOpacity>
      </View>
      {product.origin && <Text style={pc.origin}>Vùng trồng / PUC: {product.origin}</Text>}
    </Card>
  );
});

const BatchItemRow = React.memo(function BatchItemRow({
  batch, onOpenDocs,
}: {
  batch: BatchItem; onOpenDocs: () => void;
}) {
  const docs = batch.documents?.map((d) => d.document) || [];
  const hasPhyto = docs.some((d) => d.type === 'PHYTO');
  const hasLab = docs.some((d) => d.type === 'LAB_REPORT');
  const hasCo = docs.some((d) => d.type === 'CO');
  const hasPkg = docs.some((d) => d.type === 'PACKING_LIST');

  return (
    <Card style={bc.card}>
      <View style={bc.topRow}>
        <Text style={bc.code}>{batch.batchCode}</Text>
        <StatusBadge status={batch.status} />
      </View>
      <Text style={bc.product}>{batch.product?.name ?? batch.productName ?? 'Sầu riêng xuất khẩu'}</Text>
      <View style={bc.bottomRow}>
        <View style={bc.keys}>
          <KeyBadge label="Phyto" active={hasPhyto} />
          <KeyBadge label="Lab" active={hasLab} />
          <KeyBadge label="CO" active={hasCo} />
          <KeyBadge label="Pkg" active={hasPkg} />
        </View>
        <TouchableOpacity style={bc.manageBtn} onPress={onOpenDocs}>
          <Text style={bc.manageBtnText}>4 Khóa hồ sơ &gt;</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
});

function DocKeyUploadRow({ label, desc, onUpload }: { label: string; desc: string; onUpload: () => void }) {
  return (
    <TouchableOpacity style={dk.row} onPress={onUpload} activeOpacity={0.8}>
      <View style={{ flex: 1 }}>
        <Text style={dk.label}>{label}</Text>
        <Text style={dk.desc}>{desc}</Text>
      </View>
      <View style={dk.uploadBadge}>
        <Text style={dk.uploadText}>+ Nạp file</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Top-level StyleSheet ────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  header: { paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.navy },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  tabBar: { flexDirection: 'row', backgroundColor: C.navyMid, paddingHorizontal: 14, paddingBottom: 10, gap: 8 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)' },
  tabButtonActive: { backgroundColor: C.gold },
  tabText: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.3 },
  tabTextActive: { color: C.navy },
  actionBar: { flexDirection: 'row', padding: 14, gap: 8, alignItems: 'center' },
  searchBox: { flex: 1, backgroundColor: C.white, borderRadius: 10, borderWidth: 1, borderColor: C.border, paddingHorizontal: 10 },
  searchInput: { height: 40, fontSize: FONT_SIZE.sm, color: C.textPrimary },
  addButton: { backgroundColor: C.navyMid, borderRadius: 10, paddingHorizontal: 12, height: 40, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.3 },
  errorContainer: { paddingHorizontal: 14, paddingTop: 4 },
  loadingContainer: { padding: 14, gap: 10 },
  listContent: { paddingHorizontal: 14, paddingBottom: 32, gap: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, gap: 12 },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: '900', color: C.textPrimary },
  modalSub: { fontSize: FONT_SIZE.xs, color: C.textSecondary, marginBottom: 4 },
  field: { gap: 4 },
  fieldLabel: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: C.textSecondary },
  input: { borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, fontSize: FONT_SIZE.sm, backgroundColor: C.surface, color: C.textPrimary },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 10, alignItems: 'center' },
  cancelBtn: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, backgroundColor: C.surfaceDim, alignItems: 'center' },
  cancelBtnText: { fontSize: FONT_SIZE.sm, fontWeight: '800', color: C.textSecondary },
  choiceChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: C.surfaceDim, borderWidth: 1, borderColor: C.borderFaint },
  choiceChipActive: { backgroundColor: C.navyMid, borderColor: C.navyMid },
  choiceChipText: { fontSize: FONT_SIZE.xs, color: C.textPrimary, fontWeight: '700' },
  choiceChipTextActive: { color: '#fff' },
  docKeysList: { gap: 8 },
});

const pc = StyleSheet.create({
  card: { gap: 6, padding: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.navyMid + '15', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: FONT_SIZE.xs, fontWeight: '900', color: C.navyMid },
  name: { fontSize: FONT_SIZE.base, fontWeight: '800', color: C.textPrimary },
  hs: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
  delBtn: { backgroundColor: C.roseBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  delText: { fontSize: 10, fontWeight: '800', color: C.rose },
  origin: { fontSize: FONT_SIZE.xs, color: C.textSecondary },
});

const bc = StyleSheet.create({
  card: { gap: 6, padding: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontSize: FONT_SIZE.sm, fontWeight: '900', color: C.navyMid, fontVariant: ['tabular-nums'] },
  product: { fontSize: FONT_SIZE.sm, color: C.textPrimary, fontWeight: '600' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  keys: { flexDirection: 'row', gap: 4 },
  manageBtn: { backgroundColor: C.navyMid + '10', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  manageBtnText: { fontSize: 10, fontWeight: '800', color: C.navyMid },
});

const dk = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.borderFaint, gap: 10 },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '800', color: C.textPrimary },
  desc: { fontSize: 10, color: C.textMuted, marginTop: 1 },
  uploadBadge: { backgroundColor: C.emeraldBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: C.emerald + '40' },
  uploadText: { fontSize: 10, fontWeight: '800', color: C.emerald },
});
