import { createClient } from '@supabase/supabase-js'
import type { Property, UserPreferences } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please configure .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          user_id: string | null
          name: string
          type: 'ready' | 'under_construction'
          developer_id: string | null
          photo_url: string | null
          address: any // JSON
          private_area: number
          bedrooms: number
          suites: number
          parking_spots: number
          bathrooms: number
          floor: number | null
          year_built: number | null
          condo_fee: number
          iptu: number
          amenities: string[]
          notes: string | null
          ready_price: number | null
          negotiation_notes: string | null
          delivery_date: string | null
          construction_phase: string | null
          correction_index: string | null
          price_per_sqm: number | null
          payment_plan: any | null // JSON
          tags: string[]
          is_favorite: boolean
          visited: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      developers: {
        Row: {
          id: string
          name: string
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['developers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['developers']['Insert']>
      }
      mortgage_scenarios: {
        Row: {
          id: string
          property_id: string
          total_price: number
          down_payment: number
          down_payment_percent: number
          interest_rate: number
          cet: number | null
          term: number
          amortization_type: 'price' | 'sac'
          itbi: number
          registry_fees: number
          appraisal_fee: number
          bank_fees: number
          renovation_costs: number
          monthly_income: number
          initial_payment: number
          total_paid: number
          ltv: number
          payment_to_income_ratio: number
          monthly_housing_cost: number
          pros: string[]
          cons: string[]
          housing_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['mortgage_scenarios']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['mortgage_scenarios']['Insert']>
      }
      cashflow_projections: {
        Row: {
          id: string
          property_id: string
          scenario_id: string
          monthly_rent: number
          vacancy_rate: number
          annual_rent_increase: number
          rent_increase_index: string
          maintenance_percent: number
          insurance: number
          management_fee: number
          mortgage_scenario_id: string | null
          buyer_commission: number
          seller_commission: number
          capital_gains_tax: number
          annual_appreciation: number
          gross_cap_rate: number
          net_cap_rate: number
          cash_on_cash: number
          payback_years: number
          irr: number
          investment_score: number
          risk_level: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cashflow_projections']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cashflow_projections']['Insert']>
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string | null
          default_interest_rate: number
          default_cet: number
          default_maintenance_percent: number
          default_vacancy_rate: number
          default_annual_appreciation: number
          default_rent_increase_index: string
          housing_weights: any // JSON
          investment_weights: any // JSON
          monthly_budget: number
          monthly_income: number
          max_payment_to_income_ratio: number
          itbi_rate: number
          capital_gains_tax_rate: number
          currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_preferences']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>
      }
    }
  }
}

// Helper to map DB row (snake_case) to app Property (camelCase)
export function mapDbRowToProperty(row: Database['public']['Tables']['properties']['Row']): Property {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    name: row.name,
    type: row.type,
    developerId: row.developer_id || undefined,
    // Developer object can be fetched with a join later; keep undefined for now
    developer: undefined,
    photoUrl: row.photo_url || undefined,
    // Images are stored in Supabase Storage; not persisted as a column by default
    images: [],
    address: row.address as any,
    privateArea: Number(row.private_area || 0),
    bedrooms: Number(row.bedrooms || 0),
    suites: Number(row.suites || 0),
    parkingSpots: Number(row.parking_spots || 0),
    bathrooms: Number(row.bathrooms || 0),
    floor: row.floor === null ? undefined : Number(row.floor),
    yearBuilt: row.year_built === null ? undefined : Number(row.year_built),
    condoFee: Number(row.condo_fee || 0),
    iptu: Number(row.iptu || 0),
    amenities: row.amenities || [],
    notes: row.notes || undefined,
    readyPrice: row.ready_price === null ? undefined : Number(row.ready_price),
    negotiationNotes: row.negotiation_notes || undefined,
    deliveryDate: row.delivery_date ? new Date(row.delivery_date) : undefined,
    constructionPhase: (row.construction_phase as any) || undefined,
    correctionIndex: row.correction_index || undefined,
    pricePerSqm: row.price_per_sqm === null ? undefined : Number(row.price_per_sqm),
    paymentPlan: (row.payment_plan as any) || undefined,
    tags: row.tags || [],
    isFavorite: Boolean(row.is_favorite),
    visited: Boolean(row.visited),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function getProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase getProperties error:', error)
      return []
    }

    if (!data) return []

    // Map DB rows to app Property shape
    return data.map(mapDbRowToProperty)
  } catch (err) {
    console.error('Unexpected error in getProperties:', err)
    return []
  }
}

// Maps camelCase Property shape to DB snake_case shape for insert/update
export function mapPropertyToDb(
  input: Partial<Property>
): Partial<Database['public']['Tables']['properties']['Row']> {
  // Only include keys that exist in DB and are defined
  const out: any = {}

  if (input.userId !== undefined) out.user_id = input.userId || null
  if (input.name !== undefined) out.name = input.name
  if (input.type !== undefined) out.type = input.type as any
  if (input.developerId !== undefined) out.developer_id = input.developerId || null
  if (input.photoUrl !== undefined) out.photo_url = input.photoUrl || null
  if (input.address !== undefined) out.address = input.address as any
  if (input.privateArea !== undefined) out.private_area = input.privateArea
  if (input.bedrooms !== undefined) out.bedrooms = input.bedrooms
  if (input.suites !== undefined) out.suites = input.suites
  if (input.parkingSpots !== undefined) out.parking_spots = input.parkingSpots
  if (input.bathrooms !== undefined) out.bathrooms = input.bathrooms
  if (input.floor !== undefined) out.floor = input.floor ?? null
  if (input.yearBuilt !== undefined) out.year_built = input.yearBuilt ?? null
  if (input.condoFee !== undefined) out.condo_fee = input.condoFee
  if (input.iptu !== undefined) out.iptu = input.iptu
  if (input.amenities !== undefined) out.amenities = input.amenities
  if (input.notes !== undefined) out.notes = input.notes ?? null
  if (input.readyPrice !== undefined) out.ready_price = input.readyPrice ?? null
  if (input.negotiationNotes !== undefined) out.negotiation_notes = input.negotiationNotes ?? null
  if (input.deliveryDate !== undefined) {
    // DB column is DATE; format to YYYY-MM-DD if Date provided
    const d = input.deliveryDate
    out.delivery_date = d ? (d instanceof Date ? d.toISOString().slice(0, 10) : (d as any)) : null
  }
  if (input.constructionPhase !== undefined) out.construction_phase = input.constructionPhase as any
  if (input.correctionIndex !== undefined) out.correction_index = input.correctionIndex ?? null
  if (input.pricePerSqm !== undefined) out.price_per_sqm = input.pricePerSqm ?? null
  if (input.paymentPlan !== undefined) out.payment_plan = input.paymentPlan as any
  if (input.tags !== undefined) out.tags = input.tags
  if (input.isFavorite !== undefined) out.is_favorite = input.isFavorite
  if (input.visited !== undefined) out.visited = input.visited

  return out
}

// ---- User Preferences mappers ----
export function mapDbRowToUserPreferences(
  row: Database['public']['Tables']['user_preferences']['Row']
): UserPreferences {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    defaultInterestRate: Number(row.default_interest_rate),
    defaultCET: Number(row.default_cet),
    defaultMaintenancePercent: Number(row.default_maintenance_percent),
    defaultVacancyRate: Number(row.default_vacancy_rate),
    defaultAnnualAppreciation: Number(row.default_annual_appreciation),
    defaultRentIncreaseIndex: row.default_rent_increase_index,
    housingWeights: row.housing_weights as any,
    investmentWeights: row.investment_weights as any,
    monthlyBudget: Number(row.monthly_budget),
    monthlyIncome: Number(row.monthly_income),
    maxPaymentToIncomeRatio: Number(row.max_payment_to_income_ratio),
    itbiRate: Number(row.itbi_rate),
    capitalGainsTaxRate: Number(row.capital_gains_tax_rate),
    currency: row.currency,
    timezone: row.timezone,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export function mapUserPreferencesToDb(
  input: Partial<UserPreferences>
): Partial<Database['public']['Tables']['user_preferences']['Row']> {
  const out: any = {}

  if (input.userId !== undefined) out.user_id = input.userId || null
  if (input.defaultInterestRate !== undefined && !Number.isNaN(input.defaultInterestRate)) out.default_interest_rate = input.defaultInterestRate
  if (input.defaultCET !== undefined && !Number.isNaN(input.defaultCET)) out.default_cet = input.defaultCET
  if (input.defaultMaintenancePercent !== undefined && !Number.isNaN(input.defaultMaintenancePercent)) out.default_maintenance_percent = input.defaultMaintenancePercent
  if (input.defaultVacancyRate !== undefined && !Number.isNaN(input.defaultVacancyRate)) out.default_vacancy_rate = input.defaultVacancyRate
  if (input.defaultAnnualAppreciation !== undefined && !Number.isNaN(input.defaultAnnualAppreciation)) out.default_annual_appreciation = input.defaultAnnualAppreciation
  if (input.defaultRentIncreaseIndex !== undefined) out.default_rent_increase_index = input.defaultRentIncreaseIndex
  if (input.housingWeights !== undefined) out.housing_weights = input.housingWeights as any
  if (input.investmentWeights !== undefined) out.investment_weights = input.investmentWeights as any
  if (input.monthlyBudget !== undefined && !Number.isNaN(input.monthlyBudget)) out.monthly_budget = input.monthlyBudget
  if (input.monthlyIncome !== undefined && !Number.isNaN(input.monthlyIncome)) out.monthly_income = input.monthlyIncome
  if (input.maxPaymentToIncomeRatio !== undefined && !Number.isNaN(input.maxPaymentToIncomeRatio)) out.max_payment_to_income_ratio = input.maxPaymentToIncomeRatio
  if (input.itbiRate !== undefined && !Number.isNaN(input.itbiRate)) out.itbi_rate = input.itbiRate
  if (input.capitalGainsTaxRate !== undefined && !Number.isNaN(input.capitalGainsTaxRate)) out.capital_gains_tax_rate = input.capitalGainsTaxRate
  if (input.currency !== undefined) out.currency = input.currency
  if (input.timezone !== undefined) out.timezone = input.timezone

  return out
}
