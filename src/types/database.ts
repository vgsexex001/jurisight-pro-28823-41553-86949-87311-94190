// Tipos auxiliares para o banco de dados até a regeneração automática dos tipos do Supabase

export type ProcessResult = 'procedente' | 'improcedente' | 'parcial_procedente' | 'pendente';
export type ProcessStatus = 'em_andamento' | 'concluido' | 'arquivado' | 'suspenso';
export type ActionType = 'trabalhista' | 'civel' | 'criminal' | 'tributario' | 'administrativo';

export interface Process {
  id: string;
  user_id: string;
  process_number: string;
  tribunal: string;
  vara: string | null;
  action_type: ActionType;
  plaintiff: string;
  defendant: string;
  distribution_date: string;
  judgment_date: string | null;
  result: ProcessResult;
  status: ProcessStatus;
  amount: number | null;
  summary: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface ProcessTag {
  process_id: string;
  tag_id: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'administrador' | 'editor' | 'visualizador';
  created_at: string;
}
