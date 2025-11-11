-- ============================================
-- Schema do Banco de Dados - Plataforma Imobiliária
-- ============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: developers (Incorporadoras)
-- ============================================

CREATE TABLE IF NOT EXISTS public.developers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: properties (Imóveis)
-- ============================================

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID, -- Pode ser NULL se sem autenticação

  -- Dados básicos
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ready', 'under_construction')),
  developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  photo_url TEXT,

  -- Endereço (JSON)
  address JSONB NOT NULL,

  -- Características
  private_area DECIMAL(10,2) NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  suites INTEGER NOT NULL DEFAULT 0,
  parking_spots INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  floor INTEGER,
  year_built INTEGER,

  -- Custos mensais/anuais
  condo_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  iptu DECIMAL(10,2) NOT NULL DEFAULT 0,

  -- Extras
  amenities TEXT[] DEFAULT '{}',
  notes TEXT,

  -- Específico - Pronto
  ready_price DECIMAL(15,2),
  negotiation_notes TEXT,

  -- Específico - Na planta
  delivery_date DATE,
  construction_phase VARCHAR(50) CHECK (construction_phase IN ('launch', 'foundation', 'structure', 'finishing', 'delivered')),
  correction_index VARCHAR(50),
  price_per_sqm DECIMAL(10,2),
  payment_plan JSONB,

  -- Tags e status
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  visited BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para busca
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_developer_id ON public.properties(developer_id);
CREATE INDEX idx_properties_tags ON public.properties USING GIN(tags);

-- ============================================
-- TABELA: mortgage_scenarios (Cenários de Financiamento)
-- ============================================

CREATE TABLE IF NOT EXISTS public.mortgage_scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Inputs financeiros
  total_price DECIMAL(15,2) NOT NULL,
  down_payment DECIMAL(15,2) NOT NULL,
  down_payment_percent DECIMAL(5,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  cet DECIMAL(5,2),
  term INTEGER NOT NULL, -- meses
  amortization_type VARCHAR(10) NOT NULL CHECK (amortization_type IN ('price', 'sac')),

  -- Despesas iniciais
  itbi DECIMAL(15,2) NOT NULL DEFAULT 0,
  registry_fees DECIMAL(15,2) NOT NULL DEFAULT 0,
  appraisal_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
  bank_fees DECIMAL(15,2) NOT NULL DEFAULT 0,
  renovation_costs DECIMAL(15,2) NOT NULL DEFAULT 0,

  -- Renda
  monthly_income DECIMAL(15,2) NOT NULL,

  -- Outputs calculados
  initial_payment DECIMAL(15,2) NOT NULL,
  total_paid DECIMAL(15,2) NOT NULL,
  ltv DECIMAL(5,2) NOT NULL,
  payment_to_income_ratio DECIMAL(5,2) NOT NULL,
  monthly_housing_cost DECIMAL(15,2) NOT NULL,

  -- Análise
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  housing_score DECIMAL(5,2) NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_mortgage_scenarios_property_id ON public.mortgage_scenarios(property_id);

-- ============================================
-- TABELA: cashflow_projections (Projeções de Investimento)
-- ============================================

CREATE TABLE IF NOT EXISTS public.cashflow_projections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  scenario_id UUID NOT NULL,

  -- Inputs de aluguel
  monthly_rent DECIMAL(15,2) NOT NULL,
  vacancy_rate DECIMAL(5,2) NOT NULL,
  annual_rent_increase DECIMAL(5,2) NOT NULL,
  rent_increase_index VARCHAR(50) NOT NULL,

  -- Custos operacionais
  maintenance_percent DECIMAL(5,2) NOT NULL,
  insurance DECIMAL(15,2) NOT NULL DEFAULT 0,
  management_fee DECIMAL(5,2) NOT NULL DEFAULT 0,

  -- Financiamento
  mortgage_scenario_id UUID REFERENCES public.mortgage_scenarios(id) ON DELETE SET NULL,

  -- Taxas de compra/venda
  buyer_commission DECIMAL(5,2) NOT NULL DEFAULT 0,
  seller_commission DECIMAL(5,2) NOT NULL DEFAULT 0,
  capital_gains_tax DECIMAL(5,2) NOT NULL DEFAULT 0,

  -- Valorização
  annual_appreciation DECIMAL(5,2) NOT NULL,

  -- Métricas calculadas
  gross_cap_rate DECIMAL(5,2) NOT NULL,
  net_cap_rate DECIMAL(5,2) NOT NULL,
  cash_on_cash DECIMAL(5,2) NOT NULL,
  payback_years DECIMAL(5,2) NOT NULL,
  irr DECIMAL(5,2) NOT NULL,

  -- Score
  investment_score DECIMAL(5,2) NOT NULL,
  risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_cashflow_projections_property_id ON public.cashflow_projections(property_id);
CREATE INDEX idx_cashflow_projections_mortgage_scenario_id ON public.cashflow_projections(mortgage_scenario_id);

-- ============================================
-- TABELA: user_preferences (Preferências do Usuário)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID, -- Pode ser NULL se sem autenticação

  -- Taxas padrão
  default_interest_rate DECIMAL(5,2) NOT NULL DEFAULT 10.5,
  default_cet DECIMAL(5,2) NOT NULL DEFAULT 11.2,
  default_maintenance_percent DECIMAL(5,2) NOT NULL DEFAULT 5.0,
  default_vacancy_rate DECIMAL(5,2) NOT NULL DEFAULT 5.0,
  default_annual_appreciation DECIMAL(5,2) NOT NULL DEFAULT 5.0,
  default_rent_increase_index VARCHAR(50) NOT NULL DEFAULT 'IGPM',

  -- Pesos dos scores
  housing_weights JSONB NOT NULL DEFAULT '{"financialFitness": 0.4, "totalCost": 0.2, "condoIptu": 0.2, "qualitySubjective": 0.2}',
  investment_weights JSONB NOT NULL DEFAULT '{"netCapRate": 0.3, "irr": 0.3, "risk": 0.2, "liquidity": 0.1, "discount": 0.1}',

  -- Orçamento e renda
  monthly_budget DECIMAL(15,2) NOT NULL DEFAULT 0,
  monthly_income DECIMAL(15,2) NOT NULL DEFAULT 0,
  max_payment_to_income_ratio DECIMAL(5,2) NOT NULL DEFAULT 35.0,

  -- Impostos
  itbi_rate DECIMAL(5,2) NOT NULL DEFAULT 3.0,
  capital_gains_tax_rate DECIMAL(5,2) NOT NULL DEFAULT 15.0,

  -- Localização
  currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id)
);

-- ============================================
-- TABELA: comparisons (Comparações)
-- ============================================

CREATE TABLE IF NOT EXISTS public.comparisons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  name VARCHAR(255) NOT NULL,
  property_ids UUID[] NOT NULL,
  scenario_ids UUID[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_comparisons_user_id ON public.comparisons(user_id);

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mortgage_scenarios_updated_at BEFORE UPDATE ON public.mortgage_scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cashflow_projections_updated_at BEFORE UPDATE ON public.cashflow_projections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comparisons_updated_at BEFORE UPDATE ON public.comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) - Desabilitado por enquanto
-- Para habilitar quando adicionar autenticação
-- ============================================

-- ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.mortgage_scenarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.cashflow_projections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Dados iniciais - Preferências padrão
-- ============================================

INSERT INTO public.user_preferences (user_id)
VALUES (NULL)
ON CONFLICT (user_id) DO NOTHING;
