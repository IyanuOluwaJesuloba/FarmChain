import { NextRequest, NextResponse } from 'next/server'
import { mockFarmers, createApiResponse, createPaginatedResponse } from '@/lib/mockData'

// GET /api/farmers - Get all farmers with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const state = searchParams.get('state')
    const verificationStatus = searchParams.get('verification')
    const search = searchParams.get('search')

    let filteredFarmers = mockFarmers

    // Apply filters
    if (state) {
      filteredFarmers = filteredFarmers.filter(farmer => 
        farmer.location.state.toLowerCase() === state.toLowerCase()
      )
    }

    if (verificationStatus) {
      filteredFarmers = filteredFarmers.filter(farmer => 
        farmer.verificationStatus === verificationStatus
      )
    }

    if (search) {
      filteredFarmers = filteredFarmers.filter(farmer =>
        farmer.name.toLowerCase().includes(search.toLowerCase()) ||
        farmer.crops.some((crop: string) => crop.toLowerCase().includes(search.toLowerCase()))
      )
    }

    return NextResponse.json(
      createPaginatedResponse(filteredFarmers, page, limit)
    )
  } catch (error) {
    return NextResponse.json(
      createApiResponse(null, false, 'Failed to fetch farmers'),
      { status: 500 }
    )
  }
}

// POST /api/farmers - Register new farmer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'phoneNumber', 'location', 'farmSize']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          createApiResponse(null, false, `Missing required field: ${field}`),
          { status: 400 }
        )
      }
    }

    // Simulate farmer registration
    const newFarmer = {
      id: `farmer_${Date.now()}`,
      walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      ...body,
      verificationStatus: 'pending',
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real implementation, this would:
    // 1. Create blockchain identity
    // 2. Store in database
    // 3. Send verification SMS
    
    return NextResponse.json(
      createApiResponse(newFarmer, true, 'Farmer registered successfully')
    )
  } catch (error) {
    return NextResponse.json(
      createApiResponse(null, false, 'Registration failed'),
      { status: 500 }
    )
  }
}