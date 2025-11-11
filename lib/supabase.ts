import { createClient } from '@supabase/supabase-js'

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
