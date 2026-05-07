/**
 * Script para fazer upload inicial do CSV para Supabase
 * Execute com: node scripts/upload-csv-initial.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente SUPABASE não configuradas!');
  console.error('Verifique seu arquivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET_NAME = 'schedules';
const CSV_FILE_NAME = 'horario-aulas.csv';

async function createBucketIfNotExists() {
  try {
    console.log(`🔍 Verificando se bucket "${BUCKET_NAME}" existe...`);
    
    // Listar buckets existentes
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erro ao listar buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);

    if (bucketExists) {
      console.log(`✅ Bucket "${BUCKET_NAME}" já existe`);
      return true;
    }

    console.log(`📦 Criando bucket "${BUCKET_NAME}"...`);
    
    const { data, error: createError } = await supabase.storage.createBucket(
      BUCKET_NAME,
      { 
        public: true,
        fileSizeLimit: 52428800, // 50 MB
      }
    );

    if (createError) {
      console.error('❌ Erro ao criar bucket:', createError);
      return false;
    }

    console.log(`✅ Bucket "${BUCKET_NAME}" criado com sucesso!`);
    return true;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

async function uploadInitialCSV() {
  try {
    console.log('📤 Iniciando upload do CSV inicial...');

    // Ler o arquivo CSV local
    const csvPath = path.join(__dirname, '../public/Consultar-Horário.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ Arquivo CSV não encontrado em:', csvPath);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(csvPath);
    
    // Upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(CSV_FILE_NAME, new Blob([fileContent], { type: 'text/csv' }), {
        cacheControl: '0',
        upsert: true,
      });

    if (error) {
      console.error('❌ Erro ao fazer upload:', error);
      return false;
    }

    console.log('✅ CSV uploadado com sucesso para Supabase Storage!');
    console.log('📁 Bucket: ' + BUCKET_NAME);
    console.log('📄 Arquivo: ' + CSV_FILE_NAME);
    return true;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

async function main() {
  // Criar bucket se não existir
  const bucketReady = await createBucketIfNotExists();
  
  if (!bucketReady) {
    console.error('❌ Falha ao preparar o bucket');
    process.exit(1);
  }

  // Upload do CSV
  const uploaded = await uploadInitialCSV();
  
  if (!uploaded) {
    console.error('❌ Falha no upload do CSV');
    process.exit(1);
  }

  console.log('\n✅ Tudo pronto! Seu projeto agora está configurado com Supabase Storage');
}

main();
