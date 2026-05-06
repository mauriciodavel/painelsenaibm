# Painel de Horários - SENAÍ Beira Mar

Aplicação web moderna de digital signage para exibição de horários de aula com painel administrativo. Desenvolvida especificamente para SENAÍ com design institucional.

## Características

✅ **Digital Signage com Scroll Automático** - Scroll contínuo infinito (slow motion) para exibição em monitores de recepção
✅ **Scroll Suave em Loop** - Aguarda 15s ao iniciar, desce suavemente, pausa 15s, sobe suavemente, repete infinitamente
✅ **Design SENAÍ Institucional** - Cores azul e laranja com gradiente profissional (blue-to-orange)
✅ **Tabela com Fonte Aumentada** - Text-base (14px) para melhor legibilidade à distância
✅ **Filtros Compactos** - Interface otimizada para maximizar espaço da tabela
✅ **Painel Responsivo** - Layout totalmente responsivo para desktop, tablet e mobile
✅ **Filtro por Turno** - Exibe aulas separadas por horário (Matutino/Vespertino/Noturno)
✅ **Atualização Automática** - Dados atualizados a cada 2 minutos da API
✅ **Painel Administrativo** - Editar dados via interface intuitiva
✅ **Persistência em CSV** - Salva automaticamente alterações em arquivo CSV
✅ **Filtros Dinâmicos** - Filtrar por turma e instrutor com atualização em tempo real

## Stack Tecnológico

- **Framework**: Next.js 14.2.35
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: Tailwind CSS com 10 variáveis de cores SENAÍ
- **Persistência**: CSV com parser customizado
- **Ambiente**: Node.js 18+

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

## Scroll Automático (Digital Signage)

O painel implementa um sistema de scroll infinito otimizado para exibição em monitores de recepção e salas de espera:

### Comportamento
1. **Aguarda 15 segundos** após o carregamento
2. **Desce lentamente** (scroll suave - slow motion)
3. **Pausa 15 segundos** ao chegar no final
4. **Sobe lentamente** (scroll suave - slow motion)
5. **Pausa 15 segundos** ao chegar no topo
6. **Repete infinitamente** enquanto o conteúdo exceder a tela

**Características técnicas:**
- Ativa automaticamente apenas quando necessário (table > viewport)
- Implementado com `requestAnimationFrame` para máxima suavidade
- Taxa: 2 pixels por frame (~60fps)
- Sem ativação desnecessária se todo conteúdo cabe na tela

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
**Digital Signage para Monitores de Recepção**
- ✅ Exibe aulas do dia atual filtradas por turno
- ✅ Scroll automático infinito em loop (15s delay → desce → 15s pausa → sobe → repete)
- ✅ Atualiza dados a cada 2 minutos
- ✅ Mostra data e hora em tempo real com gradiente SENAÍ
- ✅ Tabela compacta com fonte aumentada para legibilidade
- ✅ Filtro por turma e instrutor com atualização em tempo real
- ✅ Ideal para exibição contínua em modo fullscreen

### Painel Administrativo (/admin)
**Gerenciamento de Horários**
- ✅ Editar todos os campos das aulas (Turma, Instrutor, Ambiente, etc)
- ✅ Filtrar por data, turno e período
- ✅ Criar novas aulas com formulário intuitivo
- ✅ Deletar aulas com confirma ção
- ✅ Carregar novo arquivo CSV via drag-and-drop
- ✅ Persistência automática em CSV
- ✅ Salvar alterações (sincroniza com arquivo)

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

## Build & Production

### Build para produção:
```bash
npm run build
```

**Build info:**
- Tamanho otimizado: ~90.4 kB (home page)
- Zero erros de linting
- TypeScript strict mode validado
- Todas as páginas pré-renderizadas

### Executar em produção:
```bash
npm start
```

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

- **Next.js 14.2.35** - Framework React com SSR/SSG
- **React 18** - Library UI
- **TypeScript** - Type safety com strict mode
- **Tailwind CSS** - Utility-first CSS com 10 variáveis de cor SENAÍ
- **RequestAnimationFrame API** - Scroll suave otimizado
- **Node.js 18+** - Runtime

**Cores Institucionais SENAÍ:**
- Primary: #0f2d52 (azul escuro)
- Secondary: #ef7a17 (laranja)
- Support: Gradientes e variações

## Variáveis de Ambiente

Criar arquivo `.env.local`:
```bash
# Opcional - configurações futuras podem ser adicionadas aqui
```

Atualmente o projeto não requer variáveis de ambiente obrigatórias.

## Melhorias Futuras

- [ ] Autenticação para painel admin
- [ ] Banco de dados (PostgreSQL/MongoDB)
- [ ] Notificações/Alerts em tempo real
- [ ] Multi-idioma (PT/EN)
- [ ] Dark mode
- [ ] Exportação em PDF/Excel
- [ ] Integração com calendário
- [ ] Analytics e logs
- [ ] Sincronização com sistemas externos
- [ ] App mobile (React Native)

## Troubleshooting

### Scroll não funciona no Chrome/Edge
- Verifique se há conteúdo suficiente para scroll (scrollHeight > clientHeight)
- O scroll só ativa se conteúdo "exceder" a tela
- Teste em modo fullscreen

### Dados não atualizam
- Verifique se o arquivo CSV está no local correto
- Reinicie o servidor: `npm run dev`
- Limpe o cache: `rm -rf .next`

### Porta 3000 já está em uso
```bash
# Kill o processo Node
ps aux | grep node | grep -v grep | awk '{print $2}' | xargs kill -9

# Ou use outra porta
PORT=3001 npm run dev
```

## Performance

- **First Load JS**: 90.4 kB
- **Otimizações**: Next.js built-in caching, lazy loading, code splitting
- **Scroll Performance**: 60fps com requestAnimationFrame (2px/frame)
- **API Response**: ~38ms (CSV em memória)
- **Build Time**: ~5 segundos

## Licença

MIT

## Contato

Desenvolvido para SENAÍ Beira Mar - Vitória
Email: contato@senai-vitoria.br
