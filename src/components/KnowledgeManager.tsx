import { useState } from 'react';
import { 
  Plus, X, Hash, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface KnowledgePattern {
  key: string;
  value: string;
}

interface KnowledgeManagerProps {
  value: KnowledgePattern[];
  onChange: (val: KnowledgePattern[]) => void;
}

export const KnowledgeManager = ({ value, onChange }: KnowledgeManagerProps) => {
  const [key, setKey] = useState('');
  const [val, setVal] = useState('');

  const handleAdd = () => {
    if (key && val) {
      onChange([...value, { key: key.trim(), value: val.trim() }]);
      setKey('');
      setVal('');
    }
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
         {/* Key/Pattern Input */}
         <div className="relative flex-1 min-w-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-cyan/50">
              <Hash className="w-3.5 h-3.5" />
            </div>
            <Input 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Etiqueta o Patrón (ej: Twitter, Pasaporte, Alias)"
              className="bg-bg-tertiary/50 border-white/10 pl-9 h-10 focus:border-accent-cyan/50 transition-all rounded-xl sm:rounded-r-none border-r-0"
            />
         </div>

         {/* Value Input */}
         <div className="relative flex-[1.5] min-w-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-cyan/50">
               <Database className="w-3.5 h-3.5" />
            </div>
            <Input 
               value={val}
               onChange={(e) => setVal(e.target.value)}
               placeholder="Valor (ej: @juanperez, A1234567, Juani)"
               className="bg-bg-tertiary/50 border-white/10 pl-9 h-10 focus:border-accent-cyan/50 transition-all rounded-xl sm:rounded-l-none"
            />
         </div>
         
         <Button 
           onClick={handleAdd}
           disabled={!key || !val}
           size="icon"
           className="bg-accent-cyan hover:bg-accent-cyan/80 text-bg-primary h-10 w-10 shrink-0 rounded-xl shadow-lg shadow-accent-cyan/10 transition-all hover:scale-105"
         >
           <Plus className="w-5 h-5" />
         </Button>
      </div>

      {/* List of knowledge items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
            {value.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-bg-elevated border border-white/10 rounded-full pl-3 pr-1 py-1 text-xs text-text-secondary group hover:border-accent-cyan/30 transition-all hover:bg-bg-elevated/80 hover:shadow-glow">
                <span className="font-bold text-accent-cyan tracking-wide">{item.key}:</span>
                <span className="truncate max-w-[200px] text-white opacity-90 font-mono italic">
                  {item.value}
                </span>
                <button 
                  onClick={() => handleRemove(index)} 
                  className="ml-1 p-1 hover:bg-red-500/10 rounded-full text-text-muted hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
