import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { courier, awb, action } = body;

    console.log(`API: Procesăm comanda ${orderId} cu acțiunea ${action}`);
    console.log(`API: Detalii primite: courier=${courier}, awb=${awb}`);

    // Verificăm dacă comanda există
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      console.error(`API: Comanda cu ID-ul ${orderId} nu a fost găsită`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`API: Status curent al comenzii: ${existingOrder.orderStatus}`);

    let updateData: any = {};

    // În funcție de acțiune, setăm statutul comenzii
    if (action === 'ship') {
      updateData = {
        courier,
        awb,
        orderStatus: 'Comanda se indreapta catre tine!'
      };
      console.log('API: Setăm statusul comenzii la "Comanda se indreapta catre tine!"');
    } else if (action === 'complete') {
      updateData = {
        orderStatus: 'Comanda finalizata!',
        paymentStatus: 'COMPLETED'
      };
      console.log('API: Setăm statusul comenzii la "Comanda finalizata!"');
    }

    // Actualizează comanda
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
        details: true,
        BundleOrder: {
          include: {
            bundle: true
          }
        }
      }
    });

    console.log(`API: Comanda actualizată cu succes. Noul status: ${updatedOrder.orderStatus}`);

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
} 