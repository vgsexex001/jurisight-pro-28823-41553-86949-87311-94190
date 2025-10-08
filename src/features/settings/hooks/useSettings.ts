import { useQuery } from '@tanstack/react-query';
import { UserSettings, defaultSettings } from '@/types/settings';

const SETTINGS_KEY = 'jurimetrics_settings';

export const useSettings = () => {
  return useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      // Simular API call - substituir por chamada real ao backend
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
      
      // Retornar configurações padrão se não houver nada salvo
      return defaultSettings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
