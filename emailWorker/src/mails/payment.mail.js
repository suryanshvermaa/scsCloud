import nodemailer from 'nodemailer';
import 'dotenv/config'

export const paymentMail=async(email,amount,paymentId)=>{
     const transporter=await nodemailer.createTransport({
        service:'gmail',
        auth:{
         user:process.env.MY_EMAIL,
         pass:process.env.MY_PASSWORD
        }
     });

     const info=await transporter.sendMail({
        from:'suryanshverma.nitp@gmail.com',
        to:email,
        subject:"💳 Payment Successful - SCS Cloud",
        text:"Payment confirmation - SCS Cloud",
        html:`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header with gradient -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SCS Cloud</h1>
                                    <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 14px;">Payment Receipt</p>
                                </td>
                            </tr>
                            
                            <!-- Success Icon -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; line-height: 80px; font-size: 40px; margin-bottom: 20px;">
                                        ✓
                                    </div>
                                    <h2 style="margin: 0; color: #059669; font-size: 24px; font-weight: 700;">Payment Successful!</h2>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 0 30px 40px 30px;">
                                    <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                                        Thank you for your payment. Your transaction has been processed successfully.
                                    </p>
                                    
                                    <!-- Payment Details Box -->
                                    <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; font-weight: 600; text-align: center;">
                                            Payment Details
                                        </p>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 12px 0; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #6b7280; font-size: 14px;">Amount Paid</span>
                                                </td>
                                                <td style="padding: 12px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #1f2937; font-size: 18px; font-weight: 700;">₹${amount}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #6b7280; font-size: 14px;">Payment ID</span>
                                                </td>
                                                <td style="padding: 12px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #1f2937; font-size: 14px; font-family: 'Courier New', monospace; word-break: break-all;">${paymentId}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #6b7280; font-size: 14px;">Payment Status</span>
                                                </td>
                                                <td style="padding: 12px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                                                    <span style="display: inline-block; background-color: #d1fae5; color: #059669; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                                        ✓ COMPLETED
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #6b7280; font-size: 14px;">Date & Time</span>
                                                </td>
                                                <td style="padding: 12px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                                                    <span style="color: #1f2937; font-size: 14px;">${new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <!-- What's Next Box -->
                                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #06b6d4; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                                        <p style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">
                                            ✨ What's Next?
                                        </p>
                                        <p style="margin: 0; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
                                            Your SCS Coins have been credited to your account. You can now use our services including HLS Transcoding and Static Web Hosting.
                                        </p>
                                    </div>
                                    
                                    <!-- Action Button -->
                                    <div style="text-align: center; margin-bottom: 24px;">
                                        <a href="https://scscloud.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                            View Dashboard
                                        </a>
                                    </div>
                                    
                                    <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6; text-align: center;">
                                        Keep this email for your records. If you have any questions about this payment, 
                                        <a href="mailto:support@scscloud.com" style="color: #06b6d4; text-decoration: none;">contact our support team</a>.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                                        Questions about your payment? <a href="mailto:support@scscloud.com" style="color: #06b6d4; text-decoration: none;">Contact Support</a>
                                    </p>
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                        © 2025 SCS Cloud. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
     })
     console.log('sended');
}