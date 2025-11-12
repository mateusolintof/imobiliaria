// Tipos para cálculos financeiros
export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalPaid: number
}

export interface FinancingSimulation {
  system: 'SAC' | 'PRICE'
  totalAmount: number
  downPayment: number
  financedAmount: number
  interestRate: number // taxa mensal em decimal (ex: 0.008 para 0.8%)
  months: number
  schedule: AmortizationRow[]
  totalInterest: number
  totalPaid: number
  firstPayment: number
  lastPayment: number
}

/**
 * Calcula financiamento usando Sistema de Amortização Constante (SAC)
 */
export function calculateSAC(
  totalAmount: number,
  downPayment: number,
  annualRate: number, // taxa anual em % (ex: 9.5)
  years: number
): FinancingSimulation {
  const financedAmount = totalAmount - downPayment
  const months = years * 12
  const monthlyRate = annualRate / 100 / 12 // converte para taxa mensal decimal

  const principalPayment = financedAmount / months
  const schedule: AmortizationRow[] = []
  let balance = financedAmount
  let totalPaid = downPayment

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    const payment = principalPayment + interest
    balance -= principalPayment
    totalPaid += payment

    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
      totalPaid,
    })
  }

  return {
    system: 'SAC',
    totalAmount,
    downPayment,
    financedAmount,
    interestRate: monthlyRate,
    months,
    schedule,
    totalInterest: totalPaid - downPayment - financedAmount,
    totalPaid,
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
  }
}

/**
 * Calcula financiamento usando Tabela PRICE
 */
export function calculatePRICE(
  totalAmount: number,
  downPayment: number,
  annualRate: number, // taxa anual em % (ex: 9.5)
  years: number
): FinancingSimulation {
  const financedAmount = totalAmount - downPayment
  const months = years * 12
  const monthlyRate = annualRate / 100 / 12 // converte para taxa mensal decimal

  // Fórmula da PRICE: P = PV * i * (1 + i)^n / ((1 + i)^n - 1)
  const payment =
    (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)

  const schedule: AmortizationRow[] = []
  let balance = financedAmount
  let totalPaid = downPayment

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    const principal = payment - interest
    balance -= principal
    totalPaid += payment

    schedule.push({
      month,
      payment,
      principal,
      interest,
      balance: Math.max(0, balance),
      totalPaid,
    })
  }

  return {
    system: 'PRICE',
    totalAmount,
    downPayment,
    financedAmount,
    interestRate: monthlyRate,
    months,
    schedule,
    totalInterest: totalPaid - downPayment - financedAmount,
    totalPaid,
    firstPayment: payment,
    lastPayment: payment,
  }
}

/**
 * Calcula a prestação máxima baseada na renda e percentual comprometido
 */
export function calculateMaxPayment(monthlyIncome: number, maxRatio: number): number {
  return monthlyIncome * (maxRatio / 100)
}

/**
 * Calcula o percentual da renda comprometido com a prestação
 */
export function calculatePaymentToIncomeRatio(payment: number, monthlyIncome: number): number {
  return (payment / monthlyIncome) * 100
}

/**
 * Calcula o CET (Custo Efetivo Total) aproximado
 */
export function calculateCET(
  financedAmount: number,
  totalPaid: number,
  months: number,
  additionalCosts: number = 0
): number {
  const totalCost = totalPaid + additionalCosts
  const monthlyRate = Math.pow(totalCost / financedAmount, 1 / months) - 1
  const annualRate = monthlyRate * 12 * 100
  return annualRate
}

/**
 * Calcula valor presente de uma série de pagamentos
 */
export function calculatePresentValue(
  payment: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) return payment * periods
  return payment * ((1 - Math.pow(1 + rate, -periods)) / rate)
}

/**
 * Calcula valor futuro de uma série de pagamentos
 */
export function calculateFutureValue(
  payment: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) return payment * periods
  return payment * ((Math.pow(1 + rate, periods) - 1) / rate)
}

// ============================================
// CÁLCULOS DE INVESTIMENTO
// ============================================

export interface InvestmentAnalysis {
  propertyPrice: number
  monthlyRent: number
  annualRent: number
  operatingExpenses: number
  netOperatingIncome: number
  capRate: number
  grossYield: number
  netYield: number
  breakEvenOccupancy: number
  cashOnCashReturn: number
  estimatedAppreciation: number
  totalReturn: number
}

export interface CashFlow {
  year: number
  rent: number
  expenses: number
  netIncome: number
  appreciation: number
  totalReturn: number
  cumulativeReturn: number
}

/**
 * Calcula o Cap Rate (Capitalization Rate)
 * Cap Rate = NOI / Property Value
 */
export function calculateCapRate(
  annualRent: number,
  annualExpenses: number,
  propertyPrice: number
): number {
  const noi = annualRent - annualExpenses
  return (noi / propertyPrice) * 100
}

/**
 * Calcula a rentabilidade bruta anual
 */
export function calculateGrossYield(monthlyRent: number, propertyPrice: number): number {
  const annualRent = monthlyRent * 12
  return (annualRent / propertyPrice) * 100
}

/**
 * Calcula a rentabilidade líquida anual
 */
export function calculateNetYield(
  monthlyRent: number,
  monthlyExpenses: number,
  propertyPrice: number
): number {
  const annualNetIncome = (monthlyRent - monthlyExpenses) * 12
  return (annualNetIncome / propertyPrice) * 100
}

/**
 * Calcula o Cash on Cash Return
 */
export function calculateCashOnCashReturn(
  annualCashFlow: number,
  initialInvestment: number
): number {
  return (annualCashFlow / initialInvestment) * 100
}

/**
 * Calcula análise completa de investimento
 */
export function calculateInvestmentAnalysis(
  propertyPrice: number,
  monthlyRent: number,
  condoFee: number,
  iptu: number,
  maintenancePercent: number,
  vacancyRate: number,
  appreciationRate: number,
  downPayment: number
): InvestmentAnalysis {
  const annualRent = monthlyRent * 12
  const monthlyMaintenance = monthlyRent * (maintenancePercent / 100)
  const monthlyVacancyLoss = monthlyRent * (vacancyRate / 100)

  const monthlyExpenses = condoFee + (iptu / 12) + monthlyMaintenance + monthlyVacancyLoss
  const annualExpenses = monthlyExpenses * 12

  const netMonthlyIncome = monthlyRent - monthlyExpenses
  const netAnnualIncome = netMonthlyIncome * 12

  const capRate = calculateCapRate(annualRent, annualExpenses, propertyPrice)
  const grossYield = calculateGrossYield(monthlyRent, propertyPrice)
  const netYield = calculateNetYield(monthlyRent, monthlyExpenses, propertyPrice)

  const breakEvenOccupancy = (monthlyExpenses / monthlyRent) * 100

  const cashOnCashReturn = calculateCashOnCashReturn(netAnnualIncome, downPayment)

  const estimatedAppreciation = propertyPrice * (appreciationRate / 100)
  const totalReturn = netAnnualIncome + estimatedAppreciation

  return {
    propertyPrice,
    monthlyRent,
    annualRent,
    operatingExpenses: annualExpenses,
    netOperatingIncome: netAnnualIncome,
    capRate,
    grossYield,
    netYield,
    breakEvenOccupancy,
    cashOnCashReturn,
    estimatedAppreciation,
    totalReturn,
  }
}

/**
 * Calcula projeção de fluxo de caixa
 */
export function calculateCashFlowProjection(
  propertyPrice: number,
  monthlyRent: number,
  monthlyExpenses: number,
  appreciationRate: number,
  rentIncreaseRate: number,
  years: number
): CashFlow[] {
  const projection: CashFlow[] = []
  let currentRent = monthlyRent
  let currentValue = propertyPrice
  let cumulativeReturn = 0

  for (let year = 1; year <= years; year++) {
    const annualRent = currentRent * 12
    const annualExpenses = monthlyExpenses * 12
    const netIncome = annualRent - annualExpenses

    const appreciation = currentValue * (appreciationRate / 100)
    currentValue += appreciation

    const totalReturn = netIncome + appreciation
    cumulativeReturn += totalReturn

    projection.push({
      year,
      rent: annualRent,
      expenses: annualExpenses,
      netIncome,
      appreciation,
      totalReturn,
      cumulativeReturn,
    })

    // Atualiza aluguel para próximo ano
    currentRent *= 1 + (rentIncreaseRate / 100)
  }

  return projection
}

/**
 * Calcula payback period (tempo para recuperar investimento)
 */
export function calculatePaybackPeriod(
  initialInvestment: number,
  annualCashFlow: number
): number {
  if (annualCashFlow <= 0) return Infinity
  return initialInvestment / annualCashFlow
}

/**
 * Calcula TIR (Taxa Interna de Retorno) usando método de Newton-Raphson
 * Simplificado para fluxos de caixa regulares
 */
export function calculateIRR(
  initialInvestment: number,
  cashFlows: number[],
  iterations: number = 100
): number {
  let irr = 0.1 // chute inicial de 10%

  for (let i = 0; i < iterations; i++) {
    let npv = -initialInvestment
    let derivative = 0

    cashFlows.forEach((cf, period) => {
      const p = period + 1
      npv += cf / Math.pow(1 + irr, p)
      derivative -= (p * cf) / Math.pow(1 + irr, p + 1)
    })

    if (Math.abs(npv) < 0.01) break

    irr = irr - npv / derivative
  }

  return irr * 100 // retorna em percentual
}

/**
 * Calcula ROI (Return on Investment)
 */
export function calculateROI(
  totalGain: number,
  initialInvestment: number
): number {
  return ((totalGain - initialInvestment) / initialInvestment) * 100
}
