import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Em produção (Vercel), não permite upload de arquivos
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { 
          erro: 'Upload não disponível em produção. Use desenvolvimento local ou implemente banco de dados.', 
          sucesso: false 
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const arquivo = formData.get('arquivo') as File;

    if (!arquivo) {
      return NextResponse.json(
        { erro: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    const conteudo = await arquivo.text();
    const csvPath = path.join(process.cwd(), 'public', 'Consultar-Horário.csv');
    
    await fs.writeFile(csvPath, conteudo, 'utf-8');

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'CSV carregado e salvo com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao fazer upload do CSV:', error);
    return NextResponse.json(
      { erro: 'Erro ao fazer upload do arquivo CSV' },
      { status: 500 }
    );
  }
}
