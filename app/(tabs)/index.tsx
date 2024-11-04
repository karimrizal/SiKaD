import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const tableData = [
    { key: 1, name: 'Buton', value: 100 },
    { key: 2, name: 'Muna', value: 200 },
    { key: 3, name: 'Konawe', value: 300 },
  ];

  const chartData = {
    labels: ['Buton', 'Muna', 'Konawe'],
    datasets: [
      {
        data: [100, 200, 300],
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
      },
    ],
  };

  useEffect(() => {
    AsyncStorage.clear();
  // loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    const savedChatHistory = await AsyncStorage.getItem('chatHistory');
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  };

  const saveChatHistory = async (newHistory) => {
    await AsyncStorage.setItem('chatHistory', JSON.stringify(newHistory));
  };

  const handleSend = () => {
    if (searchQuery.trim()) {
      const userMessage = { type: 'user', text: searchQuery };
      let siKaDResponse;

      // Determine SiKaD's response based on input
      if (searchQuery.toLowerCase().includes('pdrb')) {
        siKaDResponse = { type: 'sikad', text: 'Menampilkan Data PDRB' };
      } else {
        siKaDResponse = { type: 'sikad', text: 'Maaf, tidak ada data' };
      }

      const updatedHistory = [...chatHistory, userMessage, siKaDResponse];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      setSearchQuery('');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Card>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="archive-search" size={18} color="white" />
            <Text style={styles.headerText}>SiKaD</Text>
          </View>
        </View>
      </Card>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {chatHistory.map((message, index) => (
            <View
              key={index}
              style={message.type === 'user' ? styles.userContainer : styles.sikadContainer}
            >
              <Text style={message.type === 'user' ? styles.userText : styles.sikadText}>
                {message.type === 'user' ? 'User: ' : 'SiKaD: '}
                {message.text}
              </Text>
              {message.type === 'sikad' && message.text === 'Menampilkan Data PDRB' && (
                <>
                  <Text style={styles.sectionTitle}>Tabel</Text>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Kab/Kota</DataTable.Title>
                      <DataTable.Title numeric>Nilai</DataTable.Title>
                    </DataTable.Header>
                    {tableData.map((row) => (
                      <DataTable.Row key={row.key}>
                        <DataTable.Cell>{row.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{row.value}</DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>

                  <Text style={styles.sectionTitle}>Grafik</Text>
                  <LineChart
                    data={chartData}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#fff',
                      backgroundGradientFrom: '#f7f7f7',
                      backgroundGradientTo: '#e0e0e0',
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    style={styles.chart}
                  />
                  <Text style={styles.fenomena}>Link Fenomena</Text>
                </>
              )}
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message SiKaD..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSend}
            />
          </View>
        </KeyboardAvoidingView>

      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 70 },
  userContainer: {
    backgroundColor: '#cce5ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  sikadContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    
  },
  userText: { fontSize: 16, color: '#000' },
  sikadText: { fontSize: 16, color: '#000' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  chart: { borderRadius: 8, marginTop: 8 },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#1A8EEA',
    justifyContent: 'center',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  fenomena: {
    textDecorationLine: 'underline',
    color: '#1A8EEA',
  },
});

export default ChatScreen;
