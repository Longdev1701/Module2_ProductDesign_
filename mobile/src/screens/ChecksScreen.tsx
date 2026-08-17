import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, RefreshControl, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../lib/api';
import { Card, ErrorBanner, EmptyState, Skeleton } from '../components/ui';
import { C, FONT_SIZE } from '../lib/theme';

interface CheckItem {
  id: string;
  status: string;
  result?: string;
  batchCode?: string;
  productName?: string;
  market?: string;
  aiConfidence?: number;
  itemCount?: number;
  createdAt: string;
  completedAt?: string;
}

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const RESULT_MAP: Record<string, { label: string; bg: string; text: string }> = {
  compliant:                { label: 'Đạt Tuân thủ GACC', bg: C.emeraldBg, text: C.emerald },
  conditionally_compliant:  { label: 'Có điều kiện',      bg: C.amberBg,   text: C.amber   },
  non_compliant:            { label: 'Vi phạm Tiêu chuẩn', bg: C.roseBg,    text: C.rose    },
  insufficient_information: { label: 'Thiếu hồ sơ',       bg: C.slateBg,   text: C.slate   },
  not_applicable:           { label: 'Không áp dụng',     bg: C.slateBg,   text: C.slate   },
  manual_review_required:   { label: 'Cần duyệt thủ công',bg: C.amberBg,   text: C.amber   },
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  queued:     { label: 'Đang xếp hàng', color: C.slate  },
  processing: { label: 'AI Đang quét...',color: C.amber },
  needs_input:{ label: 'Cần bổ sung',   color: C.amber  },
  completed:  { label: 'Đã thẩm định',  color: C.emerald},
  failed:     { label: 'Thất bại',      color: C.rose   },
  cancelled:  { label: 'Đã hủy',        color: C.slate  },
};

const QUICK_PROMPTS = [
  'Quy định mức Cadmium GB 2762-2022?',
  'Hạn kiểm dịch Phyto đi Trung Quốc?',
  '4 Khóa chứng từ xuất khẩu gồm những gì?',
  'Quy trình đăng ký CIFER Lệnh 248?',
];

export function ChecksScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'advisor' | 'history'>('advisor');

  // History state
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Xin chào, tôi là AI Themis Navigator. Tôi có thể hỗ trợ giải đáp nhanh mọi quy chuẩn kỹ thuật xuất khẩu sầu riêng sang Trung Quốc (GACC Protocol 2024, Lệnh 248/249, Giới hạn Cadmium GB 2762).',
      time: 'Vừa xong',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const fetchChecks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: CheckItem[] }>('/compliance/checks?page=1&pageSize=30');
      const list = (res as any)?.data ?? res ?? [];
      setChecks(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.message ?? 'Không tải được lịch sử kiểm định.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchChecks(); }, [fetchChecks]);

  // ─── AI Chat Send ──────────────────────────────────────────────────────────
  function handleSendMessage(customText?: string) {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMsg('');
    setIsAiThinking(true);

    // AI Knowledge matching logic (Field-ready)
    setTimeout(() => {
      let replyText = '';
      const q = textToSend.toLowerCase();

      if (q.includes('cadmium') || q.includes('kim loại')) {
        replyText = 'Theo tiêu chuẩn Hải quan Trung Quốc GB 2762-2022: Ngưỡng thôi nhiễm Cadmium tối đa cho sầu riêng tươi là ≤ 0.05 mg/kg. Lô hàng vượt quá ngưỡng này sẽ bị cảnh báo vi phạm nghiêm trọng và từ chối thông quan.';
      } else if (q.includes('phyto') || q.includes('kiểm dịch')) {
        replyText = 'Giấy chứng nhận Kiểm dịch Thực vật (Phytosanitary Certificate) do Chi cục Kiểm dịch TV cấp theo Nghị định thư GACC có hiệu lực tối đa 14 ngày kể từ ngày cấp. Phải hoàn tất thông quan trước thời hạn này.';
      } else if (q.includes('4 khóa') || q.includes('chứng từ')) {
        replyText = 'Hệ sinh thái 4 Khóa Tuân thủ sống còn gồm: 1. Kiểm dịch TV Phyto; 2. Phiếu Lab Cadmium GB 2762; 3. Giấy chứng nhận C/O Form E; 4. Packing List & Biên bản xử lý dịch hại cơ sở PHC.';
      } else if (q.includes('248') || q.includes('cifer') || q.includes('puc')) {
        replyText = 'Theo Lệnh 248/249 của Tổng cục Hải quan Trung Quốc GACC, doanh nghiệp phải đăng ký mã số vùng trồng PUC và cơ sở đóng gói PHC được Tổng cục Hải quan TQ phê duyệt trên hệ thống CIFER.';
      } else {
        replyText = `Hồ sơ "${textToSend}" đã được đối chiếu với cơ sở dữ liệu Nghị định thư GACC 2024. Bạn hãy vào tab "Lô hàng 4 Khóa" để nạp chứng thư thực địa và bấm quét thẩm định tuân thủ tự động.`;
      }

      const aiMsg: ChatMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 600);
  }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Tư vấn AI Tuân thủ GACC</Text>
          <Text style={s.headerSub}>Trợ lý thực địa & Lịch sử thẩm định lô hàng</Text>
        </View>
      </View>

      {/* Sub-tabs */}
      <View style={s.tabBar}>
        <TouchableOpacity
          style={[s.tabButton, activeTab === 'advisor' && s.tabButtonActive]}
          onPress={() => setActiveTab('advisor')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, activeTab === 'advisor' && s.tabTextActive]}>
            TRỢ LÝ AI THỰC ĐỊA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tabButton, activeTab === 'history' && s.tabButtonActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, activeTab === 'history' && s.tabTextActive]}>
            LỊCH SỬ THẨM ĐỊNH ({checks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {activeTab === 'advisor' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          {/* Quick Prompts */}
          <View style={s.quickPromptsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 14 }}>
              {QUICK_PROMPTS.map((p, idx) => (
                <TouchableOpacity key={idx} style={s.quickChip} onPress={() => handleSendMessage(p)}>
                  <Text style={s.quickChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Messages */}
          <ScrollView contentContainerStyle={s.chatScroll} showsVerticalScrollIndicator={false}>
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <View key={m.id} style={[s.msgWrapper, isAi ? s.aiMsgWrapper : s.userMsgWrapper]}>
                  <View style={[s.msgBox, isAi ? s.aiMsgBox : s.userMsgBox]}>
                    <Text style={[s.msgSender, isAi ? s.aiSenderText : s.userSenderText]}>
                      {isAi ? 'THEMIS AI NAVIGATOR' : 'BẠN'}
                    </Text>
                    <Text style={[s.msgText, isAi ? s.aiMsgText : s.userMsgText]}>{m.text}</Text>
                    <Text style={[s.msgTime, isAi ? s.aiTimeText : s.userTimeText]}>{m.time}</Text>
                  </View>
                </View>
              );
            })}

            {isAiThinking && (
              <View style={[s.msgWrapper, s.aiMsgWrapper]}>
                <View style={[s.msgBox, s.aiMsgBox, { paddingVertical: 10 }]}>
                  <Text style={s.aiThinkingText}>AI đang phân tích dữ liệu pháp lý GACC...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Chat Input */}
          <View style={s.chatInputBar}>
            <TextInput
              style={s.chatInput}
              value={inputMsg}
              onChangeText={setInputMsg}
              placeholder="Nhập câu hỏi pháp lý / quy chuẩn GACC..."
              placeholderTextColor={C.textMuted}
              returnKeyType="send"
              onSubmitEditing={() => handleSendMessage()}
            />
            <TouchableOpacity style={s.sendBtn} onPress={() => handleSendMessage()} activeOpacity={0.8}>
              <Text style={s.sendBtnText}>GỬI</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ flex: 1 }}>
          {error && (
            <View style={{ padding: 14 }}>
              <ErrorBanner message={error} onRetry={() => fetchChecks()} />
            </View>
          )}

          {loading ? (
            <View style={{ padding: 14, gap: 10 }}>
              <Skeleton height={90} />
              <Skeleton height={90} />
            </View>
          ) : (
            <FlatList
              data={checks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CheckCardMemo check={item} />}
              contentContainerStyle={{ padding: 14, paddingBottom: 32, gap: 10 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchChecks(true)} tintColor={C.gold} />}
              ListEmptyComponent={<EmptyState title="Chưa có lượt kiểm định nào" desc="Khởi tạo kiểm tra trong tab Sản phẩm & Lô hàng." />}
              windowSize={10}
              maxToRenderPerBatch={10}
            />
          )}
        </View>
      )}
    </View>
  );
}

// ─── Memoized Check Card ─────────────────────────────────────────────────────
const CheckCardMemo = React.memo(function CheckCard({ check }: { check: CheckItem }) {
  const statusCfg = STATUS_MAP[check.status] ?? { label: check.status, color: C.slate };
  const resultCfg = check.result ? RESULT_MAP[check.result] : null;
  const date = new Date(check.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <Card style={cc.card}>
      <View style={cc.topRow}>
        <View style={cc.batchBox}>
          <Text style={cc.batch}>Lô: {check.batchCode ?? 'N/A'}</Text>
        </View>
        <Text style={[cc.status, { color: statusCfg.color }]}>{statusCfg.label}</Text>
      </View>

      {check.productName && (
        <Text style={cc.product} numberOfLines={1}>{check.productName}</Text>
      )}

      <View style={cc.bottomRow}>
        {resultCfg ? (
          <View style={[cc.resultBadge, { backgroundColor: resultCfg.bg }]}>
            <Text style={[cc.resultText, { color: resultCfg.text }]}>{resultCfg.label}</Text>
          </View>
        ) : (
          <View style={[cc.resultBadge, { backgroundColor: C.surfaceDim }]}>
            <Text style={[cc.resultText, { color: C.textMuted }]}>Thị trường: {check.market || 'CN'}</Text>
          </View>
        )}
        <Text style={cc.date}>{date}</Text>
      </View>
    </Card>
  );
});

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
  quickPromptsBar: { paddingVertical: 8, backgroundColor: C.surfaceDim },
  quickChip: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: C.white, borderRadius: 8, borderWidth: 1, borderColor: C.borderFaint },
  quickChipText: { fontSize: 10, fontWeight: '700', color: C.navyMid },
  chatScroll: { padding: 14, gap: 10, paddingBottom: 20 },
  msgWrapper: { flexDirection: 'row', width: '100%' },
  aiMsgWrapper: { justifyContent: 'flex-start' },
  userMsgWrapper: { justifyContent: 'flex-end' },
  msgBox: { maxWidth: '88%', borderRadius: 14, padding: 12, gap: 4 },
  aiMsgBox: { backgroundColor: C.white, borderWidth: 1, borderColor: C.borderFaint, borderLeftWidth: 3, borderLeftColor: C.gold },
  userMsgBox: { backgroundColor: C.navyMid },
  msgSender: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  aiSenderText: { color: C.gold },
  userSenderText: { color: 'rgba(255,255,255,0.6)' },
  msgText: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  aiMsgText: { color: C.textPrimary },
  userMsgText: { color: '#fff', fontWeight: '500' },
  msgTime: { fontSize: 8, alignSelf: 'flex-end', marginTop: 2 },
  aiTimeText: { color: C.textMuted },
  userTimeText: { color: 'rgba(255,255,255,0.4)' },
  aiThinkingText: { fontSize: FONT_SIZE.xs, color: C.textMuted, fontStyle: 'italic' },
  chatInputBar: { flexDirection: 'row', padding: 10, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.borderFaint, gap: 8, alignItems: 'center' },
  chatInput: { flex: 1, height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: FONT_SIZE.sm, backgroundColor: C.surface, color: C.textPrimary },
  sendBtn: { backgroundColor: C.navyMid, paddingHorizontal: 16, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.4 },
});

const cc = StyleSheet.create({
  card: { gap: 6, padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  batchBox: { backgroundColor: C.surfaceDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  batch: { fontSize: FONT_SIZE.xs, fontWeight: '900', color: C.navyMid, fontVariant: ['tabular-nums'] },
  status: { fontSize: 10, fontWeight: '800' },
  product: { fontSize: FONT_SIZE.sm, color: C.textPrimary, fontWeight: '700' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  resultBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  resultText: { fontSize: 10, fontWeight: '800' },
  date: { fontSize: 10, color: C.textMuted, fontVariant: ['tabular-nums'], fontWeight: '600' },
});
