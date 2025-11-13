import { useState, useEffect } from 'react';

const MOTIVATIONAL_MESSAGES = [
  "Stay focused!",
  "You're doing great!",
  "Keep up the momentum!",
  "Time well spent is life well lived!",
  "Focus on what matters!",
  "Every second counts!",
];

interface ClockProps {
  totalTimeToday: number;
}

export const Clock = ({ totalTimeToday }: ClockProps) => {
  const [time, setTime] = useState(new Date());
  const [message] = useState(
    MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {formatTime(time)}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {formatDate(time)}
            </p>
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-lg font-semibold text-primary mt-1">
              Today: {formatDuration(totalTimeToday)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
