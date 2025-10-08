import { useState, useEffect } from 'react';
import { UserSettings, defaultSettings } from '@/types/settings';
import { toast } from 'sonner';

const SETTINGS_KEY = 'jurimetrics_settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    try {
      const updated = { ...settings, ...updates };
      setSettings(updated);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      toast.success('Configurações atualizadas!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações');
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    toast.success('Configurações restauradas para o padrão');
  };

  return { settings, isLoading, updateSettings, resetSettings };
};
