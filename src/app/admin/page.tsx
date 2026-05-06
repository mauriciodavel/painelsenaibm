'use client';

import { useState, useEffect } from 'react';
import TabelaAdmin from '@/components/TabelaAdmin';
import CarregadorCSV from '@/components/CarregadorCSV';
import { parseCSV, aulaToCSV } from '@/utils/csvUtils';
import { Aula } from '@/utils/types';

export default function PaginaAdmin() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch('/api/csv');
      const dados = await resposta.json();
      const aulasParseadas = parseCSV(dados.conteudo);
      setAulas(aulasParseadas);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar dados do CSV');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async (novasAulas: Aula[]) => {
    try {
      setSalvando(true);
      const conteudoCSV = aulaToCSV(novasAulas);
      
      const resposta = await fetch('/api/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conteudo: conteudoCSV }),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao salvar');
      }

      setAulas(novasAulas);
      alert('Dados salvos com sucesso!');
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      alert('Erro ao salvar dados');
    } finally {
      setSalvando(false);
    }
  };

  const handleCarregarCSV = async (arquivo: File) => {
    try {
      setCarregando(true);
      
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      const resposta = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!resposta.ok) {
        throw new Error('Erro ao fazer upload');
      }

      // Recarregar dados
      await carregarDados();
      alert('CSV carregado com sucesso!');
    } catch (erro) {
      console.error('Erro ao carregar CSV:', erro);
      alert('Erro ao carregar o arquivo CSV');
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-0">
      {/* Header fixo com degradê azul-laranja */}
      <header className="fixed top-0 left-0 right-0 p-6 sm:p-8 z-50" style={{ background: 'linear-gradient(90deg, #0f2d52 0%, #164194 40%, #1a3f6e 60%, #e84910 100%)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Painel Administrativo
            </h1>
            <p className="text-gray-100 text-lg mt-1">Editar e gerenciar dados de aulas</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg transition-all font-semibold hover:bg-opacity-30 border border-white border-opacity-30"
            >
              ← Voltar ao Painel
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo principal - ocupa o espaço do header com margin-top */}
      <main className="flex-1 overflow-hidden flex flex-col p-0 mt-44">
        <div className="bg-white bg-opacity-95 h-full overflow-y-auto p-6 sm:p-8 space-y-6 scroll-smooth">
          <div className="flex justify-center">
            <CarregadorCSV onCarregar={handleCarregarCSV} />
          </div>

          <div className="border-t pt-6">
            {aulas.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhuma aula disponível. Carregue um arquivo CSV para começar.
              </p>
            ) : (
              <TabelaAdmin
                aulas={aulas}
                onSalvar={handleSalvar}
                onCarregar={carregarDados}
              />
            )}
          </div>
          
          {/* Footer dinâmico - agora dentro do container scrollável */}
          <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
            <p>Painel Administrativo - Gerenciamento de Horários</p>
          </footer>
        </div>
      </main>

      {salvando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderTopColor: 'var(--senai-primary)' }}></div>
            <p className="text-gray-700 font-semibold">Salvando dados...</p>
          </div>
        </div>
      )}
    </div>
  );
}
