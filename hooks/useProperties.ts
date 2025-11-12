'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Property, PropertyFormData } from '@/types'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProperties(data as Property[])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }

  const addProperty = async (propertyData: PropertyFormData): Promise<Property | null> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single()

      if (error) throw error

      await fetchProperties()
      return data as Property
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding property:', err)
      return null
    }
  }

  const updateProperty = async (id: string, updates: Partial<PropertyFormData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      await fetchProperties()
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating property:', err)
      return false
    }
  }

  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchProperties()
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting property:', err)
      return false
    }
  }

  const toggleFavorite = async (id: string, currentValue: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ isFavorite: !currentValue })
        .eq('id', id)

      if (error) throw error

      // Atualiza localmente para feedback imediato
      setProperties(prev => prev.map(p =>
        p.id === id ? { ...p, isFavorite: !currentValue } : p
      ))
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error toggling favorite:', err)
      return false
    }
  }

  const toggleVisited = async (id: string, currentValue: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ visited: !currentValue })
        .eq('id', id)

      if (error) throw error

      // Atualiza localmente para feedback imediato
      setProperties(prev => prev.map(p =>
        p.id === id ? { ...p, visited: !currentValue } : p
      ))
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error toggling visited:', err)
      return false
    }
  }

  const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*)')
        .eq('id', id)
        .single()

      if (error) throw error

      return data as Property
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching property:', err)
      return null
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleFavorite,
    toggleVisited,
    getPropertyById,
  }
}
