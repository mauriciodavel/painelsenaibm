import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente público (lado do cliente)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com service role (apenas lado do servidor - API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helpers para manipular CSV no Storage
export const BUCKET_NAME = 'schedules';
export const CSV_FILE_NAME = 'horario-aulas.csv';

export async function getCSVFromStorage() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(CSV_FILE_NAME);

    if (error) {
      console.error('Erro ao ler CSV do Storage:', error);
      return null;
    }

    const text = await data.text();
    return text;
  } catch (error) {
    console.error('Erro ao processar CSV do Storage:', error);
    return null;
  }
}

export async function saveCSVToStorage(csvContent: string) {
  try {
    const { error, data } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .update(CSV_FILE_NAME, new Blob([csvContent], { type: 'text/csv' }), {
        cacheControl: '0',
        upsert: true,
      });

    if (error) {
      console.error('Erro ao salvar CSV no Storage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar CSV no Storage:', error);
    return false;
  }
}

export async function uploadCSVToStorage(file: File) {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .update(CSV_FILE_NAME, file, {
        cacheControl: '0',
        upsert: true,
      });

    if (error) {
      console.error('Erro no upload do CSV:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao fazer upload do CSV:', error);
    return false;
  }
}
