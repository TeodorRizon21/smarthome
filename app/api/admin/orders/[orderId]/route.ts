import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (prisma) => {
      // First, delete associated OrderDiscountCode entries
      await prisma.orderDiscountCode.deleteMany({
        where: { orderId: orderId },
      })

      // Delete the order items
      await prisma.orderItem.deleteMany({
        where: { orderId: orderId },
      })

      // Find the order to get the detailsId
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { detailsId: true },
      })

      if (!order) {
        throw new Error('Order not found')
      }

      // Delete the order
      await prisma.order.delete({
        where: { id: orderId },
      })

      // Delete the order details
      await prisma.orderDetails.delete({
        where: { id: order.detailsId },
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

