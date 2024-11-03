import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeControlProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function TimeControl({ value, onChange, readOnly = false }: TimeControlProps) {
  const [time, setTime] = useState(formatTimeForInput(value));

  useEffect(() => {
    setTime(formatTimeForInput(value));
  }, [value]);

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (onChange) {
      const [hours, minutes] = newTime.split(':');
      const date = new Date(value);
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      onChange(date.toISOString());
    }
  };

  return (
    <div className="relative">
      <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
      <input
        type="time"
        value={time}
        onChange={(e) => handleTimeChange(e.target.value)}
        className={`
          w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white
          ${readOnly ? 'cursor-not-allowed opacity-75' : ''}
          [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
          [&::-webkit-time-picker-indicator]:filter [&::-webkit-time-picker-indicator]:invert
        `}
        disabled={readOnly}
      />
    </div>
  );
}

function formatTimeForInput(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}