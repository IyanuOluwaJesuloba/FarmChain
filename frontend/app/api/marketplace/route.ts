import { NextRequest, NextResponse } from 'next/server'
import { mockCrops, createApiResponse, createPaginatedResponse } from '@/lib/mockData'

// GET /api/crops - Get crops with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const farmerId = searchParams.get('farmerId')
    const cropType = searchParams.get('cropType')
    const status = searchParams.get('status')

    let filteredCrops = mockCrops

    // Apply filters
    if (farmerId) {
      filteredCrops = filteredCrops.filter(crop => crop.farmerId === farmerId)
    }

    if (cropType) {
      filteredCrops = filteredCrops.filter(crop => 
        crop.cropType.toLowerCase() === cropType.toLowerCase()
      )
    }

    if (status) {
      filteredCrops = filteredCrops.filter(crop => crop.status === status)
    }

    return NextResponse.json(
      createPaginatedResponse(filteredCrops, page, limit)
    )
  } catch (error) {
    return NextResponse.json(
      createApiResponse(null, false, 'Failed to fetch crops'),
      { status: 500 }
    )
  }
}

// POST /api/crops - Record new crop
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['farmerId', 'cropType', 'plantingDate', 'farmSize']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          createApiResponse(null, false, `Missing required field: ${field}`),
          { status: 400 }
        )
      }
    }

    // Simulate blockchain transaction
    const blockchainTxHash = `0x${Math.random().toString(16).slice(2, 66)}`
    
    const newCrop = {
      id: `crop_${Date.now()}`,
      blockchainTxHash,
      ...body,
      status: 'planted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real implementation, this would:
    // 1. Deploy to blockchain
    // 2. Store in database
    // 3. Generate QR code
    // 4. Send confirmation SMS

    return NextResponse.json(
      createApiResponse(newCrop, true, 'Crop recorded on blockchain successfully')
    )
  } catch (error) {
    return NextResponse.json(
      createApiResponse(null, false, 'Failed to record crop'),
      { status: 500 }
    )
  }
}