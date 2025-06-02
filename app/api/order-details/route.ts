import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { rememberDetails, paymentType, ...orderDetails } = body

    console.log('Received order details:', orderDetails)

    const savedDetails = await prisma.orderDetails.create({
      data: {
        userId: orderDetails.userId,
        fullName: orderDetails.fullName,
        email: orderDetails.email,
        phoneNumber: orderDetails.phoneNumber,
        street: orderDetails.street,
        city: orderDetails.city,
        county: orderDetails.county,
        postalCode: orderDetails.postalCode,
        country: orderDetails.country,
        notes: orderDetails.notes || '',
        isCompany: orderDetails.isCompany || false,
        companyName: orderDetails.companyName,
        companyCUI: orderDetails.companyCUI,
        companyRegNumber: orderDetails.companyRegNumber,
        companyCounty: orderDetails.companyCounty,
        companyCity: orderDetails.companyCity,
        companyAddress: orderDetails.companyAddress,
      },
    })

    return NextResponse.json(savedDetails)
  } catch (error) {
    console.error('Error saving order details:', error)
    return NextResponse.json({ error: 'Failed to save order details' }, { status: 500 })
  }
}

