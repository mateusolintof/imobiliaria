/**
 * Cálculos financeiros para análise imobiliária
 */

// ============ FINANCIAMENTO ============

/**
 * Calcula a prestação usando Sistema Price (parcelas iguais)
 * PMT = P * i * (1 + i)^n / [(1 + i)^n - 1]
 */
export function calculatePricePayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / termMonths

  const factor = Math.pow(1 + monthlyRate, termMonths)
  const payment = principal * monthlyRate * factor / (factor - 1)

  return payment
}

/**
 * Gera tabela de amortização Price
 */
export function generatePriceAmortizationTable(
  principal: number,
  annualRate: number,
  termMonths: number
): Array<{
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}> {
  const monthlyRate = annualRate / 100 / 12
  const payment = calculatePricePayment(principal, annualRate, termMonths)

  const table = []
  let balance = principal

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const principalPayment = payment - interest
    balance -= principalPayment

    table.push({
      month,
      payment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    })
  }

  return table
}

/**
 * Calcula a prestação inicial do Sistema SAC (amortização constante)
 */
export function calculateSACInitialPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const amortization = principal / termMonths
  const firstInterest = principal * monthlyRate

  return amortization + firstInterest
}

/**
 * Gera tabela de amortização SAC
 */
export function generateSACAmortizationTable(
  principal: number,
  annualRate: number,
  termMonths: number
): Array<{
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}> {
  const monthlyRate = annualRate / 100 / 12
  const amortization = principal / termMonths

  const table = []
  let balance = principal

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const payment = amortization + interest
    balance -= amortization

    table.push({
      month,
      payment,
      principal: amortization,
      interest,
      balance: Math.max(0, balance),
    })
  }

  return table
}

/**
 * Calcula o total pago ao longo do financiamento
 */
export function calculateTotalPaid(
  principal: number,
  annualRate: number,
  termMonths: number,
  type: 'price' | 'sac'
): number {
  if (type === 'price') {
    const payment = calculatePricePayment(principal, annualRate, termMonths)
    return payment * termMonths
  } else {
    const table = generateSACAmortizationTable(principal, annualRate, termMonths)
    return table.reduce((sum, row) => sum + row.payment, 0)
  }
}

/**
 * Calcula LTV (Loan-to-Value) - razão entre financiamento e valor do imóvel
 */
export function calculateLTV(loanAmount: number, propertyValue: number): number {
  return (loanAmount / propertyValue) * 100
}

/**
 * Calcula razão prestação/renda
 */
export function calculatePaymentToIncomeRatio(
  monthlyPayment: number,
  monthlyIncome: number
): number {
  return (monthlyPayment / monthlyIncome) * 100
}

// ============ INVESTIMENTO ============

/**
 * Calcula Cap Rate Bruto
 * Cap Rate = (Aluguel Anual / Preço de Compra) * 100
 */
export function calculateGrossCapRate(
  monthlyRent: number,
  purchasePrice: number
): number {
  const annualRent = monthlyRent * 12
  return (annualRent / purchasePrice) * 100
}

/**
 * Calcula Cap Rate Líquido
 * Cap Rate Líquido = ((Aluguel Anual - Custos) / Preço de Compra) * 100
 */
export function calculateNetCapRate(
  monthlyRent: number,
  purchasePrice: number,
  monthlyCondoFee: number,
  annualIPTU: number,
  monthlyMaintenance: number,
  monthlyInsurance: number
): number {
  const annualRent = monthlyRent * 12
  const annualCosts =
    (monthlyCondoFee * 12) +
    annualIPTU +
    (monthlyMaintenance * 12) +
    (monthlyInsurance * 12)

  const netAnnualIncome = annualRent - annualCosts
  return (netAnnualIncome / purchasePrice) * 100
}

/**
 * Calcula Cash-on-Cash Return
 * CoC = (Fluxo de Caixa Anual / Capital Próprio Investido) * 100
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  totalInvested: number
): number {
  return (annualCashFlow / totalInvested) * 100
}

/**
 * Calcula Payback simples em anos
 */
export function calculatePayback(
  totalInvested: number,
  annualCashFlow: number
): number {
  if (annualCashFlow <= 0) return Infinity
  return totalInvested / annualCashFlow
}

/**
 * Calcula TIR/IRR (Taxa Interna de Retorno) usando aproximação de Newton-Raphson
 * Fluxos: array de valores [investimento inicial negativo, fluxo1, fluxo2, ..., fluxo final + venda]
 */
export function calculateIRR(cashFlows: number[]): number {
  const maxIterations = 100
  const tolerance = 0.00001
  let rate = 0.1 // Taxa inicial de 10%

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0
    let dnpv = 0

    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j)
      dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1)
    }

    const newRate = rate - npv / dnpv

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100 // Retorna em %
    }

    rate = newRate
  }

  return rate * 100
}

/**
 * Gera projeção de fluxo de caixa para investimento
 */
export function generateInvestmentCashFlow(params: {
  purchasePrice: number
  downPayment: number
  monthlyRent: number
  vacancyRate: number
  monthlyCondoFee: number
  annualIPTU: number
  maintenancePercent: number
  monthlyInsurance: number
  managementFeePercent: number
  annualRentIncrease: number
  annualAppreciation: number
  mortgagePayment: number
  years: number
}): {
  year: number
  rent: number
  expenses: number
  mortgagePayment: number
  netCashFlow: number
  propertyValue: number
}[] {
  const {
    purchasePrice,
    monthlyRent: initialRent,
    vacancyRate,
    monthlyCondoFee,
    annualIPTU,
    maintenancePercent,
    monthlyInsurance,
    managementFeePercent,
    annualRentIncrease,
    annualAppreciation,
    mortgagePayment,
    years,
  } = params

  const projection = []
  let rent = initialRent
  let propertyValue = purchasePrice

  for (let year = 1; year <= years; year++) {
    // Aluguel com vacância
    const effectiveRent = rent * (1 - vacancyRate / 100) * 12

    // Despesas anuais
    const maintenance = rent * 12 * (maintenancePercent / 100)
    const managementFee = rent * 12 * (managementFeePercent / 100)
    const totalExpenses =
      (monthlyCondoFee * 12) +
      annualIPTU +
      maintenance +
      (monthlyInsurance * 12) +
      managementFee

    // Fluxo de caixa líquido
    const netCashFlow = effectiveRent - totalExpenses - (mortgagePayment * 12)

    projection.push({
      year,
      rent: effectiveRent,
      expenses: totalExpenses,
      mortgagePayment: mortgagePayment * 12,
      netCashFlow,
      propertyValue,
    })

    // Atualizar valores para próximo ano
    rent *= (1 + annualRentIncrease / 100)
    propertyValue *= (1 + annualAppreciation / 100)
  }

  return projection
}

// ============ SCORES ============

/**
 * Calcula score de adequação para moradia (0-100)
 */
export function calculateHousingScore(params: {
  paymentToIncomeRatio: number
  totalCostVsBudget: number
  condoFeeRank: number // 0-1 (0 = muito alto, 1 = muito baixo)
  qualityScore: number // 0-1 baseado em tags positivas/negativas
  weights: {
    financialFitness: number
    totalCost: number
    condoIptu: number
    qualitySubjective: number
  }
}): number {
  const { paymentToIncomeRatio, totalCostVsBudget, condoFeeRank, qualityScore, weights } = params

  // Normalizar paymentToIncomeRatio (ideal < 30%, aceitável até 35%)
  const financialFitness = Math.max(0, 1 - (paymentToIncomeRatio / 35))

  // Normalizar custo total vs orçamento (ideal = 1.0 ou menos)
  const costFitness = Math.max(0, 2 - totalCostVsBudget)

  const score =
    (financialFitness * weights.financialFitness +
    costFitness * weights.totalCost +
    condoFeeRank * weights.condoIptu +
    qualityScore * weights.qualitySubjective) * 100

  return Math.min(100, Math.max(0, score))
}

/**
 * Calcula score de investimento (0-100)
 */
export function calculateInvestmentScore(params: {
  netCapRate: number
  irr: number
  riskScore: number // 0-1 (0 = alto risco, 1 = baixo risco)
  liquidityScore: number // 0-1 (0 = baixa liquidez, 1 = alta liquidez)
  discountScore: number // 0-1 (0 = sem desconto, 1 = grande desconto)
  weights: {
    netCapRate: number
    irr: number
    risk: number
    liquidity: number
    discount: number
  }
}): number {
  const { netCapRate, irr, riskScore, liquidityScore, discountScore, weights } = params

  // Normalizar Cap Rate (bom: > 6%, ótimo: > 8%)
  const capRateNorm = Math.min(1, netCapRate / 8)

  // Normalizar IRR (bom: > 10%, ótimo: > 15%)
  const irrNorm = Math.min(1, irr / 15)

  const score =
    (capRateNorm * weights.netCapRate +
    irrNorm * weights.irr +
    riskScore * weights.risk +
    liquidityScore * weights.liquidity +
    discountScore * weights.discount) * 100

  return Math.min(100, Math.max(0, score))
}
