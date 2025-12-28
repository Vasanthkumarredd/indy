'use client'

import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  const isActive = (path) => pathname === path
  
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="glass shadow-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold gradient-text">Inventory Manager</h1>
                  </div>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                  <Link
                    href="/"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/')
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    href="/products"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/products')
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Products
                  </Link>
                  <Link
                    href="/alerts"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/alerts')
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Alerts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  )
}

