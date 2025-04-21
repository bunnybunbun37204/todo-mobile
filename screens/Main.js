import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import { DataTable, FAB, Modal, TextInput, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const MainScreen = () => {
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchActivities = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const { data } = await axios.get(
        "http://192.168.217.193:5062/activities",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities(data);
    } catch {
      Alert.alert("Error", "Failed to load activities");
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editing?.id) {
        await axios.put(
          `http://192.168.217.193:5062/activities/${editing.id}`,
          editing,
          config
        );
        setActivities(prev => prev.map(a => a.id === editing.id ? editing : a));
        Alert.alert("Success", "Activity updated");
      } else {
        const { data } = await axios.post(
          "http://192.168.217.193:5062/activities",
          editing,
          config
        );
        setActivities(prev => [...prev, data]);
        Alert.alert("Success", "Activity added");
      }
      setVisible(false);
    } catch {
      Alert.alert("Error", "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      await axios.delete(
        `http://192.168.217.193:5062/activities/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities(prev => prev.filter(a => a.id !== id));
      Alert.alert("Success", "Activity deleted");
    } catch {
      Alert.alert("Error", "Delete failed");
    }
  };

  return (
    <>
      <ScrollView style={{ padding: 16 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Edit</DataTable.Title>
            <DataTable.Title>Delete</DataTable.Title>

          </DataTable.Header>

          {activities.map(item => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>{item.when}</DataTable.Cell>
              <DataTable.Cell>
                <Button onPress={() => { setEditing(item); setVisible(true); }}>
                  Edit
                </Button>
              </DataTable.Cell>
              <DataTable.Cell>
                <Button onPress={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>

      <FAB
        icon="plus"
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        onPress={() => { 
          setEditing({ 
            name: "", 
            when: new Date().toISOString().split('T')[0] 
          }); 
          setVisible(true); 
        }}
      />

      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <ScrollView style={{ backgroundColor: 'white', margin: 20, padding: 20 }}>
          <TextInput
            label="Name"
            value={editing?.name || ''}
            onChangeText={text => setEditing(prev => ({ ...prev, name: text }))}
            style={{ marginBottom: 16 }}
          />

          <TextInput
            label="Date"
            value={editing?.when || new Date().toISOString().split('T')[0]}
            onChangeText={text => setEditing(prev => ({ ...prev, when: text }))}
            style={{ marginBottom: 16 }}
          />

          <Button mode="contained" onPress={handleSubmit}>
            {editing?.id ? 'Save Changes' : 'Create Activity'}
          </Button>
        </ScrollView>
      </Modal>
    </>
  );
};

export default MainScreen;