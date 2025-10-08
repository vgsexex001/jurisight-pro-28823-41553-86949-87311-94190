import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { UserSettings } from '@/types/settings';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 2MB.');
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas imagens são permitidas.');
      }

      // Converter para base64 para armazenar localmente (simular upload)
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Salvar no localStorage
      const currentSettings = localStorage.getItem('jurimetrics_settings');
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      const updated = {
        ...settings,
        profile: {
          ...settings.profile,
          avatar: base64
        }
      };
      localStorage.setItem('jurimetrics_settings', JSON.stringify(updated));
      
      return base64;
    },
    onSuccess: (avatarUrl) => {
      // Atualizar cache
      queryClient.setQueryData(['settings'], (old: UserSettings | undefined) => {
        if (!old) return old;
        return {
          ...old,
          profile: { ...old.profile, avatar: avatarUrl }
        };
      });
      toast.success('Avatar atualizado!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao fazer upload do avatar');
    }
  });
};
