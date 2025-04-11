
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  progress: number;
  formatTime: (seconds: number) => string;
  handleProgressChange: (value: number[]) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  progress,
  formatTime,
  handleProgressChange
}) => {
  return (
    <div className="w-full max-w-lg mb-6">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Slider
        value={[progress]}
        min={0}
        max={100}
        step={0.1}
        onValueChange={handleProgressChange}
        className="w-full"
      />
    </div>
  );
};

export default ProgressBar;
