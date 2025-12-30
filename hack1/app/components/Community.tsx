'use client'

import { useState } from 'react'

interface UserData {
  name: string
  email: string
  location: string
  farmSize: string
  crops: string
  totalCrops: number
  activeSales: number
  totalEarnings: number
  pendingPayments: number
}

interface CommunityProps {
  userData: UserData | null
}

export default function Community({ userData }: CommunityProps) {
  const [activeTab, setActiveTab] = useState('discussions')

  const tabs = [
    { id: 'discussions', name: 'Discussions', icon: '💬' },
    { id: 'knowledge', name: 'Knowledge Base', icon: '📚' },
    { id: 'experts', name: 'Expert Advice', icon: '👨‍🌾' },
    { id: 'success', name: 'Success Stories', icon: '🏆' }
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'discussions':
        return <DiscussionsTab />
      case 'knowledge':
        return <KnowledgeTab />
      case 'experts':
        return <ExpertsTab />
      case 'success':
        return <SuccessStoriesTab />
      default:
        return <DiscussionsTab />
    }
  }

  // Tab Components
  const DiscussionsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Recent Discussions</h3>
      <div className="space-y-4">
        {[
          { title: "Best coffee varieties for high altitude farming", author: "Carlos M.", replies: 12, time: "2 hours ago" },
          { title: "Organic pest control methods for cacao", author: "María G.", replies: 8, time: "5 hours ago" },
          { title: "Market prices for quinoa in Argentina", author: "Ana R.", replies: 15, time: "1 day ago" }
        ].map((discussion, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900">{discussion.title}</h4>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>By {discussion.author} • {discussion.replies} replies</span>
              <span>{discussion.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const KnowledgeTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "Coffee Growing Guide", category: "Crops", reads: "1.2k" },
          { title: "Sustainable Farming Practices", category: "Environment", reads: "890" },
          { title: "Market Analysis Tools", category: "Business", reads: "650" },
          { title: "Pest Management", category: "Health", reads: "2.1k" }
        ].map((article, index) => (
          <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{article.category}</span>
              <span className="text-xs text-gray-500">{article.reads} reads</span>
            </div>
            <h4 className="font-medium text-gray-900">{article.title}</h4>
          </div>
        ))}
      </div>
    </div>
  )

  const ExpertsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Expert Advice</h3>
      <div className="space-y-4">
        {[
          { name: "Dr. Elena Vargas", specialty: "Coffee Cultivation", location: "Colombia", rating: 4.9 },
          { name: "Prof. Miguel Santos", specialty: "Sustainable Agriculture", location: "Brazil", rating: 4.8 },
          { name: "Ing. Carmen López", specialty: "Crop Disease Management", location: "Mexico", rating: 4.7 }
        ].map((expert, index) => (
          <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{expert.name}</h4>
                <p className="text-sm text-gray-600">{expert.specialty}</p>
                <p className="text-xs text-gray-500">{expert.location}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                </div>
                <button className="mt-2 text-sm bg-primary text-white px-3 py-1 rounded">Contact</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const SuccessStoriesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Success Stories</h3>
      <div className="space-y-4">
        {[
          { farmer: "Carlos Mendoza", story: "Increased coffee yield by 40% using sustainable practices", location: "Colombia", crop: "Coffee" },
          { farmer: "María González", story: "Built successful cacao export business through community cooperation", location: "Ecuador", crop: "Cacao" },
          { farmer: "Ana Rodriguez", story: "Transformed family farm into organic quinoa operation", location: "Peru", crop: "Quinoa" }
        ].map((story, index) => (
          <div key={index} className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{story.farmer}</h4>
                <p className="text-sm text-gray-700 mt-1">{story.story}</p>
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">{story.crop}</span>
                  <span>{story.location}</span>
                </div>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
        <p className="text-gray-600 mt-2">
          {userData?.name ? `Welcome ${userData.name}! ` : ''}Connect with fellow farmers in {userData?.location || 'Latin America'} and grow together
        </p>
      </div>

      {/* Community Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  )
}

function DiscussionsTab() {
  const discussions = [
    {
      id: 1,
      title: "Best practices for coffee cultivation in high altitude regions",
      author: "Maria Santos",
      location: "Colombia",
      replies: 12,
      lastActivity: "2 hours ago",
      category: "Coffee"
    },
    {
      id: 2,
      title: "Organic pest control methods for avocado trees",
      author: "Carlos Mendez",
      location: "Mexico",
      replies: 8,
      lastActivity: "5 hours ago",
      category: "Avocado"
    },
    {
      id: 3,
      title: "Water management during dry season - sharing experiences",
      author: "Ana Rodriguez",
      location: "Peru",
      replies: 15,
      lastActivity: "1 day ago",
      category: "Water Management"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Discussions</h3>
        <button className="btn-primary">Start Discussion</button>
      </div>
      
      {discussions.map((discussion) => (
        <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">{discussion.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {discussion.author} • {discussion.location}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{discussion.category}</span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{discussion.replies} replies</div>
              <div>{discussion.lastActivity}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function KnowledgeTab() {
  const articles = [
    {
      title: "Complete Guide to Sustainable Coffee Farming",
      category: "Coffee",
      readTime: "12 min read",
      author: "Agricultural Extension Team"
    },
    {
      title: "Crop Rotation Strategies for Small Farms",
      category: "General",
      readTime: "8 min read",
      author: "Dr. Elena Vasquez"
    },
    {
      title: "Climate-Resilient Farming Techniques",
      category: "Climate",
      readTime: "15 min read",
      author: "Climate Adaptation Institute"
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Knowledge Base</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 card-hover">
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded w-fit mb-2">
              {article.category}
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
            <div className="text-sm text-gray-500">
              <span>{article.readTime} • By {article.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExpertsTab() {
  const experts = [
    {
      name: "Dr. Roberto Silva",
      specialty: "Coffee & Cacao Cultivation",
      location: "Brazil",
      rating: 4.9,
      consultations: 150
    },
    {
      name: "Maria Gonzalez",
      specialty: "Organic Farming & Certification",
      location: "Costa Rica",
      rating: 4.8,
      consultations: 120
    },
    {
      name: "Carlos Herrera",
      specialty: "Irrigation & Water Management",
      location: "Chile",
      rating: 4.7,
      consultations: 95
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Agricultural Experts</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experts.map((expert, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 text-center card-hover">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
              {expert.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h4 className="font-medium text-gray-900">{expert.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{expert.specialty}</p>
            <p className="text-xs text-gray-500 mb-3">{expert.location}</p>
            <div className="flex justify-center items-center space-x-2 text-sm">
              <span className="text-yellow-500">★ {expert.rating}</span>
              <span className="text-gray-500">• {expert.consultations} consultations</span>
            </div>
            <button className="btn-primary mt-3 w-full">Book Consultation</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessStoriesTab() {
  const stories = [
    {
      farmer: "Juan Morales",
      location: "Guatemala",
      crop: "Coffee",
      achievement: "Increased yield by 40% using sustainable practices",
      story: "After implementing water-efficient irrigation and organic fertilizers, my coffee farm now produces premium beans that sell for 30% higher prices."
    },
    {
      farmer: "Isabella Santos",
      location: "Ecuador",
      crop: "Cacao",
      achievement: "Achieved organic certification and direct trade partnerships",
      story: "Through the platform, I connected with fair trade buyers and now export directly to chocolate makers in Europe."
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Success Stories</h3>
      {stories.map((story, index) => (
        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              {story.farmer.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900">{story.farmer}</h4>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600">{story.location}</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{story.crop}</span>
              </div>
              <p className="font-medium text-green-800 mb-2">{story.achievement}</p>
              <p className="text-gray-700 italic">&ldquo;{story.story}&rdquo;</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}