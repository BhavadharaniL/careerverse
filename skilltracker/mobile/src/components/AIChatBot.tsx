import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import { aiAPI } from '../services/api';

const AIChatBot = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hello! I am your CareerVerse AI Counselor. Ask me anything about exam structures, resume formatting, preparation tracks, or job discovery!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText.trim();
    setInputText('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    
    // Auto-scroll
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    setLoading(true);
    try {
      // Package conversation history
      const history = newMessages.slice(1, -1);
      const response = await aiAPI.submitChat(userMsg, history);
      
      setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "I encountered an error connecting to my AI core. Please check your connection and try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <View key={i} style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
              {!isUser && (
                <View style={styles.botIconWrapper}>
                  <Sparkles size={14} color="#ffffff" />
                </View>
              )}
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
                  {m.content}
                </Text>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.bubbleWrapper}>
            <View style={styles.botIconWrapper}>
              <Sparkles size={14} color="#ffffff" />
            </View>
            <View style={[styles.bubble, styles.botBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color="#1a73e8" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          placeholder="Ask CareerVerse AI..."
          placeholderTextColor="#9aa0a6"
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
          <Send size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIChatBot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  chatArea: {
    flex: 1
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start'
  },
  userWrapper: {
    justifyContent: 'flex-end'
  },
  botWrapper: {
    justifyContent: 'flex-start'
  },
  botIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16
  },
  userBubble: {
    backgroundColor: '#e8f0fe',
    borderTopRightRadius: 4
  },
  botBubble: {
    backgroundColor: '#f1f3f4',
    borderTopLeftRadius: 4
  },
  loadingBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20
  },
  userText: {
    color: '#1a73e8'
  },
  botText: {
    color: '#202124'
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 14,
    color: '#202124',
    maxHeight: 100,
    backgroundColor: '#f8f9fa'
  },
  sendBtn: {
    backgroundColor: '#1a73e8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  }
});
