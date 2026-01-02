import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TagSelector } from './TagSelector';
import { PoopType, Feeling, TimeOfDay, Location } from '@/types';
import { POOP_TYPES, FEELINGS, TIME_OF_DAY_OPTIONS, LOCATIONS } from '@/constants/tags';

interface QuickTagsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (tags: {
    poop_type: PoopType | null;
    feeling: Feeling | null;
    time_of_day: TimeOfDay | null;
    location: Location | null;
  }) => void;
  initialTags?: {
    poop_type?: PoopType | null;
    feeling?: Feeling | null;
    time_of_day?: TimeOfDay | null;
    location?: Location | null;
  };
}

export function QuickTagsModal({ visible, onClose, onSave, initialTags }: QuickTagsModalProps) {
  const [poopType, setPoopType] = useState<PoopType | null>(initialTags?.poop_type || null);
  const [feeling, setFeeling] = useState<Feeling | null>(initialTags?.feeling || null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(initialTags?.time_of_day || null);
  const [location, setLocation] = useState<Location | null>(initialTags?.location || null);

  const handleSave = () => {
    onSave({
      poop_type: poopType,
      feeling,
      time_of_day: timeOfDay,
      location,
    });
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Tags (Optional)</Text>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <TagSelector
              options={POOP_TYPES}
              selectedValue={poopType}
              onSelect={setPoopType}
              label="Type"
            />
            
            <TagSelector
              options={FEELINGS}
              selectedValue={feeling}
              onSelect={setFeeling}
              label="Feeling"
            />
            
            <TagSelector
              options={TIME_OF_DAY_OPTIONS}
              selectedValue={timeOfDay}
              onSelect={setTimeOfDay}
              label="Time of Day"
            />
            
            <TagSelector
              options={LOCATIONS}
              selectedValue={location}
              onSelect={setLocation}
              label="Location"
            />
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8B4513',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

