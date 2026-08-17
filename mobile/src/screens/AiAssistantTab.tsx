import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    text: 'Xin chào! Tôi là Trợ lý AI Pháp lý Themis. Tôi có thể giúp bạn giải đáp các quy định Hải quan Trung Quốc (GACC), chỉ tiêu Cadmium (GB 2762-2022) hoặc mã số CIFER/PUC/PHC cho Sầu riêng xuất khẩu.',
    timestamp: 'Just now',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Ngưỡng Cadmium tối đa cho phép đối với sầu riêng tươi xuất khẩu sang Trung Quốc là bao nhiêu?',
    timestamp: 'Just now',
  },
  {
    id: '3',
    sender: 'ai',
    text: 'Theo QCVN GB 2762-2022 của Trung Quốc, ngưỡng tối đa cho phép đối với kim loại nặng Cadmium trong sầu riêng tươi là 0.05 mg/kg. Nếu lô hàng của bạn vượt quá 0.040 mg/kg, hệ thống sẽ tự động phát cảnh báo khẩn cấp tiệm cận điểm mù!',
    timestamp: 'Just now',
  },
];

export function AiAssistantTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');

  const handleSend = useCallback(() => {
    if (!inputQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputQuery.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Về thắc mắc "${userMsg.text}", theo Nghị định thư Hải quan GACC 2024: Bạn cần duy trì mã số vùng trồng PUC và cơ sở đóng gói PHC hợp lệ, đồng thời kiểm tra Giấy Phyto trước thời hạn 14 ngày.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  }, [inputQuery]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.chatBody} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgBubble,
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={msg.sender === 'user' ? styles.userText : styles.aiText}>
              {msg.text}
            </Text>
            <Text style={styles.msgTime}>{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Chat Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Hỏi AI về quy định GACC, Cadmium..."
          placeholderTextColor="#94A3B8"
          value={inputQuery}
          onChangeText={setInputQuery}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
          <Text style={styles.sendBtnText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatBody: {
    padding: 16,
    gap: 12,
  },
  msgBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userBubble: {
    backgroundColor: '#00236f',
    alignSelf: 'flex-end',
  },
  aiText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 19,
  },
  userText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 19,
  },
  msgTime: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  sendBtn: {
    backgroundColor: '#00236f',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
