'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProducts, deleteProduct } from '../../lib/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts()
      setProducts(response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load products. Please check if the backend is running.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await deleteProduct(id)
      loadProducts() // Reload products after deletion
    } catch (err) {
      alert('Failed to delete product. Please try again.')
      console.error('Error deleting product:', err)
    }
  }

  const getStatusBadge = (product) => {
    if (product.isLowStock) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Low Stock
        </span>
      )
    }

    if (product.expiryDate) {
      const expiry = new Date(product.expiryDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      expiry.setHours(0, 0, 0, 0)
      const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))

      if (daysUntilExpiry < 0) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Expired
          </span>
        )
      } else if (daysUntilExpiry <= 7) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Expiring Soon
          </span>
        )
      } else if (daysUntilExpiry <= 15) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-300 to-orange-400 text-white shadow-md">
            Expiring in {daysUntilExpiry} days
          </span>
        )
      }
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        In Stock
      </span>
    )
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-indigo-600"></div>
          <p className="mt-4 text-white font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center mb-8 animate-slide-up">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
          <p className="text-white/80 text-lg">
            Manage your inventory products
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/products/new"
            className="group inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl bg-red-50 border-l-4 border-red-500 p-4 mb-6 shadow-lg animate-slide-up">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="glass text-center py-16 rounded-2xl shadow-xl animate-slide-up">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products</h3>
          <p className="text-gray-600 mb-6">Get started by creating a new product.</p>
          <Link
            href="/products/new"
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>
      ) : (
        <div className="glass shadow-xl overflow-hidden rounded-2xl animate-slide-up">
          <div className="divide-y divide-gray-200/50">
            {products.map((product, index) => (
              <div key={product._id} className="px-6 py-5 hover:bg-white/50 transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0 mr-4">
                      {getStatusBadge(product)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-lg font-bold text-gray-900 truncate">
                          {product.name}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="font-medium">{product.sku}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>Qty: <span className="font-semibold">{product.quantity}</span> / Min: <span className="font-semibold">{product.minStock}</span></span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">₹{product.price.toFixed(2)}</span>
                        </div>
                        {product.expiryDate && (
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(product.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-3">
                    <Link
                      href={`/products/${product._id}/edit`}
                      className="inline-flex items-center px-4 py-2 border-2 border-indigo-300 text-sm font-semibold rounded-xl text-indigo-700 glass hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="inline-flex items-center px-4 py-2 border-2 border-red-300 text-sm font-semibold rounded-xl text-red-700 glass hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
