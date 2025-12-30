'use client'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'border-primary bg-primary',
    blue: 'border-blue-500 bg-blue-500',
    green: 'border-green-500 bg-green-500',
    orange: 'border-orange-500 bg-orange-500',
    purple: 'border-purple-500 bg-purple-500'
  }

  const bgColorClasses = {
    primary: 'bg-primary bg-opacity-10',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50'
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg card-hover border-l-4 ${colorClasses[color as keyof typeof colorClasses] || 'border-primary'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColorClasses[color as keyof typeof bgColorClasses] || 'bg-primary bg-opacity-10'}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}