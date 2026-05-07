import { NextRequest, NextResponse } from 'next/server';
import { uploadCSVToStorage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const arquivo = formData.get('arquivo') as File;

    if (!arquivo) {
      return NextResponse.json(
        { erro: 'Arquivo não fornecido', sucesso: false },
        { status: 400 }
      );
    }

    // Validar se é um arquivo CSV
    if (!arquivo.type.includes('text') && !arquivo.name.endsWith('.csv')) {
      return NextResponse.json(
        { erro: 'Apenas arquivos CSV são permitidos', sucesso: false },
        { status: 400 }
      );
    }

    const sucesso = await uploadCSVToStorage(arquivo);
    
    if (!sucesso) {
      return NextResponse.json(
        { erro: 'Erro ao fazer upload do CSV no Supabase Storage', sucesso: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'CSV carregado e salvo com sucesso no Supabase Storage' 
    });
  } catch (error) {
    console.error('Erro ao fazer upload do CSV:', error);
    return NextResponse.json(
      { erro: 'Erro ao fazer upload do arquivo CSV', sucesso: false },
      { status: 500 }
    );
  }
}
