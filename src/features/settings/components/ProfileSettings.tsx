import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, CheckCircle, Save, Loader2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { useUploadAvatar } from '../hooks/useUploadAvatar';
import { profileSchema } from '../schemas/validation.schemas';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const uploadAvatarMutation = useUploadAvatar();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: settings?.profile
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas.');
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success('Avatar atualizado!');
    } catch (error) {
      toast.error('Erro ao fazer upload do avatar');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ section: 'profile', data });
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Perfil</h2>
          <p className="text-sm text-muted-foreground">Informações pessoais e profissionais</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary hover:text-primary/80 font-medium text-sm md:text-base"
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
            {settings?.profile.avatar ? (
              <img 
                src={settings.profile.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {settings?.profile.firstName?.[0]}{settings?.profile.lastName?.[0]}
              </span>
            )}
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 shadow-lg"
            >
              {uploadAvatarMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        
        {isEditing && (
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Alterar foto
            </button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG ou GIF. Máximo 2MB.
            </p>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-2">Nome *</label>
            <input
              {...form.register('firstName')}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
            />
            {form.formState.errors.firstName && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.firstName.message as string}
              </p>
            )}
          </div>

          {/* Sobrenome */}
          <div>
            <label className="block text-sm font-medium mb-2">Sobrenome *</label>
            <input
              {...form.register('lastName')}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
            />
            {form.formState.errors.lastName && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.lastName.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">E-mail *</label>
            <div className="flex items-center space-x-2">
              <input
                {...form.register('email')}
                type="email"
                disabled={!isEditing}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
              />
              <span className="flex items-center text-green-600 text-sm whitespace-nowrap">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verificado
              </span>
            </div>
            {form.formState.errors.email && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.email.message as string}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Telefone</label>
            <input
              {...form.register('phone')}
              type="tel"
              disabled={!isEditing}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
            />
          </div>

          {/* OAB */}
          <div>
            <label className="block text-sm font-medium mb-2">Número OAB *</label>
            <input
              {...form.register('oab')}
              disabled={!isEditing}
              placeholder="Ex: 123456"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
            />
            {form.formState.errors.oab && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.oab.message as string}
              </p>
            )}
          </div>

          {/* UF OAB */}
          <div>
            <label className="block text-sm font-medium mb-2">UF OAB *</label>
            <select
              {...form.register('oabState')}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
            >
              <option value="">Selecione</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            {form.formState.errors.oabState && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.oabState.message as string}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              {...form.register('bio')}
              disabled={!isEditing}
              rows={4}
              placeholder="Conte um pouco sobre você..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-muted-foreground resize-none"
            />
            {form.formState.errors.bio && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.bio.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                form.reset();
              }}
              className="w-full sm:w-auto px-6 py-2 border rounded-lg hover:bg-muted font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
