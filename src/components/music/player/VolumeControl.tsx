
import React from 'react';
import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  volume: number;
  handleVolumeChange: (value: number[]) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  handleVolumeChange
}) => {
  return (
    <div className="flex items-center space-x-2 w-full max-w-xs">
      <Volume2 className="h-4 w-4 text-muted-foreground" />
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className="w-full"
      />
    </div>
  );
};

export default VolumeControl;
