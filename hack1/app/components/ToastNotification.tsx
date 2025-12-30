'use client'

import { useEffect, useState } from 'react'

interface ToastNotificationProps {
  isConnected: boolean
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

export default function ToastNotification({ isConnected }: ToastNotificationProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    if (isConnected) {
      const connectionToast: Toast = {
        id: 'wallet-connected',
        type: 'success',
        title: 'Wallet Connected',
        message: 'Successfully connected to Polygon Network',
        duration: 3000
      }
      setToasts([connectionToast])
    }
  }, [isConnected])

  const removeToast = (id: string) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
        return () => clearTimeout(timer)
      }
    })
  }, [toasts])

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600'
      case 'error':
        return 'bg-red-500 border-red-600'
      case 'warning':
        return 'bg-yellow-500 border-yellow-600'
      case 'info':
        return 'bg-blue-500 border-blue-600'
      default:
        return 'bg-gray-500 border-gray-600'
    }
  }

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} text-white px-6 py-3 rounded-lg shadow-lg fade-in border-l-4 max-w-sm`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getToastIcon(toast.type)}</span>
              <div>
                <div className="font-semibold">{toast.title}</div>
                <div className="text-sm opacity-90">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}