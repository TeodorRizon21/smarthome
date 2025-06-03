import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/pdf';

interface AdminEmail {
  id: string;
  email: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = {
  name: 'Smart Homes',
  email: 'no-reply@smarthomes.ro'
};

export async function sendEmail(to: string, subject: string, html: string, attachments?: any[]) {
  console.log('=== SEND EMAIL STARTED ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('From:', FROM_EMAIL);
  console.log('Has attachments:', attachments ? 'Yes' : 'No');

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  if (!to) {
    console.error('No recipient email provided');
    return { success: false, error: 'No recipient email provided' };
  }

  try {
    console.log('Sending email via Resend...');
    const data = await resend.emails.send({
      from: `${FROM_EMAIL.name} <${FROM_EMAIL.email}>`,
      to,
      subject,
      html,
      attachments,
    });

    if (data.error) {
      console.error('Resend API error:', data.error);
      return { success: false, error: data.error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending email:', error);
    console.error('Full error:', error);
    if (error.statusCode === 403) {
      console.error('Authentication error. Please verify your API key and sender email address.');
    }
    return { 
      success: false, 
      error: error.message || 'Failed to send email'
    };
  }
}

export async function sendAdminNotification(order: any) {
  console.log('=== SEND ADMIN NOTIFICATION STARTED ===');
  console.log('Order ID:', order.id);

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    console.log('Fetching admin emails...');
    const adminEmails = await prisma.adminNotificationEmail.findMany();
    console.log('Found admin emails:', adminEmails);
    
    if (adminEmails.length === 0) {
      console.warn('No admin emails configured');
      return { success: false, error: 'No admin emails configured' };
    }

    if (!order.items || !Array.isArray(order.items)) {
      console.error('Invalid order items:', order.items);
      return { success: false, error: 'Invalid order items' };
    }

    const itemsList = order.items.map((item: any) => {
      const isBundle = item.productId?.toString().startsWith('bundle-');
      const productName = item.product?.name || 
        (isBundle ? `Pachet: ${item.productId.replace('bundle-', '')}` : 
        `Produs: ${item.productId}`);
                        
      return `<li>${item.quantity}x ${productName} (${item.size}) - ${item.price.toFixed(2)} RON</li>`;
    }).join('');

    const html = `
      <h1>New Order Received</h1>
      <p>Order ID: ${order.id}</p>
      <p>Total: ${order.total.toFixed(2)} RON</p>
      <p>Customer: ${order.details.fullName}</p>
      <p>Email: ${order.details.email}</p>
      <p>Phone: ${order.details.phoneNumber}</p>
      <h2>Items:</h2>
      <ul>
        ${itemsList}
      </ul>
      <h2>Shipping Address:</h2>
      <p>${order.details.street}</p>
      <p>${order.details.city}, ${order.details.county} ${order.details.postalCode}</p>
      <p>${order.details.country}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders">View Order Details</a></p>
    `;

    console.log('Sending emails to admins...');
    const results = await Promise.allSettled(
      adminEmails.map((admin: AdminEmail) => 
        sendEmail(
          admin.email,
          'New Order Notification',
          html
        )
      )
    );

    console.log('Admin notification results:', results);
    const allSuccessful = results.every(result => 
      result.status === 'fulfilled' && result.value.success
    );

    return { 
      success: allSuccessful,
      results 
    };
  } catch (error) {
    console.error('Error sending admin notifications:', error);
    console.error('Full error:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(order: any) {
  console.log('=== SEND ORDER CONFIRMATION STARTED ===');
  console.log('Order ID:', order.id);

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  if (!order.details?.email) {
    console.error('No customer email provided');
    return { success: false, error: 'No customer email provided' };
  }

  if (!order.items || !Array.isArray(order.items)) {
    console.error('Invalid order items:', order.items);
    return { success: false, error: 'Invalid order items' };
  }

  try {
    console.log('Preparing order confirmation email...');
    console.log('Order items:', order.items);

    const itemsList = order.items.map((item: any) => {
      const isBundle = item.productId?.toString().startsWith('bundle-');
      const productName = item.product?.name || 
        (isBundle ? `Pachet: ${item.productId.replace('bundle-', '')}` : 
        `Produs: ${item.productId}`);
                        
      return `<li>${item.quantity}x ${productName} (${item.size}) - ${item.price.toFixed(2)} RON</li>`;
    }).join('');

    const html = `
      <h1>Mulțumim pentru comandă!</h1>
      <p>Dragă ${order.details.fullName},</p>
      <p>Suntem bucuroși să confirmăm că comanda ta a fost primită și este în curs de procesare.</p>
      <p><strong>Număr comandă:</strong> ${order.id}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)} RON</p>
      <h2>Detalii comandă:</h2>
      <ul>
        ${itemsList}
      </ul>
      <h2>Adresă de livrare:</h2>
      <p>${order.details.street}</p>
      <p>${order.details.city}, ${order.details.county} ${order.details.postalCode}</p>
      <p>${order.details.country}</p>
      <p>Te vom notifica când comanda ta va fi expediată.</p>
      <p>Dacă ai întrebări, nu ezita să ne contactezi.</p>
    `;

    console.log('Generating PDF invoice...');
    const pdfBuffer = await generateInvoicePDF(order);
    console.log('PDF invoice generated successfully');

    console.log('Sending confirmation email...');
    const result = await sendEmail(
      order.details.email,
      'Confirmare comandă',
      html,
      [{
        filename: `factura-${order.id}.pdf`,
        content: pdfBuffer,
      }]
    );

    console.log('Confirmation email result:', result);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    console.error('Full error:', error);
    return { success: false, error };
  }
}

