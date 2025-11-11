# Configuração do Supabase

Este documento explica como configurar o Supabase para a Plataforma Imobiliária.

## Passo 1: Criar uma conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

## Passo 2: Executar o Schema SQL

1. No dashboard do Supabase, vá para **SQL Editor**
2. Crie uma nova query
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e execute

Isso criará:
- Tabelas: `developers`, `properties`, `mortgage_scenarios`, `cashflow_projections`, `user_preferences`, `comparisons`
- Índices para otimização de queries
- Triggers para atualização automática de `updated_at`
- Dados iniciais de preferências padrão

## Passo 3: Obter Credenciais

1. No dashboard do Supabase, vá para **Settings** → **API**
2. Copie:
   - **Project URL** (algo como `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key

## Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-project-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

2. Substitua os valores pelas suas credenciais do Supabase

## Passo 5: Verificar a Instalação

Execute o projeto:

```bash
npm run dev
```

Acesse `http://localhost:3000` e teste:
1. Cadastrar um imóvel
2. Ver na lista de "Meus Imóveis"
3. Configurar parâmetros

## Estrutura do Banco de Dados

### Tabelas Principais

#### properties
Armazena todos os imóveis cadastrados (prontos e na planta)

#### developers
Informações sobre incorporadoras

#### mortgage_scenarios
Cenários de financiamento para cada imóvel

#### cashflow_projections
Projeções de investimento e rentabilidade

#### user_preferences
Configurações e preferências do usuário

#### comparisons
Comparações salvas entre múltiplos imóveis

## Notas Importantes

- Row Level Security (RLS) está **desabilitado** por padrão
- Para habilitar autenticação de usuários no futuro:
  - Ative RLS nas tabelas
  - Crie políticas de acesso
  - Configure auth.users
  - Modifique os hooks para usar user_id do contexto de autenticação

## Troubleshooting

### Erro: "Supabase credentials not found"
- Verifique se o arquivo `.env.local` existe
- Confirme que as variáveis começam com `NEXT_PUBLIC_`
- Reinicie o servidor de desenvolvimento

### Erro ao inserir dados
- Verifique se o schema foi executado corretamente
- Confirme que todas as tabelas foram criadas
- Veja os logs de erro no console do navegador

### Dados não aparecem
- Abra o Supabase Dashboard → Table Editor
- Verifique se os dados estão sendo inseridos
- Confirme que não há erros de CORS ou API
