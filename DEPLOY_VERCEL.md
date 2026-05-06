# Guia Completo: Deploy no Vercel

## ✅ Pré-requisitos

1. **Conta no Vercel**: Acesse https://vercel.com e crie uma conta gratuita
2. **Git instalado**: https://git-scm.com
3. **Repositório Git**: Seu projeto já tem `.git`, mas deve estar no GitHub, GitLab ou Bitbucket
4. **Token pessoal (opcional)**: Para usar Vercel CLI sem browser

## 🚀 Opção 1: Deploy Via Interface Web (Recomendado)

### Passo 1: Push para GitHub
```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: Painel de horários com scroll automático"

# Push para main (você precisa ter repositório no GitHub)
git push origin main
```

### Passo 2: Conectar ao Vercel
1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione "Import Git Repository"
4. Conecte sua conta GitHub/GitLab/Bitbucket
5. Selecione o repositório `painelbm`
6. Clique em "Import"

### Passo 3: Configurar Projeto
A configuração do Vercel deve ser automática porque:
- ✅ `vercel.json` já está configurado
- ✅ `package.json` detectado como Next.js
- ✅ Variáveis de ambiente não são obrigatórias

### Passo 4: Deploy
- Clique em "Deploy"
- Aguarde ~2-3 minutos
- Sua app estará em: `https://painelbm.vercel.app`

---

## 🔧 Opção 2: Deploy Via Vercel CLI

### Instalação
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Deploy
```bash
cd c:\Users\mauri\OneDrive\Documentos\VScode Projetos\painelbm
vercel
```

Responda às perguntas:
- "Set up and deploy?": **Yes**
- "Which scope?": Seu nome (ou organização)
- "Link to existing project?": **No** (primeira vez)
- "Project name": `painelbm` (ou deixe sugerir)
- "Which directory?": `.` (padrão)

---

## 📋 Checklist de Configuração

### Arquivos que já estão OK ✅
- ✅ `vercel.json` - Configurado
- ✅ `.gitignore` - Exclui node_modules, .next, .env
- ✅ `package.json` - Scripts corretos
- ✅ `next.config.js` - Compatível com Vercel
- ✅ `tsconfig.json` - TypeScript configurado

### Problemas Potenciais ⚠️ e Soluções

#### 1. **CSV não encontrado em produção**
**Problema**: Arquivo `Consultar-Horário.csv` está no root

**Solução**:
```bash
# Copie o arquivo para public/
cp Consultar-Horário.csv public/
```

Seu código em `src/app/api/csv/route.ts` deve ler de `/public/Consultar-Horário.csv`

#### 2. **Erro: "Cannot find module"**
**Solução**: Limpe e rebuild
```bash
rm -rf .next node_modules
npm install
npm run build
```

#### 3. **Timeout na build**
**Solução**: Vercel tem limite de 45 segundos, seu build é ~5s (OK)

#### 4. **Erro de permissões ao escrever CSV**
**Solução**: Em produção, você não pode escrever em arquivos direto no Vercel (READ-ONLY filesystem)
- Use banco de dados (PostgreSQL, MongoDB)
- Ou salve em serviço externo (AWS S3, Firebase)
- Para MVP: use apenas leitura do CSV

---

## 🔐 Variáveis de Ambiente (Vercel)

Se precisar adicionar no futuro:

1. Vá para https://vercel.com/dashboard
2. Seu projeto → "Settings" → "Environment Variables"
3. Adicione variáveis conforme necessário

Exemplo:
```
DATABASE_URL = postgresql://...
API_KEY = seu-key-aqui
```

---

## 📊 Monitoramento Pós-Deploy

### Verificar Deploys
1. Vá para https://vercel.com/dashboard
2. Seu projeto → "Deployments"
3. Clique no deployment para ver logs

### Visualizar Logs
```bash
vercel logs
```

### Rollback (desfazer)
Na dashboard, clique em um deployment anterior e "Promote to Production"

---

## 🎯 Domínio Personalizado (Opcional)

### Adicionar Domínio
1. Dashboard → Seu projeto → "Settings" → "Domains"
2. Adicione seu domínio (ex: `painel.senai-vitoria.br`)
3. Configure DNS conforme instruções

### Certificado HTTPS
✅ Automático pelo Vercel (gratuito com Let's Encrypt)

---

## 💡 Dicas Importantes

### Build Command
O `vercel.json` usa: `npm run build`
- Compila TypeScript
- Otimiza JS/CSS
- Gera arquivos estáticos

### Start Command
```bash
npm start
```
Inicia servidor Next.js em produção

### Desenvolvimento vs Produção
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção (simulado localmente)
npm run build
npm start
```

---

## ❌ Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|--------|
| `Build failed` | Erro de lint/TypeScript | Rode `npm run build` localmente |
| `CSV not found` | Arquivo não está em public | `cp Consultar-Horário.csv public/` |
| `Cannot read /data` | Filesystem read-only | Use banco de dados |
| `Module not found` | Dependência faltando | `npm install` + `npm run build` |
| `Timeout` | Build muito longo | Otimize, sua build é rápida (~5s) |

---

## 🚨 IMPORTANTE: Arquivo CSV em Produção

Escolha uma Das opções:

### Opção A: CSV Estático (Recomendado para MVP)
```bash
# Copiar CSV para public/
cp Consultar-Horário.csv public/

# Seu código lê: /public/Consultar-Horário.csv
```
✅ Funciona sem problemas
❌ Não pode editar via painel admin em produção

### Opção B: Banco de Dados (Produção Real)
```bash
# Instalar driver
npm install @vercel/postgres

# Usar em vez de CSV
```
✅ Edições persistem
❌ Requer configuração adicional

**Por enquanto, use Opção A** (CSV estático)

---

## ✨ Depois de Fazer Deploy

1. **Teste tudo**:
   - Acesse https://seu-app.vercel.app
   - Verifique scroll automático
   - Teste filtros
   - Teste admin (/admin)

2. **Configure Domínio Personalizado** (se tiver)

3. **Configure Alias Git** (recomendado):
   ```bash
   vercel alias set https://seu-app.vercel.app seu-dominio.com
   ```

4. **Ative CI/CD automático**:
   - Push para GitHub automáticamente faz deploy
   - Não precisa fazer nada mais!

---

## 📞 Suporte

- Docs Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- Comunidade: https://github.com/vercel/next.js/discussions
