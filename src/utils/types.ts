export interface Aula {
  Data: string;
  Dia: string;
  Inicio: string;
  Fim: string;
  "Turma / Tipo Reserva": string;
  "Instrutor/Ambiente Reserva": string;
  "Unidade Curricular / Solicitante": string;
  "Ambiente Educacional / Justificativa": string;
  "Tipo de Agenda": string;
}

export interface AulaExibicao extends Omit<Aula, 'Inicio' | 'Fim'> {
  Inicio: string;
  Fim: string;
}

export type Turno = 'matutino' | 'vespertino' | 'noturno';

export interface FiltroAdmin {
  dataInicio: string;
  dataFim: string;
  turno: 'todos' | Turno;
  ordenacao: {
    coluna: keyof Aula | '';
    direcao: 'asc' | 'desc';
  };
}
