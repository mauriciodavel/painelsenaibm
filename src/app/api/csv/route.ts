import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CSV_PATH = 'Consultar-Horário.csv';

function getFullPath() {
  // Em desenvolvimento e em produção, o CSV está na pasta public
  if (process.env.NODE_ENV === 'production') {
    return path.join(process.cwd(), 'public', CSV_PATH);
  }
  return path.join(process.cwd(), 'public', CSV_PATH);
}

export async function GET() {
  try {
    const fullPath = getFullPath();
    const conteudo = await fs.readFile(fullPath, 'utf-8');
    return NextResponse.json({ conteudo, sucesso: true });
  } catch (error) {
    console.error('Erro ao ler CSV:', error);
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

    const fullPath = getFullPath();
    await fs.writeFile(fullPath, conteudo, 'utf-8');
    
    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'CSV salvo com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao salvar CSV:', error);
    return NextResponse.json(
      { erro: 'Erro ao salvar arquivo CSV', sucesso: false },
      { status: 500 }
    );
  }
}
