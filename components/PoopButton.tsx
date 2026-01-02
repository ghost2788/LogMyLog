import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PoopButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function PoopButton({ onPress, disabled }: PoopButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>💩</Text>
      <Text style={styles.text}>I Pooped</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#8B4513',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

