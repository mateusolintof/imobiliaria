// Enums e tipos básicos
export type PropertyType = 'ready' | 'under_construction'
export type AmortizationType = 'price' | 'sac'
export type ConstructionPhase = 'launch' | 'foundation' | 'structure' | 'finishing' | 'delivered'

// Developer (Incorporadora)
export interface Developer {
  id: string
  name: string
  rating?: number // 0-10
}

// Plano de pagamento (para imóvel na planta)
export interface PaymentPlan {
  downPayment?: number // Sinal
  installments?: {
    value?: number
    quantity?: number
    correctionIndex?: string // ex: 'INCC'
  }
  balanceAtDelivery?: number // Saldo nas chaves
  observations?: string
}

// Imóvel
export interface Property {
  id: string
  userId?: string

  // Comum
  name: string
  type: PropertyType
  developerId?: string
  developer?: Developer
  photoUrl?: string // Mantido para compatibilidade
  images?: string[] // Array de URLs de imagens
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    lat?: number
    lng?: number
  }

  // Características
  privateArea: number // m²
  bedrooms: number
  suites: number
  parkingSpots: number
  bathrooms: number
  floor?: number
  yearBuilt?: number

  // Custos mensais/anuais
  condoFee: number // R$/mês
  iptu: number // R$/ano

  // Extras
  amenities: string[] // ex: ['varanda gourmet', 'pet friendly', 'vista']
  notes?: string

  // Específico - Pronto
  readyPrice?: number
  negotiationNotes?: string

  // Específico - Na planta
  deliveryDate?: Date
  constructionPhase?: ConstructionPhase
  correctionIndex?: string // ex: 'INCC'
  pricePerSqm?: number
  paymentPlan?: PaymentPlan

  // Tags e status
  tags: string[] // ex: ['favorito', 'visitado', 'ofertado']
  isFavorite: boolean
  visited: boolean

  // Metadata
  createdAt: Date
  updatedAt: Date
}

// Cenário de financiamento
export interface MortgageScenario {
  id: string
  propertyId: string

  // Inputs financeiros
  totalPrice: number
  downPayment: number // Valor ou %
  downPaymentPercent: number
  interestRate: number // % a.a.
  cet?: number // Custo Efetivo Total
  term: number // meses
  amortizationType: AmortizationType

  // Despesas iniciais
  itbi: number
  registryFees: number
  appraisalFee: number
  bankFees: number
  renovationCosts: number

  // Renda do comprador
  monthlyIncome: number

  // Outputs calculados
  initialPayment: number // Primeira parcela
  totalPaid: number // Total pago no prazo
  ltv: number // Loan-to-Value
  paymentToIncomeRatio: number // Prestação/Renda
  monthlyHousingCost: number // Prestação + condomínio + IPTU/12 + seguros

  // Análise
  pros: string[]
  cons: string[]
  housingScore: number // 0-100

  createdAt: Date
  updatedAt: Date
}

// Projeção de fluxo de caixa (para investimento)
export interface CashflowProjection {
  id: string
  propertyId: string
  scenarioId: string

  // Inputs de aluguel
  monthlyRent: number
  vacancyRate: number // %
  annualRentIncrease: number // %
  rentIncreaseIndex: string // ex: 'IGPM'

  // Custos operacionais
  maintenancePercent: number // % do aluguel
  insurance: number // R$/mês
  managementFee: number // % do aluguel

  // Financiamento (se houver)
  mortgageScenarioId?: string

  // Taxas de compra/venda
  buyerCommission: number // %
  sellerCommission: number // %
  capitalGainsTax: number // %

  // Valorização
  annualAppreciation: number // %

  // Métricas calculadas
  grossCapRate: number // %
  netCapRate: number // %
  cashOnCash: number // %
  paybackYears: number
  irr: number // Taxa Interna de Retorno %

  // Score de investimento
  investmentScore: number // 0-100
  riskLevel: 'low' | 'medium' | 'high'

  createdAt: Date
  updatedAt: Date
}

// Item do portfólio (vínculo usuário-imóvel)
export interface PortfolioItem {
  id: string
  userId: string
  propertyId: string
  status: 'active' | 'archived' | 'sold'
  selectedForHousing: boolean
  selectedForInvestment: boolean
  notes?: string
  history: {
    date: Date
    field: string
    oldValue: any
    newValue: any
  }[]
  createdAt: Date
  updatedAt: Date
}

// Comparação
export interface Comparison {
  id: string
  userId: string
  name: string
  propertyIds: string[]
  scenarioIds?: string[] // Cenários específicos para cada imóvel
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Parâmetros do usuário
export interface UserPreferences {
  id: string
  userId?: string

  // Taxas padrão
  defaultInterestRate: number // % a.a.
  defaultCET: number // %
  defaultMaintenancePercent: number // %
  defaultVacancyRate: number // %
  defaultAnnualAppreciation: number // %
  defaultRentIncreaseIndex: string // ex: 'IGPM'

  // Pesos dos scores (Moradia)
  housingWeights: {
    financialFitness: number // 0-1
    totalCost: number
    condoIptu: number
    qualitySubjective: number
  }

  // Pesos dos scores (Investimento)
  investmentWeights: {
    netCapRate: number // 0-1
    irr: number
    risk: number
    liquidity: number
    discount: number
  }

  // Orçamento e renda
  monthlyBudget: number
  monthlyIncome: number
  maxPaymentToIncomeRatio: number // % (ex: 0.35 = 35%)

  // Preferências de impostos
  itbiRate: number // %
  capitalGainsTaxRate: number // %

  // Moeda e localização
  currency: string // 'BRL'
  timezone: string // 'America/Sao_Paulo'

  createdAt: Date
  updatedAt: Date
}

// Filtros (para Meus Imóveis)
export interface PropertyFilters {
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  minPricePerSqm?: number
  maxPricePerSqm?: number
  minArea?: number
  maxArea?: number
  minBedrooms?: number
  minSuites?: number
  minParkingSpots?: number
  neighborhoods?: string[]
  cities?: string[]
  maxCondoFee?: number
  maxIptu?: number
  tags?: string[]
  isFavorite?: boolean
  visited?: boolean
}

// Tipos auxiliares para formulários
export interface PropertyFormData extends Omit<Property, 'id' | 'createdAt' | 'updatedAt'> {}
export interface MortgageScenarioFormData extends Omit<MortgageScenario, 'id' | 'createdAt' | 'updatedAt'> {}
export interface CashflowProjectionFormData extends Omit<CashflowProjection, 'id' | 'createdAt' | 'updatedAt'> {}
