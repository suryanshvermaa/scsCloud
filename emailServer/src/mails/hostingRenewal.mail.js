import nodemailer from 'nodemailer';
import 'dotenv/config'

export const hostingRenewalEmail=async(email,websiteUrl)=>{
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
        subject:"✅ Hosting Renewed Successfully - SCS Cloud",
        text:"Hosting renewal successful - SCS Cloud",
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
                                <td style="background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SCS Cloud</h1>
                                    <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Hosting Renewal Confirmation</p>
                                </td>
                            </tr>
                            
                            <!-- Success Icon -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; line-height: 80px; font-size: 40px; margin-bottom: 20px;">
                                        ✓
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 0 30px 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Renewal Successful!</h2>
                                    
                                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                                        Your website hosting has been successfully renewed for another 30 days.
                                    </p>
                                    
                                    <!-- Renewal Details Box -->
                                    <div style="background-color: #f0f9ff; border: 2px solid #06b6d4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #6b7280; font-size: 14px;">Website URL:</span>
                                                </td>
                                                <td style="padding: 8px 0; text-align: right;">
                                                    <a href="${websiteUrl}" style="color: #06b6d4; text-decoration: none; font-size: 14px; font-weight: 600; word-break: break-all;">
                                                        ${websiteUrl}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #bfdbfe;">
                                                    <span style="color: #6b7280; font-size: 14px;">Renewal Period:</span>
                                                </td>
                                                <td style="padding: 8px 0; text-align: right; border-top: 1px solid #bfdbfe;">
                                                    <span style="color: #1f2937; font-size: 14px; font-weight: 600;">30 Days</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #bfdbfe;">
                                                    <span style="color: #6b7280; font-size: 14px;">Status:</span>
                                                </td>
                                                <td style="padding: 8px 0; text-align: right; border-top: 1px solid #bfdbfe;">
                                                    <span style="color: #059669; font-size: 14px; font-weight: 600;">● Active</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <!-- Info Box -->
                                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                            <strong>💡 Reminder:</strong> Your hosting will expire in 30 days. Don't forget to renew to keep your website online.
                                        </p>
                                    </div>
                                    
                                    <!-- Action Button -->
                                    <div style="text-align: center; margin-bottom: 24px;">
                                        <a href="https://scscloud.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                            View Dashboard
                                        </a>
                                    </div>
                                    
                                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
                                        Your website continues to benefit from our global CDN, SSL certificates, and 99.9% uptime guarantee.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                                        Have questions? <a href="mailto:support@scscloud.com" style="color: #06b6d4; text-decoration: none;">Contact Support</a>
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