'use client'
import { useState, useEffect } from "react";
import styles from './styles.module.css';
import { MessageBubble } from '../components/MessageBubble';
import { AvailabilityPanel } from '../components/AvailabilityPanel';
import { MessageInputForm } from '../components/MessageInputForm';
import { Header } from '../components/Header';
import Confetti from 'react-confetti';
import availabilityData from '../config/availability.json';
import systemPrompt from '../config/system-prompt.json';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ 
    content: string; 
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<Record<string, any>>({});
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setAvailability(availabilityData);

    const formattedPrompt = [
      `Role: ${systemPrompt.role}`,
      `Primary Task: ${systemPrompt.primaryInstruction}`,
      "",
      "Core Responsibilities:",
      ...systemPrompt.coreResponsibilities.map(r => `- ${r}`),
      "",
      "Available Tools:",
      `- Schedule Command: ${systemPrompt.tools.schedule.command}`,
      "  Requirements:",
      ...systemPrompt.tools.schedule.requirements.map(r => `  * ${r}`),
      `  Example: ${systemPrompt.tools.schedule.example}`,
      "",
      "Current Availability Data:",
      JSON.stringify(availabilityData, null, 2)
    ].join('\n');

    setMessages(prev => [{
      content: formattedPrompt,
      role: 'system' as const,
      timestamp: new Date()
    }, ...prev]);
  }, []);

  useEffect(() => {
    if (hasShownConfetti) return;

    // Only check non-system messages for bookings
    const hasBooking = messages.some(msg => 
      msg.role !== 'system' && (
        msg.content.includes('[BOOKING SCHEDULED]') || 
        msg.content.includes('!schedule(')
      )
    );

    if (hasBooking) {
      setHasShownConfetti(true);
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messages, hasShownConfetti]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || Object.keys(availability).length === 0) return;
    
    // Add user message immediately
    const userMessage = {
      content: input,
      role: 'user' as const,
      timestamp: new Date()
    };
    
    setIsLoading(true);
    setInput('');
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [
            ...messages, 
            userMessage
          ].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get bot response', { cause: data.details });
      }

      const botMessage = {
        content: data.response ?? 'No response from server',
        role: 'assistant' as const,
        timestamp: new Date(),
        error: data.error ? data.error : undefined
      };
      setMessages(prev => [...prev, botMessage]);

      // Send email notification if booking occurred
      if (botMessage.content?.includes('!schedule(')) {
        const match = botMessage.content.match(/!schedule\(([^,]+),/);
        if (match) {
          const workerName = match[1];
          const worker = availabilityData[workerName as keyof typeof availabilityData];
          
          if (worker?.email) {
            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                workerName: workerName,
                details: botMessage.content
              })
            }).catch(console.error);
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `${error.message}${error.cause ? ` (${error.cause})` : ''}`
        : 'Failed to process message';

      const botMessage = {
        content: `Error: ${errorMessage}`,
        role: 'assistant' as const,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : undefined
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.layoutContainer}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <Header title="Scheduler Bot" />
      
      <main className={styles.mainContent}>
        <div className={styles.responseScrollContainer}>
          {messages
            .filter(msg => msg.role !== 'system')
            .map((message, index) => (
              <MessageBubble
                key={index}
                message={{
                  ...message,
                  content: message.content?.replace(
                    /!schedule\([^)]+\)/g, 
                    '[BOOKING SCHEDULED]'
                  ) ?? 'Error loading message content'
                }}
                isUser={message.role === 'user'}
              />
            ))}
        </div>

        <div className={styles.calendarSidebar} style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {Object.entries(availability).map(([name, data]) => (
            <AvailabilityPanel
              key={name}
              name={name}
              availability={data.availability}
            />
          ))}
        </div>

        <MessageInputForm
          input={input}
          isLoading={isLoading}
          hasAvailability={Object.keys(availability).length > 0}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
