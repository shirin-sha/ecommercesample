'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => boolean
}

// Default admin credentials (in production, use environment variables)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@shophub.com'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call - in production, call your auth API
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const user: AdminUser = {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Admin User',
            role: 'admin',
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: (): boolean => {
        const state = useAuthStore.getState()
        return state.isAuthenticated && state.user !== null
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
)

