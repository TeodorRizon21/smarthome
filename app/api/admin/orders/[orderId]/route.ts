import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient, Prisma } from '@prisma/client'

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // First, delete associated OrderDiscountCode entries
      await tx.orderDiscountCode.deleteMany({
        where: { orderId: orderId },
      })

      // Then delete associated OrderItem entries
      await tx.orderItem.deleteMany({
        where: { orderId: orderId },
      })

      // Finally delete the order itself
      await tx.order.delete({
        where: { id: orderId },
      })
    })

    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    const body = await request.json()
    const { courier, awb, orderStatus } = body

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        courier, 
        awb, 
        orderStatus,
        paymentStatus: orderStatus === 'Comanda finalizata!' ? 'COMPLETED' : undefined
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

