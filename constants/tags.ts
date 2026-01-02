import { PoopType, Feeling, TimeOfDay, Location } from '@/types';

export const POOP_TYPES: Array<{ value: PoopType; emoji: string; label: string }> = [
  { value: 'Rock Solid', emoji: '🪨', label: 'Rock Solid' },
  { value: 'Normal Hero', emoji: '🌭', label: 'Normal Hero' },
  { value: 'Soft Serve', emoji: '🍦', label: 'Soft Serve' },
  { value: 'Danger Zone', emoji: '💦', label: 'Danger Zone' },
];

export const FEELINGS: Array<{ value: Feeling; emoji: string; label: string }> = [
  { value: 'Relieved', emoji: '😌', label: 'Relieved' },
  { value: 'Neutral', emoji: '😐', label: 'Neutral' },
  { value: 'Regret', emoji: '😖', label: 'Regret' },
  { value: 'Rushed', emoji: '😤', label: 'Rushed' },
  { value: 'Victorious', emoji: '😎', label: 'Victorious' },
];

export const TIME_OF_DAY_OPTIONS: Array<{ value: TimeOfDay; emoji: string; label: string }> = [
  { value: 'Morning', emoji: '🌅', label: 'Morning' },
  { value: 'Afternoon', emoji: '☀️', label: 'Afternoon' },
  { value: 'Night', emoji: '🌙', label: 'Night' },
];

export const LOCATIONS: Array<{ value: Location; emoji: string; label: string }> = [
  { value: 'Home', emoji: '🏠', label: 'Home' },
  { value: 'Work', emoji: '🏢', label: 'Work' },
  { value: 'Public', emoji: '🚽', label: 'Public' },
  { value: 'Unknown', emoji: '❓', label: 'Unknown' },
];

