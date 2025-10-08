import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Camera, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ProfileSettings() {
  const { settings, updateSettings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(settings.profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ profile: formData });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Perfil</h2>
          <p className="text-sm text-muted-foreground">
            Informações pessoais e profissionais
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          {isEditing && (
            <div>
              <button
                type="button"
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

        {/* Campos do Formulário */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className="flex-1"
              />
              <span className="flex items-center text-green-600 text-sm whitespace-nowrap">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verificado
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="oab">Número OAB</Label>
            <Input
              id="oab"
              value={formData.oab}
              onChange={(e) => handleChange('oab', e.target.value)}
              disabled={!isEditing}
              placeholder="Ex: 123456"
            />
          </div>

          <div>
            <Label htmlFor="oabState">UF OAB</Label>
            <select
              id="oabState"
              value={formData.oabState}
              onChange={(e) => handleChange('oabState', e.target.value)}
              disabled={!isEditing}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
            </select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Conte um pouco sobre você..."
            />
          </div>
        </div>

        {/* Botões de Ação */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
