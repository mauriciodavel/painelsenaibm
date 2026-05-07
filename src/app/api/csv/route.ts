import { NextRequest, NextResponse } from 'next/server';
import { getCSVFromStorage, saveCSVToStorage } from '@/lib/supabase';

export async function GET() {
  try {
    const conteudo = await getCSVFromStorage();
    
    if (!conteudo) {
      return NextResponse.json(
        { erro: 'Arquivo CSV não encontrado no Storage', sucesso: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ conteudo, sucesso: true });
  } catch (error) {
    console.error('Erro ao ler CSV do Supabase:', error);
    return NextResponse.json(
      { erro: 'Erro ao ler arquivo CSV', sucesso: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conteudo } = await request.json();
    
    if (!conteudo) {
      return NextResponse.json(
        { erro: 'Conteúdo do CSV não fornecido', sucesso: false },
        { status: 400 }
      );
    }

    const sucesso = await saveCSVToStorage(conteudo);
    
    if (!sucesso) {
      return NextResponse.json(
        { erro: 'Erro ao salvar CSV no Supabase Storage', sucesso: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'CSV salvo com sucesso no Supabase Storage' 
    });
  } catch (error) {
    console.error('Erro ao salvar CSV:', error);
    return NextResponse.json(
      { erro: 'Erro ao salvar arquivo CSV', sucesso: false },
      { status: 500 }
    );
  }
}
