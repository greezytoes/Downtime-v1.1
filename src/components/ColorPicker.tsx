import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

export function ColorPicker() {
  const { glassColor, setGlassColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition-colors"
      >
        <Settings className="h-6 w-6" />
      </button>

      {isOpen && (
        <GlassCard className="absolute bottom-full right-0 mb-4 p-4 w-64">
          <h3 className="text-white font-medium mb-3">Glass Background Color</h3>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={glassColor}
              onChange={(e) => setGlassColor(e.target.value)}
              className="h-8 w-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={glassColor}
              onChange={(e) => setGlassColor(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1 text-white text-sm"
            />
          </div>
        </GlassCard>
      )}
    </div>
  );
}