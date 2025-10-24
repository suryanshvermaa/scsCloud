import nodemailer from 'nodemailer';
import 'dotenv/config'

export const hostingEmail=async(email,websiteUrl)=>{
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
        subject:"🚀 Website Successfully Deployed - SCS Cloud",
        text:"Hosting successful - SCS Cloud",
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
                                    <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 14px;">Static Web Hosting</p>
                                </td>
                            </tr>
                            
                            <!-- Success Badge -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #d1fae5; border-radius: 50px; padding: 12px 24px;">
                                        <span style="color: #059669; font-size: 14px; font-weight: 600;">✓ DEPLOYMENT SUCCESSFUL</span>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 0 30px 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Your Website is Live! 🎉</h2>
                                    
                                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                                        Congratulations! Your website has been successfully deployed to our global CDN and is now accessible worldwide.
                                    </p>
                                    
                                    <!-- Website URL Box -->
                                    <div style="background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
                                        <p style="margin: 0 0 12px 0; color: #e0f2fe; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Website URL</p>
                                        <a href="${websiteUrl}" style="display: inline-block; background-color: #ffffff; color: #06b6d4; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
                                            🌐 Visit Your Website
                                        </a>
                                        <p style="margin: 0; color: #ffffff; font-size: 14px; word-break: break-all; font-family: 'Courier New', monospace;">
                                            ${websiteUrl}
                                        </p>
                                    </div>
                                    
                                    <!-- Features Grid -->
                                    <div style="margin-bottom: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Lightning Fast</div>
                                                        <div style="color: #6b7280; font-size: 12px;">Global CDN delivery</div>
                                                    </div>
                                                </td>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Secure HTTPS</div>
                                                        <div style="color: #6b7280; font-size: 12px;">SSL certificate included</div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 8px;">🔄</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Auto Updates</div>
                                                        <div style="color: #6b7280; font-size: 12px;">Instant deployments</div>
                                                    </div>
                                                </td>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Analytics</div>
                                                        <div style="color: #6b7280; font-size: 12px;">Track your visitors</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
                                        Need to update your site? Simply redeploy from your 
                                        <a href="https://scscloud.com/dashboard" style="color: #06b6d4; text-decoration: none; font-weight: 600;">dashboard</a>.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                                        Questions? <a href="mailto:support@scscloud.com" style="color: #06b6d4; text-decoration: none;">Contact Support</a>
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