/**
 * Funções auxiliares para formatação e validação
 */

import { format, parseISO, addMonths } from 'date-fns'

// ============ FORMATAÇÃO ============

/**
 * Formata valor em Real Brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata percentual
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formata número com separadores de milhar
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formata data no padrão brasileiro
 */
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

/**
 * Formata metragem
 */
export function formatArea(area: number): string {
  return `${formatNumber(area, 2)} m²`
}

// ============ VALIDAÇÃO ============

/**
 * Valida CPF (formato brasileiro)
 */
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '')

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

/**
 * Valida CEP (formato brasileiro)
 */
export function validateCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

/**
 * Formata CEP
 */
export function formatCEP(cep: string): string {
  cep = cep.replace(/\D/g, '')
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ============ ANÁLISE ============

/**
 * Determina prós e contras automaticamente para moradia
 */
export function generateHousingProsAndCons(params: {
  pricePerSqm: number
  medianPricePerSqm: number
  condoFee: number
  medianCondoFee: number
  paymentToIncomeRatio: number
  totalCostVsBudget: number
  tags: string[]
}): { pros: string[]; cons: string[] } {
  const {
    pricePerSqm,
    medianPricePerSqm,
    condoFee,
    medianCondoFee,
    paymentToIncomeRatio,
    totalCostVsBudget,
    tags,
  } = params

  const pros: string[] = []
  const cons: string[] = []

  // Preço/m²
  if (pricePerSqm < medianPricePerSqm * 0.9) {
    pros.push('Preço/m² abaixo da mediana da região')
  } else if (pricePerSqm > medianPricePerSqm * 1.1) {
    cons.push('Preço/m² acima da mediana da região')
  }

  // Condomínio
  if (condoFee < medianCondoFee * 0.8) {
    pros.push('Condomínio baixo comparado à região')
  } else if (condoFee > medianCondoFee * 1.2) {
    cons.push('Condomínio alto comparado à região')
  }

  // Razão prestação/renda
  if (paymentToIncomeRatio > 35) {
    cons.push('Prestação compromete mais de 35% da renda')
  } else if (paymentToIncomeRatio < 25) {
    pros.push('Prestação confortável em relação à renda')
  }

  // Custo total vs orçamento
  if (totalCostVsBudget > 1.2) {
    cons.push('Custo total acima do orçamento planejado')
  }

  // Tags positivas
  const positiveTags = ['próximo a transporte', 'boa luminosidade', 'segurança', 'vista', 'varanda']
  positiveTags.forEach(tag => {
    if (tags.some(t => t.toLowerCase().includes(tag))) {
      pros.push(tag.charAt(0).toUpperCase() + tag.slice(1))
    }
  })

  // Tags negativas
  const negativeTags = ['barulho', 'risco de atraso', 'vacância de serviços']
  negativeTags.forEach(tag => {
    if (tags.some(t => t.toLowerCase().includes(tag))) {
      cons.push(tag.charAt(0).toUpperCase() + tag.slice(1))
    }
  })

  return { pros, cons }
}

/**
 * Determina nível de risco de investimento
 */
export function assessInvestmentRisk(params: {
  constructionPhase?: string
  developerRating?: number
  netCapRate: number
  vacancyRate: number
  neighborhood: string
}): 'low' | 'medium' | 'high' {
  const { constructionPhase, developerRating, netCapRate, vacancyRate } = params

  let riskPoints = 0

  // Fase da obra (se na planta)
  if (constructionPhase) {
    if (['launch', 'foundation'].includes(constructionPhase)) {
      riskPoints += 2
    } else if (constructionPhase === 'structure') {
      riskPoints += 1
    }
  }

  // Rating da incorporadora
  if (developerRating !== undefined) {
    if (developerRating < 5) riskPoints += 2
    else if (developerRating < 7) riskPoints += 1
  }

  // Cap Rate
  if (netCapRate < 4) riskPoints += 2
  else if (netCapRate < 6) riskPoints += 1

  // Vacância
  if (vacancyRate > 10) riskPoints += 2
  else if (vacancyRate > 5) riskPoints += 1

  // Classificação final
  if (riskPoints >= 5) return 'high'
  if (riskPoints >= 3) return 'medium'
  return 'low'
}

/**
 * Calcula score de qualidade subjetiva baseado em tags
 */
export function calculateQualityScore(tags: string[]): number {
  const positiveTags = [
    'favorito', 'próximo a transporte', 'boa luminosidade', 'segurança',
    'vista', 'varanda', 'lazer completo', 'novo', 'bem conservado'
  ]
  const negativeTags = [
    'barulho', 'risco de atraso', 'vacância de serviços', 'antigo',
    'precisa reforma', 'má conservação'
  ]

  let score = 0.5 // Neutro

  tags.forEach(tag => {
    const tagLower = tag.toLowerCase()
    if (positiveTags.some(pt => tagLower.includes(pt))) score += 0.1
    if (negativeTags.some(nt => tagLower.includes(nt))) score -= 0.1
  })

  return Math.min(1, Math.max(0, score))
}

/**
 * Gera cronograma de pagamento para imóvel na planta
 */
export function generatePaymentSchedule(params: {
  downPayment: number
  installmentValue: number
  installmentCount: number
  balanceAtDelivery: number
  deliveryDate: Date
  correctionIndex: string
}): Array<{
  dueDate: Date
  description: string
  value: number
  corrected: boolean
}> {
  const { downPayment, installmentValue, installmentCount, balanceAtDelivery, deliveryDate } = params

  const schedule = []

  // Sinal
  schedule.push({
    dueDate: new Date(),
    description: 'Sinal',
    value: downPayment,
    corrected: false,
  })

  // Parcelas até a entrega
  for (let i = 1; i <= installmentCount; i++) {
    schedule.push({
      dueDate: addMonths(new Date(), i),
      description: `Parcela ${i}/${installmentCount}`,
      value: installmentValue,
      corrected: true,
    })
  }

  // Saldo nas chaves
  schedule.push({
    dueDate: deliveryDate,
    description: 'Saldo nas chaves',
    value: balanceAtDelivery,
    corrected: false,
  })

  return schedule
}

// ============ COMPARAÇÃO ============

/**
 * Compara dois valores e retorna indicador visual
 */
export function compareValues(
  value1: number,
  value2: number,
  higherIsBetter: boolean = true
): 'better' | 'worse' | 'equal' {
  const threshold = 0.01 // 1% de diferença
  const diff = Math.abs(value1 - value2) / value2

  if (diff < threshold) return 'equal'

  if (higherIsBetter) {
    return value1 > value2 ? 'better' : 'worse'
  } else {
    return value1 < value2 ? 'better' : 'worse'
  }
}

/**
 * Normaliza um valor para escala 0-1 com base em min e max
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5
  return Math.min(1, Math.max(0, (value - min) / (max - min)))
}
