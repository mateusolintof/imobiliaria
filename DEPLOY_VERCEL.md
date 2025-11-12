# Deploy na Vercel - Plataforma Imobiliária

## Por que Vercel?

✅ **Melhor opção para Next.js** (criada pelos mesmos desenvolvedores)
✅ **Deploy automático** a cada push no GitHub
✅ **SSL grátis** e domínio `.vercel.app`
✅ **Preview deployments** para cada branch/PR
✅ **Edge Network global** para performance máxima
✅ **Plano gratuito generoso** para projetos pessoais

---

## Passo 1: Preparar o Projeto

### 1.1 Verificar se o build está funcionando

```bash
npm run build
```

Se houver erros, corrija antes de continuar.

### 1.2 Confirmar .gitignore

Verifique que o `.gitignore` contém:

```
.env*.local
.env
node_modules/
.next/
```

✅ **Importante:** Nunca commite arquivos `.env.local` com credenciais!

---

## Passo 2: Criar Conta na Vercel

1. Acesse **https://vercel.com**
2. Clique em **"Sign Up"**
3. **Escolha:** "Continue with GitHub" (recomendado)
4. Autorize a Vercel a acessar seus repositórios

---

## Passo 3: Importar Projeto

### 3.1 Na Dashboard da Vercel

1. Clique em **"Add New..."** → **"Project"**
2. Selecione o repositório **`mateusolintof/imobiliaria`**
3. Clique em **"Import"**

### 3.2 Configurar o Projeto

**Framework Preset:** Next.js (detectado automaticamente ✅)

**Build Settings:**
- Build Command: `npm run build` (padrão ✅)
- Output Directory: `.next` (padrão ✅)
- Install Command: `npm install` (padrão ✅)

**Root Directory:** `./` (raiz do projeto ✅)

---

## Passo 4: Configurar Variáveis de Ambiente

⚠️ **MUITO IMPORTANTE:** Configure as variáveis de ambiente na Vercel!

### 4.1 Adicionar Variáveis

Na seção **"Environment Variables"**, adicione:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 4.2 Onde encontrar os valores?

1. Acesse o **Supabase Dashboard**
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4.3 Aplicar a todos os ambientes

✅ Marque todas as opções:
- **Production** (produção)
- **Preview** (visualizações)
- **Development** (desenvolvimento)

---

## Passo 5: Deploy!

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos (primeira vez demora mais)
3. ✅ Deploy concluído!

Você verá uma URL como: **`https://imobiliaria-xxxxx.vercel.app`**

---

## Passo 6: Testar a Aplicação

1. Clique na URL do deploy
2. Teste todas as funcionalidades:
   - ✅ Cadastrar imóvel
   - ✅ Ver lista de imóveis
   - ✅ Upload de imagens
   - ✅ Simulação de financiamento
   - ✅ Análise de investimento
   - ✅ Comparação de imóveis

---

## Passo 7 (Opcional): Configurar Domínio Customizado

### 7.1 Se você tem um domínio próprio

1. Na Vercel, vá em **Settings** → **Domains**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `meuprojeto.com.br`)
4. Siga as instruções para configurar DNS

### 7.2 Registros DNS necessários

**Tipo A:**
```
@ → 76.76.21.21
```

**Tipo CNAME:**
```
www → cname.vercel-dns.com
```

---

## Deploy Automático

### Como funciona?

✅ **A cada `git push` para `main`:**
- Vercel detecta automaticamente
- Executa `npm run build`
- Faz deploy da nova versão
- Disponibiliza em produção

### Para branches de desenvolvimento:

✅ **A cada `git push` para outras branches:**
- Cria um **Preview Deployment**
- URL única para testar: `https://imobiliaria-xxxxx-git-branch.vercel.app`
- Não afeta produção

---

## Comandos Úteis

### Ver logs de build

```bash
# Na Vercel Dashboard → seu projeto → Deployments → clique no deploy → View Function Logs
```

### Redeploy manual

```bash
# Na Vercel Dashboard → seu projeto → Deployments → três pontos → Redeploy
```

### Rollback para versão anterior

```bash
# Na Vercel Dashboard → seu projeto → Deployments → selecione versão anterior → Promote to Production
```

---

## Monitoramento e Analytics

A Vercel oferece gratuitamente:

✅ **Web Analytics** - visitantes, páginas mais acessadas
✅ **Speed Insights** - performance das páginas
✅ **Build Logs** - logs de cada deploy
✅ **Function Logs** - logs de execução

Acesse em: **Analytics** na sidebar do projeto

---

## Troubleshooting

### Erro: "Supabase credentials not found"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Vá em **Settings** → **Environment Variables**
2. Adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Clique em **"Redeploy"** para aplicar

### Erro: "Build failed"

**Causa:** Erro de TypeScript ou build

**Solução:**
1. Execute `npm run build` localmente
2. Corrija os erros
3. Faça commit e push
4. Vercel vai detectar e redeployar

### Imagens não carregam

**Causa:** Domínio do Supabase Storage não está permitido

**Solução:**
1. Abra `next.config.js`
2. Adicione o domínio do Supabase em `images.domains`:

```javascript
const nextConfig = {
  images: {
    domains: ['localhost', 'xxxxx.supabase.co'], // adicione seu domínio
  },
}
```

3. Commit e push

### Upload de imagens não funciona

**Causa:** Bucket do Supabase Storage não configurado

**Solução:**
Siga o arquivo `SUPABASE_STORAGE_SETUP.md`

---

## Custos

### Plano Gratuito (Hobby)

✅ **100 GB bandwidth/mês**
✅ **Deploy ilimitados**
✅ **1000 builds/mês**
✅ **Domínios customizados ilimitados**
✅ **SSL automático**

**Perfeito para projetos pessoais!**

### Quando você precisaria pagar?

- Se ultrapassar 100 GB de tráfego/mês
- Se precisar de mais de 1000 builds/mês
- Se quiser recursos avançados (Teams, Analytics premium)

**Para a maioria dos projetos pessoais, o plano gratuito é suficiente!**

---

## Próximos Passos Após o Deploy

1. ✅ Compartilhe a URL do projeto
2. ✅ Adicione ao seu portfólio/CV
3. ✅ Configure Google Analytics (opcional)
4. ✅ Adicione um domínio customizado (opcional)
5. ✅ Configure um README.md com a URL do projeto
6. ✅ Continue desenvolvendo - cada push deploya automaticamente!

---

## Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel + Next.js:** https://vercel.com/docs/frameworks/nextjs
- **Status da Vercel:** https://www.vercel-status.com/

---

## Dicas de Performance

### 1. Otimizar Imagens

O Next.js já otimiza automaticamente, mas você pode:
- Usar formato WebP
- Redimensionar antes do upload
- Comprimir antes do upload

### 2. Caching

A Vercel já faz caching automático de:
- Páginas estáticas
- Assets (CSS, JS, imagens)
- API Routes (pode configurar)

### 3. Edge Functions

Para melhor performance global, considere usar:
- Edge Runtime para API Routes
- Middleware na edge

---

## Suporte

Se tiver problemas:

1. **Documentação:** https://vercel.com/docs
2. **Community:** https://github.com/vercel/vercel/discussions
3. **Support:** suporte direto pelo dashboard (planos pagos)

---

**Parabéns! 🎉 Seu projeto está pronto para o mundo!**
