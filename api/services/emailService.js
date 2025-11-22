import nodemailer from 'nodemailer';

// Create transporter using Gmail (you can change this to any email service)
// Exported so it can be reused in other places like notification.js
export const createEmailTransporter = () => {
  // eslint-disable-next-line no-undef
  const email_user = process.env.EMAIL_USER;
  // eslint-disable-next-line no-undef
  const email_pass = process.env.EMAIL_PASS;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email_user,
      pass: email_pass
    }
  });
};

// Format order items for email
const formatOrderItems = (items) => {
  return items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData, userEmail, userName) => {
  try {
    const transporter = createEmailTransporter();

    const isCharityOrder = orderData.paymentMethod === 'donation';
    const orderTypeLabel = isCharityOrder ? 'Charity Donation' : 'Order';

    const mailOptions = {
      // eslint-disable-next-line no-undef
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `${orderTypeLabel} Confirmation - Order #${orderData._id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #f3f4f6; padding: 10px; text-align: left; }
            .total-row { font-weight: bold; font-size: 18px; }
            .pickup-notice { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .charity-notice { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 ${orderTypeLabel} Confirmation</h1>
              <p>Thank you for your ${isCharityOrder ? 'charity request' : 'order'}, ${userName}!</p>
            </div>

            <div class="content">
              ${isCharityOrder ? `
                <div class="charity-notice">
                  <strong>🎁 Charity Donation</strong>
                  <p>You're receiving charity items at no cost. Thank you for helping reduce food waste!</p>
                </div>
              ` : ''}

              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> ${orderData._id}</p>
                <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p><strong>Status:</strong> ${orderData.status}</p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'donation' ? 'Charity Donation (Free)' : orderData.paymentMethod}</p>
              </div>

              <div class="order-details">
                <h2>Items Ordered</h2>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Quantity</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${formatOrderItems(orderData.items)}
                    <tr class="total-row">
                      <td colspan="3" style="padding: 15px; text-align: right;">Total Amount:</td>
                      <td style="padding: 15px; text-align: right; color: #10b981;">
                        ${isCharityOrder ? 'FREE' : `$${orderData.totalAmount.toFixed(2)}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pickup-notice">
                <strong>📍 Pickup Instructions</strong>
                <p><strong>Your Address:</strong><br>
                ${orderData.shippingAddress.street}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}<br>
                ${orderData.shippingAddress.country}</p>
                <p style="margin-top: 15px;"><strong>⚠️ Important:</strong> Please contact the retailer directly to arrange a convenient pickup time and get specific location details for collecting your items.</p>
              </div>

              <p style="margin-top: 30px; color: #6b7280;">
                If you have any questions about your ${orderTypeLabel.toLowerCase()}, please don't hesitate to contact us.
              </p>
            </div>

            <div class="footer">
              <p>Thank you for choosing Smart Food Connect!</p>
              <p>Together, we're reducing food waste and building a sustainable future.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};
