import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'
    const county = searchParams.get('county')
    const category = searchParams.get('category')
    const showCompletedOnly = searchParams.get('showCompletedOnly') === 'true'

    let startDate = new Date()
    let interval: 'hour' | 'day' | 'week' | 'month' = 'hour'

    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24)
        interval = 'hour'
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        interval = 'day'
        break
      case '60d':
        startDate.setDate(startDate.getDate() - 60)
        interval = 'week'
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        interval = 'month'
        break
      case 'all':
        startDate = new Date(0)
        interval = 'month'
        break
      default:
        startDate.setHours(startDate.getHours() - 24)
        interval = 'hour'
    }

    // Construim where clause pentru filtrare
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: new Date()
      }
    }

    // Adăugăm filtrare pentru comenzile finalizate dacă este activată
    if (showCompletedOnly) {
      whereClause.paymentStatus = 'COMPLETED'
    }

    // Adăugăm filtrare după județ dacă este specificat
    if (county && county !== 'all') {
      whereClause.details = {
        county: county
      }
    }

    // Obținem toate comenzile cu filtrele aplicate
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        },
        details: true,
        BundleOrder: {
          include: {
            bundle: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Funcție pentru a rotunji data la intervalul potrivit
    const roundDate = (date: Date, interval: 'hour' | 'day' | 'week' | 'month') => {
      const rounded = new Date(date)
      switch (interval) {
        case 'hour':
          rounded.setMinutes(0, 0, 0)
          break
        case 'day':
          rounded.setHours(0, 0, 0, 0)
          break
        case 'week':
          rounded.setHours(0, 0, 0, 0)
          rounded.setDate(rounded.getDate() - rounded.getDay())
          break
        case 'month':
          rounded.setDate(1)
          rounded.setHours(0, 0, 0, 0)
          break
      }
      return rounded
    }

    // Calculăm timeline data - grupăm datele pe intervale de timp
    const timelineMap = new Map<string, { revenue: number }>()

    // Inițializăm toate intervalele cu 0
    const currentDate = new Date()
    let tempDate = new Date(startDate)
    while (tempDate <= currentDate) {
      const roundedDate = roundDate(tempDate, interval)
      timelineMap.set(roundedDate.toISOString(), { revenue: 0 })
      
      switch (interval) {
        case 'hour':
          tempDate.setHours(tempDate.getHours() + 1)
          break
        case 'day':
          tempDate.setDate(tempDate.getDate() + 1)
          break
        case 'week':
          tempDate.setDate(tempDate.getDate() + 7)
          break
        case 'month':
          tempDate.setMonth(tempDate.getMonth() + 1)
          break
      }
    }

    // Adăugăm veniturile pentru fiecare interval
    orders.forEach(order => {
      const roundedDate = roundDate(order.createdAt, interval)
      const key = roundedDate.toISOString()
      const existing = timelineMap.get(key) || { revenue: 0 }
      existing.revenue += order.total
      timelineMap.set(key, existing)
    })

    // Convertim map-ul în array și sortăm după dată
    const timeline = Array.from(timelineMap.entries())
      .map(([timestamp, data]) => ({
        timestamp,
        revenue: data.revenue
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Calculăm statistici pentru produse
    const productMap = new Map<string, { 
      name: string, 
      totalSales: number, 
      totalRevenue: number,
      category: string 
    }>()
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId) || {
          name: item.product.name,
          totalSales: 0,
          totalRevenue: 0,
          category: item.product.collections[0] || 'Uncategorized'
        }
        existing.totalSales += item.quantity
        existing.totalRevenue += item.price * item.quantity
        productMap.set(item.productId, existing)
      })
    })

    // Filtrare produse după categorie dacă este specificată
    let products = Array.from(productMap.entries()).map(([id, data]) => ({
      id,
      ...data
    }))

    if (category && category !== 'all') {
      products = products.filter(product => product.category === category)
    }

    // Calculăm statistici pentru clienți
    const customerMap = new Map<string, { 
      email: string, 
      orderCount: number, 
      totalSpent: number,
      orders: Array<{
        id: string,
        createdAt: Date,
        total: number,
        status: string
      }>
    }>()

    orders.forEach(order => {
      if (order.details.email) {
        const existing = customerMap.get(order.details.email) || {
          email: order.details.email,
          orderCount: 0,
          totalSpent: 0,
          orders: []
        }
        existing.orderCount++
        existing.totalSpent += order.total
        existing.orders.push({
          id: order.id,
          createdAt: order.createdAt,
          total: order.total,
          status: order.paymentStatus
        })
        customerMap.set(order.details.email, existing)
      }
    })

    // Separăm clienții recurenți
    const repeatCustomers = Array.from(customerMap.entries())
      .map(([_, data]) => data)
      .filter(customer => customer.orderCount > 1)
      .sort((a, b) => b.orderCount - a.orderCount)

    // Calculăm statistici pentru județe
    const countyMap = new Map<string, { 
      orderCount: number, 
      totalRevenue: number 
    }>()

    orders.forEach(order => {
      const existing = countyMap.get(order.details.county) || {
        orderCount: 0,
        totalRevenue: 0
      }
      existing.orderCount++
      existing.totalRevenue += order.total
      countyMap.set(order.details.county, existing)
    })

    const counties = Array.from(countyMap.entries()).map(([name, data]) => ({
      name,
      ...data
    }))

    // Calculăm totaluri
    const totalSales = orders.reduce((acc, order) => 
      acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0
    )
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)

    return NextResponse.json({
      timeline,
      products,
      repeatCustomers,
      counties,
      totalSales,
      totalRevenue,
      orderCount: orders.length
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}

