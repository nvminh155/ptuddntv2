import TodoItem from "@/components/todoapp/todo-item";
import { db } from "@/config/firebase";
import { Todo } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreError,
  onSnapshot,
  query,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// import firestore from "@react-native-firebase/firestore"

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // const user = auth.currentUser;
  const user = {
    uid: "master-uid"
  }

  useEffect(() => {
    // if (!user) return;

    const q = query(collection(db, "todos"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const todoList: Todo[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          todoList.push({
            id: doc.id,
            text: data.text,
            completed: data.completed,
            userId: data.userId,
            createdAt: data.createdAt,
          });
        });

        // Sort by timestamp, newest first
        todoList.sort((a, b) => {
          // Handle case where createdAt might be null
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setTodos(todoList);
        setLoading(false);
      },
      (error: FirestoreError) => {
        console.error("Error fetching todos: ", error);
        Alert.alert("Error", "Could not load todos");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (): Promise<void> => {
    if (newTodo.trim() === "" || !user) return;

    try {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo: ", error);
      Alert.alert("Error", "Could not add todo");
    }
  };

  const toggleTodo = async (id: string, completed: boolean): Promise<void> => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        completed: !completed,
      });
    } catch (error) {
      console.error("Error updating todo: ", error);
      Alert.alert("Error", "Could not update todo");
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Error deleting todo: ", error);
      Alert.alert("Error", "Could not delete todo");
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // await signOut(auth);
      // Navigation is handled in _layout.js based on auth state
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Error", "Could not sign out");
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Todo>) => (
    <TodoItem
      todo={item}
      onToggle={() => toggleTodo(item.id, item.completed)}
      onDelete={() => deleteTodo(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.title}>My Todo List</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A6EA9" style={styles.loader} />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "#4A6EA9",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4A6EA9",
    borderRadius: 8,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
    fontSize: 16,
  },
});
