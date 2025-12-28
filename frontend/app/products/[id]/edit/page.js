'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getProduct, updateProduct } from '../../../../lib/api'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    minStock: 0,
    expiryDate: '',
  })

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await getProduct(productId)
      const product = response.data
      
      // Format expiry date for input field
      let expiryDate = ''
      if (product.expiryDate) {
        const date = new Date(product.expiryDate)
        expiryDate = date.toISOString().split('T')[0]
      }

      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        minStock: product.minStock || 0,
        expiryDate: expiryDate,
      })
      setError(null)
    } catch (err) {
      setError('Failed to load product. Please try again.')
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Handle number inputs - remove leading zeros when user starts typing
    if (name === 'quantity' || name === 'minStock' || name === 'price') {
      const currentValue = formData[name]
      let processedValue = value
      
      // If current value is 0 and user is typing, replace the 0
      if (currentValue === 0 && value.length > 1 && value.startsWith('0') && value !== '0') {
        // Remove leading zeros
        processedValue = value.replace(/^0+/, '') || '0'
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: name === 'quantity' || name === 'minStock'
          ? (processedValue === '' ? '' : parseInt(processedValue) || 0)
          : (processedValue === '' ? '' : parseFloat(processedValue) || 0)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'expiryDate' ? value : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Prepare data for API
      const productData = {
        ...formData,
        expiryDate: formData.expiryDate || null,
      }

      await updateProduct(productId, productData)
      router.push('/products')
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Failed to update product. Please try again.'
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-indigo-600"></div>
          <p className="mt-4 text-white font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Edit Product</h1>
        <p className="text-white/80 text-lg">
          Update product information
        </p>
      </div>

      <div className="glass shadow-xl rounded-2xl p-8 animate-slide-up">
        {error && (
          <div className="rounded-2xl bg-red-50 border-l-4 border-red-500 p-4 mb-6 shadow-lg">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-4 transition-all duration-200"
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                SKU (Stock Keeping Unit) *
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-4 uppercase transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Current Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                required
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                onFocus={(e) => {
                  if (e.target.value === '0' || e.target.value === 0) {
                    e.target.select()
                  }
                }}
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-4 transition-all duration-200"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                onFocus={(e) => {
                  if (e.target.value === '0' || e.target.value === 0) {
                    e.target.select()
                  }
                }}
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-4 transition-all duration-200"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="minStock" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Minimum Stock Level *
              </label>
              <input
                type="number"
                name="minStock"
                id="minStock"
                required
                min="0"
                step="1"
                value={formData.minStock}
                onChange={handleChange}
                onFocus={(e) => {
                  if (e.target.value === '0' || e.target.value === 0) {
                    e.target.select()
                  }
                }}
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-4 transition-all duration-200"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Alert will trigger when quantity falls below this level
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiryDate"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-4 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-base font-semibold text-gray-700 glass hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform hover:scale-105 transition-all duration-200"
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Product
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

