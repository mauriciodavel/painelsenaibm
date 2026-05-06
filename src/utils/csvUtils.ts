import { Aula, Turno, AulaExibicao } from './types';

export function parseCSV(csvContent: string): Aula[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  // Parse data
  const aulas: Aula[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const aula: any = {};
      headers.forEach((header, index) => {
        aula[header] = values[index];
      });
      aulas.push(aula);
    }
  }

  return aulas;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function aulaToCSVLine(aula: Aula): string {
  const keys = Object.keys(aula) as (keyof Aula)[];
  return keys
    .map(key => {
      const value = String(aula[key]);
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return `"${value}"`;
    })
    .join(',');
}

export function aulaToCSV(aulas: Aula[]): string {
  if (aulas.length === 0) return '';

  const headers = Object.keys(aulas[0]);
  const headerLine = headers.map(h => `"${h}"`).join(',');

  const dataLines = aulas.map(aula => aulaToCSVLine(aula));

  return [headerLine, ...dataLines].join('\n');
}

export function getTurnoFromHora(hora: string): Turno | null {
  const [horas] = hora.split(':');
  const h = parseInt(horas);

  if (h >= 6 && h < 12) return 'matutino';
  if (h >= 12 && h < 18) return 'vespertino';
  if (h >= 18 || h < 6) return 'noturno';

  return null;
}

export function formatarHorario(horarioStr: string): string {
  // De: "07:30  08:30  09:30  10:30" para "07:30"
  return horarioStr.trim().split(/\s+/)[0];
}

export function formatarHorarioFim(horarioStr: string): string {
  // De: "08:30  09:30  10:30  11:30" para "11:30"
  const horas = horarioStr.trim().split(/\s+/);
  return horas[horas.length - 1];
}

export function filtrarAulasPorTurno(aulas: Aula[], turno: Turno): AulaExibicao[] {
  return aulas
    .filter(aula => getTurnoFromHora(aula.Inicio) === turno)
    .map(aula => ({
      ...aula,
      Inicio: formatarHorario(aula.Inicio),
      Fim: formatarHorarioFim(aula.Fim),
    }));
}

export function filtrarAulasPorData(
  aulas: Aula[], 
  dataInicio: string, 
  dataFim: string
): Aula[] {
  return aulas.filter(aula => {
    const [dia, mes, ano] = aula.Data.split('/');
    const date = new Date(`${ano}-${mes}-${dia}`);
    
    const [startDia, startMes, startAno] = dataInicio.split('/');
    const startDate = new Date(`${startAno}-${startMes}-${startDia}`);
    
    const [endDia, endMes, endAno] = dataFim.split('/');
    const endDate = new Date(`${endAno}-${endMes}-${endDia}`);

    return date >= startDate && date <= endDate;
  });
}

export function filtrarAulasPorTurnoAdmin(aulas: Aula[], turno: 'todos' | Turno): Aula[] {
  if (turno === 'todos') return aulas;
  return aulas.filter(aula => getTurnoFromHora(aula.Inicio) === turno);
}

export function ordenarAulas(
  aulas: Aula[] | AulaExibicao[], 
  coluna: keyof Aula | '', 
  direcao: 'asc' | 'desc'
): typeof aulas {
  if (!coluna) return aulas;

  const sorted = [...aulas].sort((a, b) => {
    const aVal = String(a[coluna as keyof typeof a] || '');
    const bVal = String(b[coluna as keyof typeof b] || '');

    // Tenta converter para número se possível
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    let comparison = 0;
    if (!isNaN(aNum) && !isNaN(bNum)) {
      comparison = aNum - bNum;
    } else {
      comparison = aVal.localeCompare(bVal);
    }

    return direcao === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

export function obterDataAtual(): string {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const ano = agora.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function obterTurnoAtual(): Turno {
  const agora = new Date();
  const horas = agora.getHours();

  if (horas >= 6 && horas < 12) return 'matutino';
  if (horas >= 12 && horas < 18) return 'vespertino';
  return 'noturno';
}
