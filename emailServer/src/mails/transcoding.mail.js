import nodemailer from 'nodemailer';
import 'dotenv/config'

export const sendTranscodingEmail=async(email,videoKey)=>{
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
        subject:"🎬 Video Transcoding Complete - SCS Cloud",
        text:"Video transcoding complete - SCS Cloud",
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
                                    <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">HLS Transcoding Service</p>
                                </td>
                            </tr>
                            
                            <!-- Success Badge -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #d1fae5; border-radius: 50px; padding: 12px 24px;">
                                        <span style="color: #059669; font-size: 14px; font-weight: 600;">✓ TRANSCODING COMPLETE</span>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 0 30px 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Your Video is Ready! 🎉</h2>
                                    
                                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                                        Your video has been successfully transcoded to adaptive HLS format with multiple quality variants.
                                    </p>
                                    
                                    <!-- Video Info Box -->
                                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #06b6d4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                        <p style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">
                                            Video File
                                        </p>
                                        <div style="background-color: #ffffff; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
                                            <p style="margin: 0; color: #1f2937; font-size: 14px; font-family: 'Courier New', monospace; word-break: break-all; text-align: center;">
                                                ${videoKey}
                                            </p>
                                        </div>
                                        <div style="text-align: center;">
                                            <span style="display: inline-block; background-color: #d1fae5; color: #059669; padding: 6px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 0 4px;">
                                                1080p
                                            </span>
                                            <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 6px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 0 4px;">
                                                720p
                                            </span>
                                            <span style="display: inline-block; background-color: #e0e7ff; color: #5b21b6; padding: 6px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 0 4px;">
                                                480p
                                            </span>
                                            <span style="display: inline-block; background-color: #fce7f3; color: #9f1239; padding: 6px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 0 4px;">
                                                360p
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Features Grid -->
                                    <div style="margin-bottom: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 32px; margin-bottom: 8px;">📱</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Adaptive Streaming</div>
                                                        <div style="color: #6b7280; font-size: 12px;">Auto quality switching</div>
                                                    </div>
                                                </td>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 32px; margin-bottom: 8px;">⚡</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Fast Loading</div>
                                                        <div style="color: #6b7280; font-size: 12px;">Chunked delivery</div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 32px; margin-bottom: 8px;">🌍</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Global CDN</div>
                                                        <div style="color: #6b7280; font-size: 12px;">Worldwide delivery</div>
                                                    </div>
                                                </td>
                                                <td width="50%" style="padding: 16px; vertical-align: top;">
                                                    <div style="text-align: center;">
                                                        <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
                                                        <div style="color: #1f2937; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Secure Storage</div>
                                                        <div style="color: #6b7280; font-size: 12px;">S3 backed</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <!-- Info Box -->
                                    <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                        <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                                            <strong>💡 Next Steps:</strong> Access your transcoded video from the dashboard. You can now embed it in your website or app using our video player SDK.
                                        </p>
                                    </div>
                                    
                                    <!-- Action Button -->
                                    <div style="text-align: center; margin-bottom: 24px;">
                                        <a href="https://scscloud.com/hls-transcoding-service" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                            View in Dashboard
                                        </a>
                                    </div>
                                    
                                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
                                        Need help integrating? Check out our 
                                        <a href="https://scscloud.com/hls-transcoder-docs" style="color: #06b6d4; text-decoration: none; font-weight: 600;">documentation</a> 
                                        for code examples and best practices.
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
