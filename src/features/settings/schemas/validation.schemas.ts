import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo'),
  lastName: z.string()
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome muito longo'),
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email muito curto'),
  phone: z.string()
    .optional()
    .or(z.literal('')),
  oab: z.string()
    .min(4, 'Número OAB inválido')
    .max(10, 'Número OAB inválido'),
  oabState: z.string()
    .min(2, 'Selecione um estado válido'),
  bio: z.string()
    .max(500, 'Bio muito longa (máximo 500 caracteres)')
    .optional()
    .or(z.literal(''))
});

export const passwordSchema = z.object({
  currentPassword: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  newPassword: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

export const apiKeySchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome muito longo')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Apenas letras, números, espaços e hífens')
});

export const accountSchema = z.object({
  language: z.enum(['pt-BR', 'en-US', 'es-ES']),
  timezone: z.string(),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['24h', '12h']),
  currency: z.enum(['BRL', 'USD', 'EUR'])
});
