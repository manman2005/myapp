"use client";

import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'

// Define types
export type Customer = {
  id: string
  name: string
  phone: string
  email: string
  address: string
  createdAt: string
  updatedAt: string
}

type State = {
  customers: Customer[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Customer[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }

const initialState: State = {
  customers: [],
  loading: false,
  error: null,
}

function customerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        customers: action.payload,
        error: null,
      }
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload],
      }
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      }
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter((customer) => customer.id !== action.payload),
      }
    default:
      return state
  }
}

export interface CustomerContextType {
  state: State
  fetchCustomers: () => Promise<void>
  getCustomer: (id: string) => Promise<Customer | null>
  createCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>
  deleteCustomer: (id: string) => Promise<boolean>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(customerReducer, initialState)
  const mounted = useRef(true)

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  const fetchCustomers = useCallback(async () => {
    if (!mounted.current) return

    try {
      dispatch({ type: 'FETCH_START' })
      const response = await fetch('/api/customers')
      
      if (!mounted.current) return
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      
      const data = await response.json()
      
      if (mounted.current) {
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      }
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        dispatch({ type: 'FETCH_ERROR', payload: message })
        toast.error(message)
      }
    }
  }, [])

  const getCustomer = useCallback(async (id: string): Promise<Customer | null> => {
    if (!mounted.current) return null

    try {
      dispatch({ type: 'FETCH_START' })
      const response = await fetch(`/api/customers/${id}`)
      
      if (!mounted.current) return null
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer')
      }
      
      const data = await response.json()
      
      if (mounted.current) {
        dispatch({ type: 'FETCH_SUCCESS', payload: [data] })
        return data
      }
      return null
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        dispatch({ type: 'FETCH_ERROR', payload: message })
        toast.error(message)
      }
      return null
    }
  }, [])

  const createCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!mounted.current) return false

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      })

      if (!mounted.current) return false

      if (!response.ok) {
        throw new Error('Failed to create customer')
      }

      const data = await response.json()
      
      if (mounted.current) {
        dispatch({ type: 'ADD_CUSTOMER', payload: data })
        toast.success('Customer created successfully')
        return true
      }
      return false
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        toast.error(message)
      }
      return false
    }
  }, [])

  const updateCustomer = useCallback(async (id: string, customer: Partial<Customer>): Promise<boolean> => {
    if (!mounted.current) return false

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      })

      if (!mounted.current) return false

      if (!response.ok) {
        throw new Error('Failed to update customer')
      }

      const data = await response.json()
      
      if (mounted.current) {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: data })
        toast.success('Customer updated successfully')
        return true
      }
      return false
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        toast.error(message)
      }
      return false
    }
  }, [])

  const deleteCustomer = useCallback(async (id: string): Promise<boolean> => {
    if (!mounted.current) return false

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })

      if (!mounted.current) return false

      if (!response.ok) {
        throw new Error('Failed to delete customer')
      }

      if (mounted.current) {
        dispatch({ type: 'DELETE_CUSTOMER', payload: id })
        toast.success('Customer deleted successfully')
        return true
      }
      return false
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        toast.error(message)
      }
      return false
    }
  }, [])

  const value = {
    state,
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export function useCustomer(): CustomerContextType {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }
  return context
} 