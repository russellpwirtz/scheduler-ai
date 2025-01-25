import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import availabilityData from '../../config/availability.json';

// Validate environment variables on startup
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
if (requiredEnvVars.some(v => !process.env[v])) {
  throw new Error(`Missing required environment variables: ${requiredEnvVars.join(', ')}`);
}

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!, 10),  // Non-null assertion since we validated above
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Add rate limiting middleware (would need separate setup)
// Consider using next-rate-limiter or similar package

interface EmailRequestBody {
  workerName: string;
  details: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Validate request body
  const { workerName, details } = req.body as EmailRequestBody;
  if (!workerName || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const worker = availabilityData[workerName as keyof typeof availabilityData];
    if (!worker) return res.status(404).json({ error: 'Worker not found' });  // 404 instead of 400

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Scheduler Bot" <noreply@example.com>',  // Configurable from env
      to: worker.email,
      subject: 'New Booking Scheduled',
      text: `New booking details:\n${details}`,
      html: `<p>New booking details:</p><pre>${details}</pre>`  // Add HTML version
    });

    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ 
      error: 'Failed to send notification',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    });
  }
} 