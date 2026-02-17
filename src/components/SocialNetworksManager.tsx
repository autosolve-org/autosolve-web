import { useState } from 'react';
import { 
  Plus, X, Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { InfoIcon } from 'lucide-react';

interface SocialNetwork {
  platform: string;
  url: string;
}

interface SocialNetworksManagerProps {
  value: SocialNetwork[];
  onChange: (val: SocialNetwork[]) => void;
}

export const SocialNetworksManager = ({ value, onChange }: SocialNetworksManagerProps) => {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/', placeholder: 'usuario' },
    { value: 'github', label: 'GitHub', prefix: 'https://github.com/', placeholder: 'usuario' },
    { value: 'portfolio', label: 'Portafolio', prefix: 'https://', placeholder: 'www.ejemplo.com' },
    { value: 'other', label: 'Otro', prefix: 'https://', placeholder: 'www.ejemplo.com' }
  ];

  const handleAdd = () => {
    if (platform && url) {
      // Ensure URL has prefix if not present??
      // User requested InputGroup usage where prefix is visual.
      // We store full URL? Or just the part typed?
      // Usually full URL is better for data.
      // Let's prepend prefix if missing.
      let finalUrl = url;
      const currentP = platforms.find(p => p.value === platform);
      if (currentP && !url.startsWith('http')) {
         finalUrl = currentP.prefix + url;
      }
      
      onChange([...value, { platform, url: finalUrl }]);
      setPlatform('');
      setUrl('');
    }
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const currentPlatform = platforms.find(p => p.value === platform);

  // Update placeholder based on platform
  // But we want to show prefix in InputGroupAddon
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
         {/* Platform Select */}
         <div className="w-[140px] shrink-0">
           <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full bg-bg-tertiary/50 border-white/10 h-10 rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Red Social" />
              </SelectTrigger>
              <SelectContent className="bg-bg-elevated border-white/10 text-white">
                {platforms.map(p => (
                  <SelectItem key={p.value} value={p.value} className="cursor-pointer">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
           </Select>
         </div>

         {/* URL Input Group */}
         <div className="flex-1 min-w-0">
             <InputGroup className="relative">
                {/* Prefix Addon */}
                <InputGroupAddon className="bg-bg-elevated border-white/10 text-text-muted px-3 rounded-l-none border-l-0 h-10">
                      {currentPlatform?.prefix || 'https://'}
                </InputGroupAddon>
                
                {/* Main Input */}
                <InputGroupInput 
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder={currentPlatform?.placeholder || "www.ejemplo.com"}
                   className="bg-bg-tertiary/50 border-white/10 focus:z-10 flex-1 h-10 rounded-l-none rounded-r-none border-l-0 border-r-0"
                />
                
                {/* Info Icon Addon (Visual Flair as requested) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                   {platform && <InfoIcon className="w-4 h-4 opacity-50" />}
                </div>
             </InputGroup>
         </div>
         
         <Button 
           onClick={handleAdd}
           disabled={!platform || !url}
           size="icon"
           className="bg-accent-violet hover:bg-accent-violet/80 h-10 w-10 shrink-0 rounded-l-none shadow-lg shadow-accent-violet/10"
         >
           <Plus className="w-5 h-5" />
         </Button>
      </div>

      {/* List of added networks */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
            {value.map((item, index) => {
               const p = platforms.find(pl => pl.value === item.platform);
               return (
                 <div key={index} className="flex items-center gap-2 bg-bg-elevated border border-white/10 rounded-full pl-3 pr-1 py-1 text-xs text-text-secondary group hover:border-accent-violet/30 transition-all hover:bg-bg-elevated/80 hover:shadow-glow">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="cursor-pointer hover:scale-110 transition-transform"
                      title="Abrir enlace"
                    >
                      <LinkIcon className="w-3 h-3 text-accent-cyan" />
                    </a>
                    <span className="font-bold text-white tracking-wide">{p?.label || item.platform}</span>
                    <span className="w-px h-3 bg-white/10 mx-1" />
                    <span className="truncate max-w-[150px] opacity-70 font-mono">
                      {item.url.replace(p?.prefix || 'https://', '')}
                    </span>
                    <button onClick={() => handleRemove(index)} className="ml-1 p-1 hover:bg-red-500/10 rounded-full text-text-muted hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                 </div>
               );
            })}
        </div>
      )}
    </div>
  );
};
