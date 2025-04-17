
import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';

interface VolumeControlProps {
  volume: number;
  handleVolumeChange: (value: number[]) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  handleVolumeChange
}) => {
  const [lastToastTime, setLastToastTime] = useState(0);
  
  // Debounced volume change handler to avoid too many toasts
  const handleVolumeChangeWithFeedback = (value: number[]) => {
    handleVolumeChange(value);
    
    // Show toast only once every 2 seconds to avoid spamming
    const now = Date.now();
    if (now - lastToastTime > 2000) {
      toast({
        title: "Volume saved",
        description: `Your volume preference (${value[0]}%) has been saved.`,
        duration: 1500,
      });
      setLastToastTime(now);
    }
  };

  return (
    <div className="flex items-center space-x-2 w-full max-w-xs">
      <Volume2 className="h-4 w-4 text-muted-foreground" />
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleVolumeChangeWithFeedback}
        className="w-full"
      />
    </div>
  );
};

export default VolumeControl;
