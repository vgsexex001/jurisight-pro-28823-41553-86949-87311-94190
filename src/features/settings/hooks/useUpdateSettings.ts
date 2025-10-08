import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { UserSettings } from '@/types/settings';

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      section, 
      data 
    }: { 
      section: keyof UserSettings; 
      data: any 
    }) => {
      // Simular API call - substituir por chamada real ao backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar localStorage
      const currentSettings = localStorage.getItem('jurimetrics_settings');
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      const updated = {
        ...settings,
        [section]: data
      };
      localStorage.setItem('jurimetrics_settings', JSON.stringify(updated));
      
      return updated;
    },
    onSuccess: (data, variables) => {
      // Atualizar cache do React Query
      queryClient.setQueryData(['settings'], data);
      toast.success('Configurações atualizadas!');
    },
    onError: () => {
      toast.error('Erro ao atualizar configurações');
    }
  });
};
