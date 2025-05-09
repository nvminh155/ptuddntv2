import { Todo } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
        {todo.completed ? (
          <MaterialIcons name="check-box" size={24} color="#4A6EA9" />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={24} color="#4A6EA9" />
        )}
      </TouchableOpacity>
      
      <Text 
        style={[
          styles.todoText,
          todo.completed && styles.completedText
        ]}
      >
        {todo.text}
      </Text>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    padding: 5,
  },
});