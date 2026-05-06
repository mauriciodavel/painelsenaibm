'use client';

import React, { useState, useEffect } from 'react';
import { AulaExibicao, Turno } from '@/utils/types';
import { filtrarAulasPorTurno, obterTurnoAtual, filtrarAulasPorData, obterDataAtual } from '@/utils/csvUtils';

interface TabelaPainelProps {
  aulas: any[];
  turno?: Turno;
}

export default function TabelaPainel({ aulas, turno }: TabelaPainelProps) {
  const [aulasFiltradas, setAulasFiltradas] = useState<AulaExibicao[]>([]);
  const [turnoAtual, setTurnoAtual] = useState<Turno>(turno || obterTurnoAtual());
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<string[]>([]);
  const [instrutoresDisponiveis, setInstrutoresDisponiveis] = useState<string[]>([]);
  const [turmaFiltro, setTurmaFiltro] = useState<string>('');
  const [instrutorFiltro, setInstrutorFiltro] = useState<string>('');

  // Extrair turmas e instrutores únicos filtrados por data e turno
  useEffect(() => {
    const dataAtual = obterDataAtual();
    const aulasFiltroDataTurno = filtrarAulasPorData(aulas, dataAtual, dataAtual);
    const aulasFiltroTurno = filtrarAulasPorTurno(aulasFiltroDataTurno, turnoAtual);
    
    const turmas = new Set<string>();
    const instrutores = new Set<string>();
    
    aulasFiltroTurno.forEach((aula) => {
      if (aula['Turma / Tipo Reserva']) turmas.add(aula['Turma / Tipo Reserva']);
      if (aula['Instrutor/Ambiente Reserva']) instrutores.add(aula['Instrutor/Ambiente Reserva']);
    });
    
    setTurmasDisponiveis(Array.from(turmas).sort());
    setInstrutoresDisponiveis(Array.from(instrutores).sort());
  }, [aulas, turnoAtual]);

  // Filtrar aulas
  useEffect(() => {
    // Primeiro filtra por data de hoje
    const dataAtual = obterDataAtual();
    const aulasDiaAtualdatafiltradas = filtrarAulasPorData(aulas, dataAtual, dataAtual);
    
    // Depois filtra por turno
    let filtered = filtrarAulasPorTurno(aulasDiaAtualdatafiltradas, turnoAtual);
    
    // Filtrar por turma
    if (turmaFiltro) {
      filtered = filtered.filter(aula => aula['Turma / Tipo Reserva'] === turmaFiltro);
    }
    
    // Filtrar por instrutor
    if (instrutorFiltro) {
      filtered = filtered.filter(aula => aula['Instrutor/Ambiente Reserva'] === instrutorFiltro);
    }
    
    setAulasFiltradas(filtered);
  }, [aulas, turnoAtual, turmaFiltro, instrutorFiltro]);

  if (aulasFiltradas.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-1 p-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md space-y-0.5 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0.5">
            <div className="flex gap-0.5">
              <button
                onClick={() => setTurnoAtual('matutino')}
                className={`px-1.5 py-0.5 rounded-lg font-semibold transition-all flex-1 text-xs ${
                  turnoAtual === 'matutino'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: turnoAtual === 'matutino' ? 'var(--senai-primary)' : undefined,
                }}
              >
                Matutino
              </button>
              <button
                onClick={() => setTurnoAtual('vespertino')}
                className={`px-1.5 py-0.5 rounded-lg font-semibold transition-all flex-1 text-xs ${
                  turnoAtual === 'vespertino'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: turnoAtual === 'vespertino' ? 'var(--senai-secondary)' : undefined,
                }}
              >
                Vespertino
              </button>
              <button
                onClick={() => setTurnoAtual('noturno')}
                className={`px-1.5 py-0.5 rounded-lg font-semibold transition-all flex-1 text-xs ${
                  turnoAtual === 'noturno'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: turnoAtual === 'noturno' ? 'var(--senai-support-2)' : undefined,
                }}
              >
                Noturno
              </button>
            </div>
            
            <select
              value={turmaFiltro}
              onChange={(e) => setTurmaFiltro(e.target.value)}
              className="px-1.5 py-0.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Todas as turmas</option>
              {turmasDisponiveis.map(turma => (
                <option key={turma} value={turma}>{turma}</option>
              ))}
            </select>
            
            <select
              value={instrutorFiltro}
              onChange={(e) => setInstrutorFiltro(e.target.value)}
              className="px-1.5 py-0.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Todos os instrutores</option>
              {instrutoresDisponiveis.map(instrutor => (
                <option key={instrutor} value={instrutor}>{instrutor}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setTurmaFiltro('');
                setInstrutorFiltro('');
              }}
              className="px-1.5 py-0.5 bg-gray-500 text-white rounded-lg font-semibold text-xs hover:bg-gray-600 transition-colors shadow-md"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        <div className="text-center py-8 text-gray-600">
          <p className="text-sm font-medium">Nenhuma aula disponível para os filtros selecionados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto space-y-2">
      <div className="p-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md space-y-0.5 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0.5">
          <div className="flex gap-0.5">
            <button
              onClick={() => setTurnoAtual('matutino')}
              className={`px-1.5 py-0.5 rounded-lg font-semibold transition-all flex-1 text-xs ${
                turnoAtual === 'matutino'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: turnoAtual === 'matutino' ? 'var(--senai-primary)' : undefined,
              }}
            >
              Matutino
            </button>
            <button
              onClick={() => setTurnoAtual('vespertino')}
              className={`px-1.5 py-0.5 rounded-lg font-semibold transition-all flex-1 ${
                turnoAtual === 'vespertino'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: turnoAtual === 'vespertino' ? 'var(--senai-secondary)' : undefined,
              }}
            >
              Vespertino
            </button>
            <button
              onClick={() => setTurnoAtual('noturno')}
              className={`px-1.5 py-0.5 rounded-lg font-semibold transition-all flex-1 ${
                turnoAtual === 'noturno'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: turnoAtual === 'noturno' ? 'var(--senai-support-2)' : undefined,
              }}
            >
              Noturno
            </button>
          </div>
          
          <select
            value={turmaFiltro}
            onChange={(e) => setTurmaFiltro(e.target.value)}
            className="px-1.5 py-0.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todas as turmas</option>
            {turmasDisponiveis.map(turma => (
              <option key={turma} value={turma}>{turma}</option>
            ))}
          </select>
          
          <select
            value={instrutorFiltro}
            onChange={(e) => setInstrutorFiltro(e.target.value)}
            className="px-1.5 py-0.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todos os instrutores</option>
            {instrutoresDisponiveis.map(instrutor => (
              <option key={instrutor} value={instrutor}>{instrutor}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setTurmaFiltro('');
              setInstrutorFiltro('');
            }}
            className="px-1.5 py-0.5 bg-gray-500 text-white rounded-lg font-semibold text-xs hover:bg-gray-600 transition-colors shadow-md"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="text-white text-base" style={{ backgroundColor: 'var(--senai-primary)' }}>
            <th className="px-1 py-1 text-left font-semibold">Início</th>
            <th className="px-1 py-1 text-left font-semibold">Fim</th>
            <th className="px-1 py-1 text-left font-semibold">Turma/Tipo Reserva</th>
            <th className="px-1 py-1 text-left font-semibold">Instrutor/Ambiente</th>
            <th className="px-1 py-1 text-left font-semibold">Unidade Curricular</th>
            <th className="px-1 py-1 text-left font-semibold">Ambiente Educacional</th>
          </tr>
        </thead>
        <tbody>
          {aulasFiltradas.map((aula, index) => (
            <tr
              key={index}
              className={`border-b transition-colors text-base ${
                index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
              } hover:bg-blue-100`}
            >
              <td className="px-1 py-1 text-gray-800 font-medium">{aula.Inicio}</td>
              <td className="px-1 py-1 text-gray-800 font-medium">{aula.Fim}</td>
              <td className="px-1 py-1 text-gray-800">{aula['Turma / Tipo Reserva']}</td>
              <td className="px-1 py-1 text-gray-800">
                {aula['Instrutor/Ambiente Reserva']}
              </td>
              <td className="px-1 py-1 text-gray-800">
                {aula['Unidade Curricular / Solicitante']}
              </td>
              <td className="px-1 py-1 text-gray-800">
                {aula['Ambiente Educacional / Justificativa']}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
