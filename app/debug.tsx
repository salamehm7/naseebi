import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Platform } from 'react-native';
import { auth, db } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function DebugScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };
  
  const testAuth = async () => {
    try {
      addLog('Testing auth...');
      const email = `test${Date.now()}@example.com`;
      const password = 'Test123456';
      
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      addLog(`Auth success! Created user ${userCred.user.uid}`);
    } catch (error) {
      addLog(`Auth error: ${error.message}`);
    }
  };
  
  const testFirestore = async () => {
    try {
      addLog('Testing Firestore...');
      const testDocRef = doc(db, 'test', 'test-doc');
      await setDoc(testDocRef, { timestamp: new Date().toISOString() });
      addLog('Firestore write success!');
      
      const docSnap = await getDoc(testDocRef);
      addLog(`Firestore read success! Data: ${JSON.stringify(docSnap.data())}`);
    } catch (error) {
      addLog(`Firestore error: ${error.message}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Debug</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Test Auth" onPress={testAuth} />
        <Button title="Test Firestore" onPress={testFirestore} />
      </View>
      
      <ScrollView style={styles.logContainer}>
        {logs.map((log, i) => (
          <Text key={i} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  logText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
}); 