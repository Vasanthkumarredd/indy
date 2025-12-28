'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDashboardStats } from '../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    expiredCount: 0,
    loading: true
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardStats()
      setStats({
        ...data,
        loading: false
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  if (stats.loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-indigo-600"></div>
          <p className="mt-4 text-white font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/80 text-lg">
          Overview of your inventory status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Products */}
        <div className="glass overflow-hidden shadow-xl rounded-2xl card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="glass overflow-hidden shadow-xl rounded-2xl card-hover border-l-4 border-yellow-400 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lowStockCount}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="glass overflow-hidden shadow-xl rounded-2xl card-hover border-l-4 border-orange-400 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-gray-900">{stats.expiringSoonCount}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Expired */}
        <div className="glass overflow-hidden shadow-xl rounded-2xl card-hover border-l-4 border-red-400 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Expired</p>
                <p className="text-3xl font-bold text-gray-900">{stats.expiredCount}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass shadow-xl rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/products/new"
            className="group inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </Link>
          <Link
            href="/products"
            className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 glass hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            View All Products
          </Link>
          <Link
            href="/alerts"
            className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 glass hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            View Alerts
          </Link>
        </div>
      </div>
    </div>
  )
}

