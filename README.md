# Plataforma de Análise Imobiliária

Uma aplicação web para organizar imóveis, simular cenários financeiros e comparar opções de compra e investimento.

## Funcionalidades

- **Cadastro de Imóveis**: Registre imóveis prontos ou na planta com todos os detalhes
- **Meus Imóveis**: Gerencie seu portfólio com filtros e tags
- **Simulador de Moradia**: Calcule financiamentos (Price/SAC), prestações e custos totais
- **Análise de Investimento**: Cap Rate, IRR, Cash-on-Cash e ranking de rentabilidade
- **Comparação**: Compare múltiplos imóveis lado a lado
- **Parâmetros**: Configure taxas, pesos e preferências pessoais

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **UI**: Material-UI (MUI)
- **Backend**: Supabase (PostgreSQL)
- **Validação**: Zod

## Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase.

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
/app                 # Rotas e páginas (App Router)
/components          # Componentes React reutilizáveis
/lib                 # Utilitários e clientes (Supabase, etc.)
/types               # Definições TypeScript
/utils               # Funções auxiliares e cálculos financeiros
```

## Licença

MIT
