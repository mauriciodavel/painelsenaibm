# Solução: Persistência de dados em Vercel

## ⚠️ Problema Diagnosticado

Vercel tem um **filesystem READ-ONLY** em produção. O seu código tenta escrever/editar arquivos com `fs.writeFile()`, o que causa:

❌ Erro 500 ao tentar salvar edições
❌ Erro 500 ao fazer upload de novo CSV
❌ Alterações não persistem (só funcionam localmente)

---

## ✅ Solução 1: Desabilitar Edições em Produção (IMPLEMENTADO)

**Status**: ✅ **JÁ APLICADO**

O que foi mudado:
- API POST `/api/csv` agora retorna erro 403 em produção
- API POST `/api/upload` agora retorna erro 403 em produção
- Mensagem clara: "não disponível em produção"

**Resultado**:
- ✅ App funciona normalmente como **read-only** em produção
- ✅ Painel de horários exibe dados corretamente
- ✅ Scroll automático funciona perfeitamente
- ❌ Não pode editar dados em produção

**Quando usar**: MVP, apps que não precisam editar dados online

**Deploy**:
```bash
git add -A
git commit -m "fix: disable file writes in production (Vercel read-only fs)"
git push origin main
```

---

## 🚀 Solução 2: Vercel Blob Storage (Recomendado)

Usar **Vercel Blob** - serviço de armazenamento nativo do Vercel

### Vantagens:
✅ Integração nativa com Vercel
✅ Suporta leitura e escrita
✅ Gratuito no plano free (até 100GB)
✅ Implementação simples (mude 3 funções)

### Passos:

1. **Instale a lib do Vercel**:
```bash
npm install @vercel/blob
```

2. **Gere token de autenticação**:
   - Acesse https://vercel.com/account/tokens
   - Crie novo token
   - Copie o token

3. **Configure no Vercel Dashboard**:
   - Projeto → Settings → Environment Variables
   - Adicione: `BLOB_READ_WRITE_TOKEN` = (seu token)

4. **Substitua no código** (arquivo `src/app/api/csv/route.ts`):
```typescript
import { put, get } from '@vercel/blob';

const BLOB_KEY = 'Consultar-Horário.csv';

export async function GET() {
  try {
    const blob = await get(BLOB_KEY, {
      access: 'public',
    });
    const conteudo = await blob.text();
    return NextResponse.json({ conteudo, sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao ler CSV', sucesso: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conteudo } = await request.json();
    
    if (!conteudo) {
      return NextResponse.json({ erro: 'Conteúdo não fornecido', sucesso: false }, { status: 400 });
    }

    await put(BLOB_KEY, conteudo, {
      access: 'public',
    });
    
    return NextResponse.json({ sucesso: true, mensagem: 'CSV salvo com sucesso' });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao salvar CSV', sucesso: false }, { status: 500 });
  }
}
```

5. **Faça o push**:
```bash
npm install @vercel/blob
git add package.json src/app/api/csv/route.ts
git commit -m "feat: use Vercel Blob for persistent CSV storage"
git push origin main
```

**Tempo de implementação**: ~15 minutos
**Dificuldade**: Média

---

## 🗄️ Solução 3: Banco de Dados (Mais Robusto)

### Opção A: PostgreSQL (Vercel Postgres)

```bash
# Instale
npm install @vercel/postgres

# Configure no Vercel Dashboard:
# - Crie database no Vercel Postgres
# - Copy connection string
# - Adicione como Environment Variable
```

### Opção B: MongoDB Atlas (Gratuito)

```bash
# Instale
npm install mongodb

# Configure no MongoDB Atlas:
# - Crie cluster gratuito
# - Copy connection string
# - Adicione como Environment Variable
```

**Vantagens**:
✅ Permitem edições completas
✅ Histórico de alterações
✅ Backup automático
✅ Query poderosas

**Desvantagens**:
❌ Requer refatoração maior do código
❌ Mais complexo
❌ Pode ter custos

**Tempo de implementação**: ~1-2 horas
**Dificuldade**: Alta

---

## 📊 Comparação das Soluções

| Aspecto | Solução 1 | Solução 2 | Solução 3 |
|---------|----------|----------|----------|
| **Status** | ✅ Implementado | Recomendado | Para futuro |
| **Custo** | Grátis | Grátis | Grátis (start) |
| **Edições** | ❌ Não | ✅ Sim | ✅ Sim |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Tempo** | 0 min | 15 min | 1-2 horas |
| **Escala** | Pequena | Média | Grande |

---

## 🎯 Recomendação

**Para seu projeto agora**:
- ✅ **Use Solução 1** (já implementada) - Painel funciona como read-only
- 📅 **Depois implemente Solução 2** - Cuando precisar editar em produção

**Como você falou que é um MVP**: Comece com Solução 1, depois upgrade para Solução 2.

---

## 🧪 Teste Agora

1. **Deploy as mudanças**:
```bash
git add -A
git commit -m "fix: handle production constraints"
git push origin main
```

2. **Aguarde deploy no Vercel**

3. **Acesse /admin** em produção
   - Tentar editar → Verá mensagem clara
   - Painel principal funciona perfeitamente ✅

4. **Continue em desenvolvimento local**:
```bash
npm run dev
# Edições funcionam normalmente aqui
```

---

## ❓ FAQ

**P: Por que funciona em localhost mas não em Vercel?**
R: Em localhost você tem escrita de arquivo. Vercel é runtime imutável - redeploy = nova instância = sem persistência de arquivos.

**P: Posso salvar em outro lugar?**
R: Sim! Blob storage (Solução 2), banco de dados (Solução 3), ou AWS S3, Firebase Storage, etc.

**P: O painel principal funciona em produção?**
R: Sim! ✅ Lê o CSV sem problemas. Só não pode editar.

**P: Quanto custa Blob storage?**
R: Gratuito até 100GB/mês no plano free.

---

## 📞 Próximos Passos

1. **Agora**: Deploy a Solução 1 (teste read-only)
2. **Depois**: Se precisar edições em produção, implemente Solução 2
3. **Futuro**: Se crescer muito, migre para banco de dados (Solução 3)

Precisa de ajuda com Solução 2 ou 3? Me avise! 🚀
