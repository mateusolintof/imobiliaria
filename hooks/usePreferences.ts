"use client"

import { useState, useEffect } from 'react'
import { supabase, mapDbRowToUserPreferences, mapUserPreferencesToDb } from '@/lib/supabase'
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
        setPreferences(mapDbRowToUserPreferences(data))
      } else {
        // Criar preferências padrão se não existirem
        const toInsert = mapUserPreferencesToDb(DEFAULT_PREFERENCES)
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert([toInsert])
          .select('*')
          .single()

        if (insertError) throw insertError
        setPreferences(mapDbRowToUserPreferences(newPrefs))
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching preferences:', err)
      // Mantém o estado anterior; evita criar ID inválido no cliente
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (updates: Partial<UserPreferences>): Promise<boolean> => {
    try {
      if (!preferences?.id) return false

      // Sanitizar: remover undefined/NaN
      const sanitized: Partial<UserPreferences> = {}
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined || v === null) continue
        if (typeof v === 'number' && Number.isNaN(v)) continue
        // @ts-expect-error index ok
        sanitized[k] = v
      }

      const dbUpdates = mapUserPreferencesToDb(sanitized)
      const { error } = await supabase
        .from('user_preferences')
        .update(dbUpdates)
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
