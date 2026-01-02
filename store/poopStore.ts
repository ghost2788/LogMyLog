import { create } from 'zustand';
import { Poop } from '@/types';
import * as database from '@/lib/database';

interface PoopStore {
  poops: Poop[];
  isLoading: boolean;
  error: string | null;
  fetchPoops: () => Promise<void>;
  addPoop: (poop: Partial<Poop>) => Promise<Poop>;
  updatePoop: (id: string, updates: Partial<Poop>) => Promise<void>;
  deletePoop: (id: string) => Promise<void>;
}

export const usePoopStore = create<PoopStore>((set, get) => ({
  poops: [],
  isLoading: false,
  error: null,

  fetchPoops: async () => {
    set({ isLoading: true, error: null });
    try {
      const poops = await database.getPoops();
      set({ poops, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addPoop: async (poopData) => {
    try {
      const newPoop = await database.createPoop(poopData);
      set(state => ({ poops: [newPoop, ...state.poops] }));
      return newPoop;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updatePoop: async (id, updates) => {
    try {
      const updated = await database.updatePoop(id, updates);
      set(state => ({
        poops: state.poops.map(p => p.id === id ? updated : p),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deletePoop: async (id) => {
    try {
      await database.deletePoop(id);
      set(state => ({
        poops: state.poops.filter(p => p.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));

