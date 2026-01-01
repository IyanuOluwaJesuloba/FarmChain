'use client'

interface LandingPageProps {
  setCurrentPage: (page: string) => void
}

export default function LandingPage({ setCurrentPage }: LandingPageProps) {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: "Transparent Supply Chain",
      description: "Track your crops from planting to market with immutable blockchain records. Buyers know exactly what they're getting."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>
      ),
      title: "Direct Market Access",
      description: "Sell directly to buyers without middlemen. Get fair prices for your coffee, avocado, cacao, and other crops."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      ),
      title: "Smart Finance",
      description: "Access loans, insurance, and savings groups through smart contracts. No banks, no paperwork hassles."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 fade-in">
              Empowering Latin American Farmers
              <span className="block text-green-200">with Blockchain</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto fade-in">
              Connect directly with buyers, access micro-finance, and grow your farming business with transparent, blockchain-powered tools designed for small and medium farmers across Latin America.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
              <button 
                onClick={() => setCurrentPage('auth')}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Start Farming Smart
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Stats Cards */}
        <div className="absolute bottom-10 left-10 glass-effect rounded-lg p-4 text-white hidden lg:block">
          <div className="text-2xl font-bold">$2.5M+</div>
          <div className="text-sm">Farmer Earnings</div>
        </div>
        <div className="absolute bottom-10 right-10 glass-effect rounded-lg p-4 text-white hidden lg:block">
          <div className="text-2xl font-bold">15,000+</div>
          <div className="text-sm">Active Farmers</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Revolutionizing Latin American Agriculture</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From coffee farms in Colombia to avocado orchards in Mexico, our platform serves small and medium farmers across Latin America
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg card-hover">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">$2.5M</div>
              <div className="text-gray-600">Total Earnings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">20</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-gray-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Verified Buyers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of Latin American farmers already using blockchain technology to grow their businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('auth')}
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}