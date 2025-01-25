import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import availabilityData from '../../config/availability.json';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { workerName, details } = req.body;
  
  try {
    const worker = availabilityData[workerName as keyof typeof availabilityData];
    if (!worker) return res.status(400).json({ error: 'Worker not found' });

    await transporter.sendMail({
      from: '"Scheduler Bot" <bot@example.com>',
      to: worker.email,
      subject: 'New Booking Scheduled',
      text: `New booking details:\n${details}`
    });

    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
} 