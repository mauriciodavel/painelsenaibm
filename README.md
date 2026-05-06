# Painel de Horários de Aula

Aplicação web responsiva para exibição de horários de aula com painel administrativo para gerenciamento de dados.

## Características

✅ **Painel Responsivo** - Layout totalmente responsivo para desktop, tablet e mobile
✅ **Filtro por Turno** - Exibe aulas separadas por horário (Matutino/Vespertino/Noturno)
✅ **Atualização Automática** - Dados atualizados a cada 2 minutos
✅ **Tabela com Cores Alternadas** - Melhor legibilidade
✅ **Painel Administrativo** - Editar dados via interface intuitiva
✅ **Upload de CSV** - Carregar novos dados facilmente
✅ **Determinação de Horários Bruno** - Filtra automaticamente por turnos

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd painelbm
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo CSV de exemplo:
```bash
cp Consultar-Horário.csv public/
```

4. Execute em desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
painelbm/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── csv/route.ts        # API para carregar/salvar CSV
│   │   │   └── upload/route.ts     # API para upload de arquivo
│   │   ├── admin/
│   │   │   └── page.tsx            # Página administrativa
│   │   ├── layout.tsx              # Layout padrão
│   │   ├── page.tsx                # Página inicial (painel)
│   │   └── globals.css             # Estilos globais
│   ├── components/
│   │   ├── TabelaPainel.tsx        # Componente da tabela pública
│   │   ├── TabelaAdmin.tsx         # Componente da tabela admin
│   │   └── CarregadorCSV.tsx       # Componente para upload CSV
│   └── utils/
│       ├── types.ts                # Tipos TypeScript
│       └── csvUtils.ts             # Utilitários para CSV
├── public/                         # Arquivos estáticos
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── vercel.json
```

## Uso

### Tela Pública (/)
- Exibe aulas filtradas por turno
- Atualiza automaticamente a cada 2 minutos
- Mostra data e hora atual
- Link rápido para painel administrativo

### Painel Administrativo (/admin)
- Editar todos os campos das aulas
- Filtrar por data, período e turno
- Ordenação dinâmica clicando nas colunas
- Carregar novo arquivo CSV
- Salvar alterações

## Formato do CSV

O arquivo CSV deve conter as seguintes colunas:
- `Data` - Data no formato DD/MM/YYYY
- `Dia` - Dia da semana
- `Inicio` - Horários de início (ex: "07:30  08:30  09:30  10:30")
- `Fim` - Horários de fim (ex: "08:30  09:30  10:30  11:30")
- `Turma / Tipo Reserva`
- `Instrutor/Ambiente Reserva`
- `Unidade Curricular / Solicitante`
- `Ambiente Educacional / Justificativa`
- `Tipo de Agenda`

## Filtro de Turnos

- **Matutino**: 06:00 - 11:59
- **Vespertino**: 12:00 - 17:59
- **Noturno**: 18:00 - 23:59

## Deployment no Vercel

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard do Vercel se necessário

## Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 18** - UI components

## Melhorias Futuras

- [ ] Integração com banco de dados
- [ ] Barra lateral com mídias
- [ ] Autenticação para painel admin
- [ ] Notificações em tempo real
- [ ] Dark mode
- [ ] Exportação de dados em múltiplos formatos

## Licença

MIT

## Contato

Para dúvidas ou sugestões, entre em contato com o desenvolvedor.
