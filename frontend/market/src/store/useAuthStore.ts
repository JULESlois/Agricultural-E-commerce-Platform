import { create } from 'zustand'
import { authAPI } from '@/api'

interface User {
  user_id: number
  user_name: string
  user_type: number
  avatar?: string
  real_name?: string
  phone?: string
  email?: string
  cert_status?: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: { login_identifier: string; password: string }) => Promise<void>
  logout: () => void
  fetchUserInfo: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (credentials) => {
    const response: any = await authAPI.login(credentials)
    const { token, user_info } = response.data
    localStorage.setItem('token', token)
    set({ token, user: user_info, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isAuthenticated: false })
  },

  fetchUserInfo: async () => {
    try {
      const response: any = await authAPI.getUserInfo()
      set({ user: response.data })
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  },
}))
