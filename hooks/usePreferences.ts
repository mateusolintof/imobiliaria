'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserPreferences } from '@/types'

const DEFAULT_PREFERENCES: Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt'> = {
  userId: undefined,
  defaultInterestRate: 10.5,
  defaultCET: 11.2,
  defaultMaintenancePercent: 5.0,
  defaultVacancyRate: 5.0,
  defaultAnnualAppreciation: 5.0,
  defaultRentIncreaseIndex: 'IGPM',
  housingWeights: {
    financialFitness: 0.4,
    totalCost: 0.2,
    condoIptu: 0.2,
    qualitySubjective: 0.2,
  },
  investmentWeights: {
    netCapRate: 0.3,
    irr: 0.3,
    risk: 0.2,
    liquidity: 0.1,
    discount: 0.1,
  },
  monthlyBudget: 0,
  monthlyIncome: 0,
  maxPaymentToIncomeRatio: 35.0,
  itbiRate: 3.0,
  capitalGainsTaxRate: 15.0,
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .is('user_id', null)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error
      }

      if (data) {
        setPreferences(data as UserPreferences)
      } else {
        // Criar preferências padrão se não existirem
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert([DEFAULT_PREFERENCES])
          .select()
          .single()

        if (insertError) throw insertError
        setPreferences(newPrefs as UserPreferences)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching preferences:', err)
      // Use defaults in memory if DB fails
      setPreferences({
        id: 'temp',
        ...DEFAULT_PREFERENCES,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserPreferences)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (updates: Partial<UserPreferences>): Promise<boolean> => {
    try {
      if (!preferences?.id) return false

      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('id', preferences.id)

      if (error) throw error

      await fetchPreferences()
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating preferences:', err)
      return false
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    fetchPreferences,
  }
}
