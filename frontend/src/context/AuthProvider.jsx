import { useState, useCallback } from 'react'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null
    } catch {
      return null
    }
  })

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  // Start with loading as false because we retrieved token/user synchronously
  const [isLoading] = useState(false)

  const isAuthenticated = !!token && !!user

  const login = useCallback(async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password })
      const { token: newToken, user: newUser } = res.data.data
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      toast.success('Logged in successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
      return { success: false, message }
    }
  }, [])

  const signup = useCallback(async (name, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/signup', { name, email, password })
      const { token: newToken, user: newUser } = res.data.data
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      return { success: false, message }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully.')
  }, [])

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
