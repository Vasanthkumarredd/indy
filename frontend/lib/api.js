import axios from 'axios'

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Product API functions
 */
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.lowStock) params.append('lowStock', 'true')
  if (filters.expiringSoon) params.append('expiringSoon', 'true')
  if (filters.expired) params.append('expired', 'true')

  const response = await api.get(`/products?${params.toString()}`)
  return response.data
}

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

/**
 * Alert API functions
 */
export const getLowStockProducts = async () => {
  const response = await api.get('/alerts/low-stock')
  return response.data
}

export const getExpiringProducts = async (days = 7) => {
  const response = await api.get(`/alerts/expiry?days=${days}`)
  return response.data
}

export const getExpiredProducts = async () => {
  const response = await api.get('/alerts/expired')
  return response.data
}

/**
 * Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const [productsRes, lowStockRes, expiringRes, expiredRes] = await Promise.all([
      api.get('/products'),
      api.get('/alerts/low-stock'),
      api.get('/alerts/expiry'),
      api.get('/alerts/expired'),
    ])

    return {
      totalProducts: productsRes.data.count || 0,
      lowStockCount: lowStockRes.data.count || 0,
      expiringSoonCount: expiringRes.data.count || 0,
      expiredCount: expiredRes.data.count || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

export default api

