'use client'

import { useState, useEffect } from 'react'
import { mockWeatherData } from '@/lib/mockData'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(mockWeatherData)
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    // Simulate weather data fetching
    const fetchWeather = async () => {
      // In real implementation, this would call weather API
      setWeather(mockWeatherData)
    }
    fetchWeather()
  }, [])

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Clima Latino</h3>
        <span className="text-sm opacity-80">{weather.location}</span>
      </div>
      
      {/* Current Weather */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{weather.current.icon}</div>
        <div className="text-3xl font-bold">{weather.current.temperature}°C</div>
        <div className="text-sm opacity-80">{weather.current.condition}</div>
        <div className="text-xs opacity-70 mt-2">
          Humidity: {weather.current.humidity}% | Wind: {weather.current.windSpeed} km/h
        </div>
      </div>

      {/* Weather Alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-200">⚠️</span>
            <span className="text-sm font-medium text-red-100">Weather Alert</span>
          </div>
          <p className="text-xs text-red-100 mt-1">
            {weather.alerts[0].message}
          </p>
        </div>
      )}

      {/* 3-Day Forecast */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold opacity-80">3-Day Forecast</h4>
        {weather.forecast.slice(0, 3).map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              selectedDay === index ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => setSelectedDay(index)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{day.icon}</span>
              <div>
                <div className="text-sm font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs opacity-80">{day.condition}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">{day.maxTemp}°/{day.minTemp}°</div>
              <div className="text-xs opacity-80">{day.rainfall}mm rain</div>
            </div>
          </div>
        ))}
      </div>

      {/* Farming Advice */}
      <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <span>🌱</span>
          <span className="text-sm font-medium">Farming Tip</span>
        </div>
        <p className="text-xs opacity-90">
          {weather.forecast[0].rainfall > 10 
            ? "Heavy rain expected. Perfect for coffee plants but protect drying cacao beans and cover harvested crops."
            : "Good weather for outdoor activities. Ideal time for coffee pruning and cacao pod harvesting."
          }
        </p>
      </div>
    </div>
  )
}