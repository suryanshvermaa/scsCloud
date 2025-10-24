import nodemailer from 'nodemailer';
import 'dotenv/config'

export const apiKeysEmail=async(email,accessKey,secretAccessKey)=>{
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
        subject:"🔑 Your SCS Cloud API Keys",
        text:"Your API Keys - SCS Cloud",
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
                                <td style="background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SCS Cloud</h1>
                                    <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 14px;">Suryansh Cloud Services</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">🔑 Your API Keys</h2>
                                    
                                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        Your API keys have been generated successfully. Please store these credentials securely and never share them with anyone.
                                    </p>
                                    
                                    <!-- Warning Box -->
                                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">⚠️ Important Security Notice</p>
                                        <p style="margin: 8px 0 0 0; color: #92400e; font-size: 14px;">
                                            Keep your API keys confidential. Anyone with these keys can access your SCS Cloud resources.
                                        </p>
                                    </div>
                                    
                                    <!-- API Keys Box -->
                                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                        <div style="margin-bottom: 20px;">
                                            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Access Key</p>
                                            <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; padding: 12px; font-family: 'Courier New', monospace; font-size: 14px; color: #1f2937; word-break: break-all;">
                                                ${accessKey}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Secret Access Key</p>
                                            <div style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; padding: 12px; font-family: 'Courier New', monospace; font-size: 14px; color: #1f2937; word-break: break-all;">
                                                ${secretAccessKey}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                                        You can now use these credentials to authenticate your API requests. Visit our 
                                        <a href="https://scscloud.com/docs" style="color: #06b6d4; text-decoration: none; font-weight: 600;">documentation</a> 
                                        for integration guides.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                                        Need help? <a href="mailto:support@scscloud.com" style="color: #06b6d4; text-decoration: none;">Contact Support</a>
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