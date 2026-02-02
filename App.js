import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Trash2,
  Shuffle,
  Plus,
  Star,
  User,
  ArrowRight,
} from "lucide-react-native";

export default function App() {
  const [nameInput, setNameInput] = useState("");
  const [userName, setUserName] = useState("");

  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [chosen, setChosen] = useState(null);

  // Helper to handle name submission
  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  };

  if (!userName) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.entryContainer}>
          <View style={styles.entryContent}>
            <View style={styles.iconCircle}>
              <User size={40} color="#6366f1" />
            </View>
            <Text style={styles.entryTitle}>Welcome, Buddy!</Text>
            <Text style={styles.entrySubtitle}>Who are we helping today?</Text>

            <TextInput
              style={styles.entryInput}
              placeholder="Enter your name..."
              value={nameInput}
              onChangeText={setNameInput}
              onSubmitEditing={handleNameSubmit} // Added: Submit on enter
              autoFocus // Added: Focus immediately
            />

            <TouchableOpacity
              style={[styles.entryBtn, !nameInput.trim() && { opacity: 0.5 }]}
              onPress={handleNameSubmit}
              disabled={!nameInput.trim()}
            >
              <Text style={styles.entryBtnText}>Let's Start</Text>
              <ArrowRight color="white" size={20} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const addOption = () => {
    if (input.trim().length > 0) {
      setOptions([
        ...options,
        { text: input.trim(), boosted: false, id: Date.now().toString() },
      ]);
      setInput("");
    }
  };

  const toggleBoost = (index) => {
    // Better way to update state: create a new array via map
    const newList = options.map((item, i) =>
      i === index ? { ...item, boosted: !item.boosted } : item,
    );
    setOptions(newList);
  };

  const pickChosen = () => {
    let pool = [];
    options.forEach((opt) => {
      pool.push(opt.text);
      if (opt.boosted) pool.push(opt.text); // Doubling the weight
    });
    const randomIndex = Math.floor(Math.random() * pool.length);
    setChosen(pool[randomIndex]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>Heyy, {userName}! 👋</Text>
            <Text style={styles.subGreeting}>Let me decide </Text>
          </View>

          {chosen ? (
            <View style={styles.centerBox}>
              <Text style={styles.resultLabel}>The decision is made:</Text>
              <View style={styles.chosenCard}>
                <Text style={styles.resultText}>{chosen}</Text>
              </View>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => setChosen(null)}
              >
                <Text style={styles.btnText}>Choose Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Add an option..."
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={addOption} // Added: Submit on enter
                />
                <TouchableOpacity style={styles.addBtn} onPress={addOption}>
                  <Plus color="white" size={28} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <View
                    style={[styles.card, item.boosted && styles.boostedCard]}
                  >
                    <Text style={styles.cardText}>{item.text}</Text>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        onPress={() => toggleBoost(index)}
                        style={{ marginRight: 15 }}
                      >
                        <Star
                          size={22}
                          color={item.boosted ? "#facc15" : "#ccc"}
                          fill={item.boosted ? "#facc15" : "none"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          setOptions(options.filter((_, i) => i !== index))
                        }
                      >
                        <Trash2 color="#ff4444" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No options added yet...</Text>
                }
              />

              {options.length > 1 && (
                <TouchableOpacity style={styles.decideBtn} onPress={pickChosen}>
                  <Shuffle
                    color="white"
                    size={22}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.btnText}>Decide for Me</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  entryContainer: {
    flex: 1,
    backgroundColor: "#6366f1",
    justifyContent: "center",
  },
  entryContent: {
    backgroundColor: "white",
    margin: 30,
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "#eef2ff",
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  entryTitle: { fontSize: 26, fontWeight: "bold", color: "#1a1a1a" },
  entrySubtitle: { fontSize: 16, color: "#666", marginBottom: 25 },
  entryInput: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  entryBtn: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    padding: 18,
    borderRadius: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  entryBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  headerSection: { marginTop: 20, marginBottom: 25 },
  greeting: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  subGreeting: { fontSize: 16, color: "#666" },
  inputRow: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addBtn: {
    backgroundColor: "#6366f1",
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginLeft: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  boostedCard: { borderColor: "#facc15", borderWidth: 2 },
  cardText: { fontSize: 16, fontWeight: "500", flex: 1 },
  actions: { flexDirection: "row", alignItems: "center" },
  decideBtn: {
    backgroundColor: "#10b981",
    padding: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  resultLabel: { fontSize: 18, color: "#666" },
  chosenCard: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  resultText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#6366f1",
    textAlign: "center",
  },
  resetBtn: { backgroundColor: "#4b5563", padding: 15, borderRadius: 12 },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },
});
