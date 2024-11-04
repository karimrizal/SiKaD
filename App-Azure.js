
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import sendMessageToAzure from './api/azureApi';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputText('');

    const azureResponse = await sendMessageToAzure(inputText);
    if (azureResponse) {
      const botMessage = { id: Date.now().toString(), text: azureResponse.answer, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={messages} renderItem={renderMessage} keyExtractor={(item) => item.id} />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={inputText} onChangeText={setInputText} placeholder="Type a message" />
        <Button title="Send" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 5 },
  botMessage: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  userMessage: { backgroundColor: '#007aff', alignSelf: 'flex-end', color: 'white' },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
});

export default App;
