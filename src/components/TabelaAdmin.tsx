'use client';

import React, { useState, useEffect } from 'react';
import { Aula, FiltroAdmin } from '@/utils/types';
import { 
  filtrarAulasPorData, 
  filtrarAulasPorTurnoAdmin, 
  ordenarAulas,
  obterDataAtual 
} from '@/utils/csvUtils';

interface TabelaAdminProps {
  aulas: Aula[];
  onSalvar: (aulas: Aula[]) => void;
  onCarregar: () => void;
  onNovoRegistro?: (aula: Aula) => void;
}

export default function TabelaAdmin({ aulas, onSalvar, onCarregar, onNovoRegistro }: TabelaAdminProps) {
  const [aulasExibidas, setAulasExibidas] = useState<Aula[]>(aulas);
  const [aulasEditadas, setAulasEditadas] = useState<Aula[]>(aulas);
  const [showNovoRegistro, setShowNovoRegistro] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState<Partial<Aula>>({
    Data: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
    Dia: '',
    Inicio: '',
    Fim: '',
    'Turma / Tipo Reserva': '',
    'Instrutor/Ambiente Reserva': '',
    'Unidade Curricular / Solicitante': '',
    'Ambiente Educacional / Justificativa': '',
    'Tipo de Agenda': '',
  });
  const [filtro, setFiltro] = useState<FiltroAdmin>({
    dataInicio: obterDataAtual(),
    dataFim: obterDataAtual(),
    turno: 'todos',
    ordenacao: {
      coluna: '',
      direcao: 'asc',
    },
  });

  useEffect(() => {
    let filtered = [...aulasEditadas];
    
    // Filtrar por data
    filtered = filtrarAulasPorData(filtered, filtro.dataInicio, filtro.dataFim);
    
    // Filtrar por turno
    filtered = filtrarAulasPorTurnoAdmin(filtered, filtro.turno);
    
    // Ordenar
    if (filtro.ordenacao.coluna) {
      filtered = ordenarAulas(filtered, filtro.ordenacao.coluna, filtro.ordenacao.direcao);
    }
    
    setAulasExibidas(filtered);
  }, [aulasEditadas, filtro]);

  const handleColunaClick = (coluna: keyof Aula) => {
    setFiltro(prev => ({
      ...prev,
      ordenacao: {
        coluna: prev.ordenacao.coluna === coluna && prev.ordenacao.direcao === 'asc' ? coluna : coluna,
        direcao: prev.ordenacao.coluna === coluna && prev.ordenacao.direcao === 'asc' ? 'desc' : 'asc',
      },
    }));
  };

  const handleCelulaMudanca = (index: number, coluna: keyof Aula, valor: string) => {
    const novasAulas = [...aulasEditadas];
    const aulaNoExibidas = aulasExibidas[index];
    const indexOriginal = aulasEditadas.indexOf(aulaNoExibidas);
    
    if (indexOriginal !== -1) {
      novasAulas[indexOriginal] = {
        ...novasAulas[indexOriginal],
        [coluna]: valor,
      };
      setAulasEditadas(novasAulas);
    }
  };

  const handleSalvar = () => {
    onSalvar(aulasEditadas);
    alert('Dados salvos com sucesso!');
  };

  const handleDelete = (index: number) => {
    const aulaNoExibidas = aulasExibidas[index];
    const indexOriginal = aulasEditadas.indexOf(aulaNoExibidas);
    
    if (indexOriginal !== -1) {
      if (confirm('Tem certeza que deseja deletar este registro?')) {
        const novasAulas = aulasEditadas.filter((_, i) => i !== indexOriginal);
        setAulasEditadas(novasAulas);
      }
    }
  };

  const handleNovoRegistro = () => {
    if (!novoRegistro.Data || !novoRegistro.Dia || !novoRegistro.Inicio || !novoRegistro.Fim) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Converter data de YYYY-MM-DD para DD/MM/YYYY
    const partes = novoRegistro.Data.split('-');
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

    const novaAula: Aula = {
      Data: dataFormatada,
      Dia: novoRegistro.Dia as string,
      Inicio: novoRegistro.Inicio as string,
      Fim: novoRegistro.Fim as string,
      'Turma / Tipo Reserva': novoRegistro['Turma / Tipo Reserva'] as string,
      'Instrutor/Ambiente Reserva': novoRegistro['Instrutor/Ambiente Reserva'] as string,
      'Unidade Curricular / Solicitante': novoRegistro['Unidade Curricular / Solicitante'] as string,
      'Ambiente Educacional / Justificativa': novoRegistro['Ambiente Educacional / Justificativa'] as string,
      'Tipo de Agenda': novoRegistro['Tipo de Agenda'] as string,
    };

    const updatedAulas = [...aulasEditadas, novaAula];
    setAulasEditadas(updatedAulas);
    onSalvar(updatedAulas);
    setShowNovoRegistro(false);
    setNovoRegistro({
      Data: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
      Dia: '',
      Inicio: '',
      Fim: '',
      'Turma / Tipo Reserva': '',
      'Instrutor/Ambiente Reserva': '',
      'Unidade Curricular / Solicitante': '',
      'Ambiente Educacional / Justificativa': '',
      'Tipo de Agenda': '',
    });
    alert('Novo registro adicionado com sucesso e salvo!');
  };

  return (
    <div className="w-full space-y-4">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <h3 className="font-semibold text-lg">Filtros</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filtro.dataInicio.split('/').reverse().join('-')}
              onChange={(e) => {
                const [ano, mes, dia] = e.target.value.split('-');
                setFiltro(prev => ({
                  ...prev,
                  dataInicio: `${dia}/${mes}/${ano}`,
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#ddd' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filtro.dataFim.split('/').reverse().join('-')}
              onChange={(e) => {
                const [ano, mes, dia] = e.target.value.split('-');
                setFiltro(prev => ({
                  ...prev,
                  dataFim: `${dia}/${mes}/${ano}`,
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#ddd' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turno
            </label>
            <select
              value={filtro.turno}
              onChange={(e) =>
                setFiltro(prev => ({
                  ...prev,
                  turno: e.target.value as 'todos' | 'matutino' | 'vespertino' | 'noturno',
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#ddd' }}
            >
              <option value="todos">Todos</option>
              <option value="matutino">Matutino (06:00 - 12:00)</option>
              <option value="vespertino">Vespertino (12:00 - 18:00)</option>
              <option value="noturno">Noturno (18:00 - 00:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="text-white" style={{ backgroundColor: 'var(--senai-primary)' }}>
              {[
                'Data',
                'Dia',
                'Inicio',
                'Fim',
                'Turma / Tipo Reserva',
                'Instrutor/Ambiente Reserva',
                'Unidade Curricular / Solicitante',
                'Ambiente Educacional / Justificativa',
              ].map(coluna => (
                <th
                  key={coluna}
                  onClick={() => handleColunaClick(coluna as keyof Aula)}
                  className="px-3 py-2 text-left text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  {coluna}
                  {filtro.ordenacao.coluna === coluna && (
                    <span className="ml-1">
                      {filtro.ordenacao.direcao === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-3 py-2 text-left text-xs font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {aulasExibidas.map((aula, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50`}
              >
                {Object.entries(aula).map(([coluna, valor]) => (
                  <td
                    key={coluna}
                    className="px-3 py-2 text-xs text-gray-800 border border-gray-200"
                  >
                    <input
                      type="text"
                      value={String(valor)}
                      onChange={(e) =>
                        handleCelulaMudanca(index, coluna as keyof Aula, e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2"
                      style={{ borderColor: '#ddd' }}
                    />
                  </td>
                ))}
                <td className="px-3 py-2 text-xs text-gray-800 border border-gray-200">
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold text-xs w-full"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handleSalvar}
          className="px-6 py-2 text-white rounded-lg font-semibold transition-colors hover:opacity-90"
          style={{ backgroundColor: 'var(--status-available)' }}
        >
          Salvar Alterações
        </button>
        <button
          onClick={onCarregar}
          className="px-6 py-2 text-white rounded-lg font-semibold transition-colors"
          style={{ backgroundColor: 'var(--senai-primary)' }}
        >
          Carregar Novo CSV
        </button>
        <button
          onClick={() => setShowNovoRegistro(!showNovoRegistro)}
          className="px-6 py-2 text-white rounded-lg font-semibold transition-colors"
          style={{ backgroundColor: 'var(--senai-support-1)' }}
        >
          {showNovoRegistro ? '✕ Cancelar' : '+ Novo Registro'}
        </button>
      </div>

      {/* Formulário Novo Registro */}
      {showNovoRegistro && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4 mt-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--senai-dark)' }}>Adicionar Novo Registro</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                value={novoRegistro.Data}
                onChange={(e) => setNovoRegistro({...novoRegistro, Data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dia *</label>
              <input
                type="text"
                value={novoRegistro.Dia}
                onChange={(e) => setNovoRegistro({...novoRegistro, Dia: e.target.value})}
                placeholder="Ex: Seg, Ter, Qua..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início *</label>
              <input
                type="text"
                value={novoRegistro.Inicio}
                onChange={(e) => setNovoRegistro({...novoRegistro, Inicio: e.target.value})}
                placeholder="Ex: 07:30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim *</label>
              <input
                type="text"
                value={novoRegistro.Fim}
                onChange={(e) => setNovoRegistro({...novoRegistro, Fim: e.target.value})}
                placeholder="Ex: 11:30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turma / Tipo Reserva</label>
              <input
                type="text"
                value={novoRegistro['Turma / Tipo Reserva']}
                onChange={(e) => setNovoRegistro({...novoRegistro, 'Turma / Tipo Reserva': e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instrutor/Ambiente Reserva</label>
              <input
                type="text"
                value={novoRegistro['Instrutor/Ambiente Reserva']}
                onChange={(e) => setNovoRegistro({...novoRegistro, 'Instrutor/Ambiente Reserva': e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Curricular / Solicitante</label>
              <input
                type="text"
                value={novoRegistro['Unidade Curricular / Solicitante']}
                onChange={(e) => setNovoRegistro({...novoRegistro, 'Unidade Curricular / Solicitante': e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente Educacional / Justificativa</label>
              <input
                type="text"
                value={novoRegistro['Ambiente Educacional / Justificativa']}
                onChange={(e) => setNovoRegistro({...novoRegistro, 'Ambiente Educacional / Justificativa': e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Agenda</label>
              <input
                type="text"
                value={novoRegistro['Tipo de Agenda']}
                onChange={(e) => setNovoRegistro({...novoRegistro, 'Tipo de Agenda': e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleNovoRegistro}
              className="px-6 py-2 text-white rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: 'var(--status-available)' }}
            >
              Adicionar
            </button>
            <button
              onClick={() => setShowNovoRegistro(false)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
