'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLowStockProducts, getExpiringProducts, getExpiredProducts } from '../../lib/api'

export default function AlertsPage() {
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [expiringProducts, setExpiringProducts] = useState([])
  const [expiredProducts, setExpiredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('low-stock')
  const [alertWindow, setAlertWindow] = useState(7)

  useEffect(() => {
    loadAlerts()
  }, [alertWindow])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const [lowStockRes, expiringRes, expiredRes] = await Promise.all([
        getLowStockProducts(),
        getExpiringProducts(alertWindow),
        getExpiredProducts(),
      ])

      setLowStockProducts(lowStockRes.data || [])
      setExpiringProducts(expiringRes.data || [])
      setExpiredProducts(expiredRes.data || [])
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    expiry.setHours(0, 0, 0, 0)
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-indigo-600"></div>
          <p className="mt-4 text-white font-medium">Loading alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 animate-slide-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Alerts</h1>
            <p className="text-white/80 text-lg">
              Monitor low stock and expiry alerts
            </p>
          </div>
          {activeTab === 'expiring' && (
            <div className="flex items-center space-x-3 glass px-4 py-2 rounded-xl shadow-lg">
              <label htmlFor="alertWindow" className="text-sm font-semibold text-gray-700">
                Alert Window:
              </label>
              <select
                id="alertWindow"
                value={alertWindow}
                onChange={(e) => setAlertWindow(parseInt(e.target.value))}
                className="border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 bg-white font-medium"
              >
                <option value={7}>7 days</option>
                <option value={15}>15 days</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-2 mb-6 shadow-xl">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('low-stock')}
            className={`${
              activeTab === 'low-stock'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            } flex-1 whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Low Stock ({lowStockProducts.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('expiring')}
            className={`${
              activeTab === 'expiring'
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            } flex-1 whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Expiring Soon ({expiringProducts.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`${
              activeTab === 'expired'
                ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            } flex-1 whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Expired ({expiredProducts.length})
            </span>
          </button>
        </nav>
      </div>

      {/* Low Stock Tab */}
      {activeTab === 'low-stock' && (
        <div>
          {lowStockProducts.length === 0 ? (
            <div className="glass shadow-xl rounded-2xl p-16 text-center animate-slide-up">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No low stock products</h3>
              <p className="text-gray-600">All products are above their minimum stock levels.</p>
            </div>
          ) : (
            <div className="glass shadow-xl overflow-hidden rounded-2xl animate-slide-up">
              <div className="divide-y divide-gray-200/50">
                {lowStockProducts.map((product, index) => (
                  <div key={product._id} className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 px-6 py-5 hover:from-yellow-100 hover:to-yellow-200/50 transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-red-600">
                          {product.quantity} / {product.minStock}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Shortage: <span className="font-semibold">{Math.max(0, product.minStock - product.quantity)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/products/${product._id}/edit`}
                        className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Update stock
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expiring Soon Tab */}
      {activeTab === 'expiring' && (
        <div>
          {expiringProducts.length === 0 ? (
            <div className="glass shadow-xl rounded-2xl p-16 text-center animate-slide-up">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products expiring soon</h3>
              <p className="text-gray-600">No products are expiring within the next {alertWindow} days.</p>
            </div>
          ) : (
            <div className="glass shadow-xl overflow-hidden rounded-2xl animate-slide-up">
              <div className="divide-y divide-gray-200/50">
                {expiringProducts.map((product, index) => {
                  const daysUntil = getDaysUntilExpiry(product.expiryDate)
                  return (
                    <div key={product._id} className="bg-gradient-to-r from-orange-50 to-orange-100/50 px-6 py-5 hover:from-orange-100 hover:to-orange-200/50 transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-orange-600">
                            {daysUntil !== null ? `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left` : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Expiry: {formatDate(product.expiryDate)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/products/${product._id}/edit`}
                          className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          View product
                          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expired Tab */}
      {activeTab === 'expired' && (
        <div>
          {expiredProducts.length === 0 ? (
            <div className="glass shadow-xl rounded-2xl p-16 text-center animate-slide-up">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No expired products</h3>
              <p className="text-gray-600">All products with expiry dates are still valid.</p>
            </div>
          ) : (
            <div className="glass shadow-xl overflow-hidden rounded-2xl animate-slide-up">
              <div className="divide-y divide-gray-200/50">
                {expiredProducts.map((product, index) => {
                  const daysSince = product.daysSinceExpiry || getDaysUntilExpiry(product.expiryDate)
                  return (
                    <div key={product._id} className="bg-gradient-to-r from-red-50 to-red-100/50 px-6 py-5 hover:from-red-100 hover:to-red-200/50 transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-red-600">
                            {daysSince !== null ? `Expired ${Math.abs(daysSince)} day${Math.abs(daysSince) !== 1 ? 's' : ''} ago` : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Expiry: {formatDate(product.expiryDate)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/products/${product._id}/edit`}
                          className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          View product
                          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

