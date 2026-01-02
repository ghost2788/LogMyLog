import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface TagSelectorProps<T extends string> {
  options: Array<{ value: T; emoji: string; label: string }>;
  selectedValue: T | null;
  onSelect: (value: T) => void;
  label?: string;
}

export function TagSelector<T extends string>({
  options,
  selectedValue,
  onSelect,
  label,
}: TagSelectorProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map(option => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  labelSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

