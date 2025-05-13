import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CreditScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ทีมพัฒนา</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Developer Cards */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://avatars.githubusercontent.com/u/12345678' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>ศิวดล รังมาตย์</Text>
          <Text style={styles.role}>Lead Developer</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-github" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={24} color="#0077b5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat for other team members */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://avatars.githubusercontent.com/u/12345679' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>บัญญวัฒ นวลนาค</Text>
          <Text style={styles.role}>UI/UX Designer</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-github" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-dribbble" size={24} color="#ea4c89" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://avatars.githubusercontent.com/u/12345680' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>ณฐวรรฒ จันทร์เอียด</Text>
          <Text style={styles.role}>Backend Developer</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-github" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-stackoverflow" size={24} color="#f48024" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#2196f3",
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: 20,
    marginTop: -30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#2196f3",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  socialButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f4f8",
  },
});

export default CreditScreen;