import React, { useState, useEffect } from "react";
import { ScrollView, Alert, StyleSheet, View, Text } from "react-native";
import {
  DataTable,
  FAB,
  Modal,
  TextInput,
  Button,
  TouchableRipple,
  Portal,
  Provider,
  Chip,
  IconButton,
  Divider,
  Title,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const MainScreen = () => {
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchActivities = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const { data } = await axios.get(
        "http://192.168.110.193:5062/activities",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities(data);
    } catch {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลกิจกรรมได้");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditing((prev) => ({
        ...prev,
        when: selectedDate.toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async () => {
    if (!editing?.name) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกชื่อกิจกรรม");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editing?.id) {
        await axios.put(
          `http://192.168.110.193:5062/activities/${editing.id}`,
          editing,
          config
        );
        setActivities((prev) =>
          prev.map((a) => (a.id === editing.id ? editing : a))
        );
        Alert.alert("สำเร็จ", "อัปเดตกิจกรรมเรียบร้อยแล้ว");
      } else {
        const { data } = await axios.post(
          "http://192.168.110.193:5062/activities",
          editing,
          config
        );
        setActivities((prev) => [...prev, data]);
        Alert.alert("สำเร็จ", "เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว");
      }
      setVisible(false);
    } catch {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      await axios.delete(`http://192.168.110.193:5062/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities((prev) => prev.filter((a) => a.id !== id));
      Alert.alert("สำเร็จ", "ลบกิจกรรมเรียบร้อยแล้ว");
    } catch {
      Alert.alert("เกิดข้อผิดพลาด", "ลบกิจกรรมไม่สำเร็จ");
    }
  };

  return (
    <Provider>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Title style={styles.pageTitle}>กิจกรรมทั้งหมด</Title>
        
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.header}>
            <DataTable.Title style={[styles.cell, {  }]}>กิจกรรม</DataTable.Title>
            <DataTable.Title style={styles.cell}>วันที่</DataTable.Title>
            <DataTable.Title style={styles.cell}>การจัดการ</DataTable.Title>
          </DataTable.Header>

          {activities.map((item) => (
            <React.Fragment key={item.id}>
              <DataTable.Row style={styles.row}>
                <DataTable.Cell style={[styles.cell, ]}>
                  <Text style={styles.activityName}>{item.name}</Text>
                </DataTable.Cell>
                
                <DataTable.Cell style={styles.cell}>
                  <Chip 
                    mode="outlined" 
                    icon="calendar" 
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {new Date(item.when).toLocaleDateString("th-TH")}
                  </Chip>
                </DataTable.Cell>

                <DataTable.Cell style={[styles.cell, styles.actionsCell]}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    mode="contained-tonal"
                    style={styles.actionButton}
                    onPress={() => {
                      setEditing({
                        ...item,
                        when: new Date(item.when).toISOString().split("T")[0],
                      });
                      setVisible(true);
                    }}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    mode="contained-tonal"
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
              <Divider style={styles.divider}/>
            </React.Fragment>
          ))}
        </DataTable>

        {activities.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>ยังไม่มีกิจกรรม</Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        label="เพิ่มกิจกรรมใหม่"
        onPress={() => {
          setEditing({
            name: "",
            when: new Date().toISOString().split("T")[0],
          });
          setVisible(true);
        }}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalHeader}>
            <Title style={styles.modalTitle}>
              {editing?.id ? "แก้ไขกิจกรรม" : "สร้างกิจกรรมใหม่"}
            </Title>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              label="ชื่อกิจกรรม"
              value={editing?.name || ""}
              onChangeText={(text) =>
                setEditing((prev) => ({ ...prev, name: text }))
              }
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#2196f3' } }}
            />

            <TouchableRipple
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}
              rippleColor="rgba(33, 150, 243, 0.1)"
            >
              <View pointerEvents="none">
                <TextInput
                  label="วันที่"
                  value={
                    editing?.when
                      ? new Date(editing.when).toLocaleDateString("th-TH")
                      : ""
                  }
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="calendar" color="#2196f3" />}
                  style={styles.input}
                  theme={{ colors: { primary: '#2196f3' } }}
                />
              </View>
            </TouchableRipple>

            {showDatePicker && (
              <DateTimePicker
                value={new Date(editing?.when || Date.now())}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                themeVariant="light"
              />
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
            >
              {editing?.id ? "บันทึกการเปลี่ยนแปลง" : "สร้างกิจกรรมใหม่"}
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  pageTitle: {
    color: "#1a237e",
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  table: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  header: {
    backgroundColor: "#e3f2fd",
  },
  cell: {
    justifyContent: "center",
    paddingVertical: 12,
  },
  row: {
    minHeight: 60,
    backgroundColor: 'white',
  },
  activityName: {
    fontSize: 14,
    color: '#1a237e',
    fontWeight: '500',
  },
  chip: {
    backgroundColor: "transparent",
    borderColor: "#2196f3",
    height: 32,
  },
  chipText: {
    color: "#2196f3",
    fontSize: 12,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginHorizontal: 4,
    backgroundColor: '#e3f2fd',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  divider: {
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#9e9e9e',
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2196f3",
    borderRadius: 28,
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    color: "#1a237e",
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  dateInput: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#2196f3",
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default MainScreen;
