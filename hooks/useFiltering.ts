/**
 * useFiltering Hook
 * Provides search and filter functionality for lists
 */

'use client'

import { useMemo, useState } from 'react'

export interface FilterConfig<T> {
  searchFields: (keyof T)[]
  statusField?: keyof T
}

export function useFiltering<T>(data: T[], config: FilterConfig<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchQuery) {
        const matchesSearch = config.searchFields.some((field) => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase())
          }
          return false
        })

        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && config.statusField) {
        if (item[config.statusField] !== statusFilter) {
          return false
        }
      }

      return true
    })
  }, [data, searchQuery, statusFilter, config])

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
  }
}
