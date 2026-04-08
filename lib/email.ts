import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  totalAmount,
  address,
  city,
  items,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  totalAmount: number;
  address: string;
  city: string;
  items: { name?: string; quantity: number; unitPrice: number }[];
}) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: customerEmail,
    subject: `Order Confirmed – ${orderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #D62828;">Order Confirmed!</h1>
        <p>Hi <strong>${customerName}</strong>, thank you for your order.</p>

        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Delivery Address:</strong> ${address}, ${city}</p>
        </div>

        <h3>Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="text-align: left; padding: 8px;">Item</th>
              <th style="text-align: center; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${item.name ?? 'Product'}</td>
                <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">₦${(item.unitPrice * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 16px; font-size: 1.2rem;">
          <strong>Total: ₦${totalAmount.toLocaleString()}</strong>
        </div>

        <p style="margin-top: 24px; color: #555;">
          We will contact you at <strong>${customerPhone}</strong> to arrange delivery or pickup.
        </p>

        <p style="color: #888; font-size: 0.85rem; margin-top: 32px;">
          Viva Apex Frozen Foods — Port Harcourt, Rivers State
        </p>
      </div>
    `,
  });
}