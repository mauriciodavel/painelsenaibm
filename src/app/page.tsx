'use client';

import { useState, useEffect, useRef } from 'react';
import TabelaPainel from '@/components/TabelaPainel';
import { parseCSV } from '@/utils/csvUtils';
import { Aula } from '@/utils/types';

export default function PaginaPainel() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [hora, setHora] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarDados();
    
    // Atualizar a cada 2 minutos
    const intervalo = setInterval(carregarDados, 2 * 60 * 1000);
    
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    // Atualizar hora a cada segundo
    setHora(new Date().toLocaleTimeString('pt-BR'));
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    
    return () => clearInterval(intervalo);
  }, []);

  // Scroll automático em loop infinito quando tabela não couber na tela
  useEffect(() => {
    if (!carregando && aulas.length > 0 && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Verificar se o conteúdo excede o container (precisa de scroll)
        const precisaScroll = container.scrollHeight > container.clientHeight;

        if (precisaScroll) {
          // DELAY INICIAL DE 15 SEGUNDOS ANTES DE COMEÇAR
          setTimeout(() => {
            let scrollingDown = true;
            let isPaused = false;
            let scrollAnimationId: number | null = null;

            const startScroll = () => {
              isPaused = false;

              if (scrollingDown) {
                // Scroll suave contínuo para baixo (slow motion - 2 pixels por frame)
                const scrollAmount = 2; // pixel por frame para smooth mas perceptível
                const targetScroll = container.scrollHeight - container.clientHeight;

                const scrollDown = () => {
                  if (container.scrollTop < targetScroll - 5) {
                    container.scrollTop += scrollAmount;
                    scrollAnimationId = requestAnimationFrame(scrollDown);
                  } else {
                    // Chegou no final - pausar por 15 segundos
                    scrollingDown = false;
                    isPaused = true;
                    setTimeout(() => startScroll(), 15000);
                  }
                };

                scrollAnimationId = requestAnimationFrame(scrollDown);
              } else {
                // Scroll suave contínuo para cima (slow motion - 2 pixels por frame)
                const scrollAmount = 2; // pixel por frame para smooth mas perceptível
                
                const scrollUp = () => {
                  if (container.scrollTop > 5) {
                    container.scrollTop -= scrollAmount;
                    scrollAnimationId = requestAnimationFrame(scrollUp);
                  } else {
                    // Voltou ao topo - pausar por 15 segundos
                    scrollingDown = true;
                    isPaused = true;
                    setTimeout(() => startScroll(), 15000);
                  }
                };

                scrollAnimationId = requestAnimationFrame(scrollUp);
              }
            };

            // Iniciar o primeiro scroll
            startScroll();

            // Cleanup
            return () => {
              if (scrollAnimationId) {
                cancelAnimationFrame(scrollAnimationId);
              }
            };
          }, 15000); // 15 segundos de espera inicial
        }
      }, 500); // Delay para garantir que o DOM está pronto
    }
  }, [aulas, carregando]);

  const carregarDados = async () => {
    try {
      const resposta = await fetch('/api/csv');
      const dados = await resposta.json();
      const aulasParseadas = parseCSV(dados.conteudo);
      setAulas(aulasParseadas);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Carregando aulas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header fixo com degradê azul-laranja - compacto */}
      <header className="fixed top-0 left-0 right-0 p-2 sm:p-3 z-50" style={{ background: 'linear-gradient(90deg, #0f2d52 0%, #164194 40%, #1a3f6e 60%, #e84910 100%)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0">
              Painel de Horários
            </h1>
            <p className="text-gray-100 text-xs">Aulas da Unidade SENAI Beira Mar - Vitória</p>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-white">{hora}</p>
            <p className="text-gray-100 text-xs">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'short',
                month: '2-digit',
                day: '2-digit',
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo principal - ocupa o espaço do header com margin-top */}
      <main className="flex-1 overflow-hidden flex flex-col p-0 mt-24">
        <div 
          ref={scrollContainerRef}
          className="bg-white bg-opacity-95 h-full overflow-y-auto p-2 sm:p-3"
          style={{ scrollBehavior: 'smooth' }}
        >
          <TabelaPainel aulas={aulas} />
          
          {/* Footer dinâmico - agora dentro do container scrollável */}
          <footer className="mt-4 pt-3 border-t border-gray-300 text-center text-gray-600 text-xs">
            <p>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
            <p className="text-xs text-gray-500 mt-0">Atualizados a cada 2 minutos</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
