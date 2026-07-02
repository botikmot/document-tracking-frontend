import { create } from 'zustand';

export type Settings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  notificationSounds: boolean;
};

type SettingsStore = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  updateSetting: <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => void;
};

export const useSettingsStore =
  create<SettingsStore>((set) => ({
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      darkMode: false,
      notificationSounds: true,
    },

    setSettings: (settings) =>
      set({ settings }),

    updateSetting: (key, value) =>
      set((state) => ({
        settings: {
          ...state.settings,
          [key]: value,
        },
      })),
  }));