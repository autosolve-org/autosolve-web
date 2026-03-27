import { type FC, type ChangeEvent } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { type ProfileField as ProfileFieldType } from '../../utils/profileFields';

// UI Components
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { PhoneInput } from '../ui/phone-input';

interface ProfileFieldProps {
  field: ProfileFieldType;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

export const ProfileField: FC<ProfileFieldProps> = ({ field, value, onChange }) => {
  const isFullWidth = field.type === 'textarea' || field.type === 'social';

  return (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''} group/field space-y-2`}>
      <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted group-focus-within/field:text-accent-violet transition-colors flex items-center gap-1">
        {field.label} {field.required && <span className="text-accent-cyan">*</span>}
      </label>
      
      {field.type === 'textarea' ? (
        <div className="relative group/textarea">
          <Textarea
            className="bg-bg-tertiary/50 border-white/10 min-h-[120px] focus:border-accent-violet/50 resize-y pb-8"
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(field.name, e.target.value)}
            maxLength={field.maxLength || 500}
          />
          <div className="absolute bottom-2 right-2 flex items-center justify-end gap-2 pointer-events-none">
            <span className="text-[10px] text-text-muted bg-bg-elevated/80 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
              {((value as string) || '').length} / {field.maxLength || 500}
            </span>
          </div>
        </div>
      ) : field.type === 'select' ? (
        <Select
          value={(value as string) || ''}
          onValueChange={(val) => onChange(field.name, val)}
        >
          <SelectTrigger className="bg-bg-tertiary/50 border-white/10 text-text-primary focus:ring-accent-violet/20">
            <SelectValue placeholder={field.placeholder || "Seleccionar"} />
          </SelectTrigger>
          <SelectContent className="bg-bg-elevated border-white/10 text-text-primary">
            {field.options?.map(opt => (
              <SelectItem key={opt} value={opt} className="focus:bg-bg-tertiary focus:text-accent-violet cursor-pointer">
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === 'date' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-bg-tertiary/50 border-white/10 hover:bg-bg-tertiary hover:text-white",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value as string), "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-bg-elevated border-white/10" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value as string) : undefined}
              onSelect={(date) => onChange(field.name, date?.toISOString() || '')}
              initialFocus
              className="p-3 pointer-events-auto"
              classNames={{
                day_selected: "bg-accent-violet text-white hover:bg-accent-violet hover:text-white focus:bg-accent-violet focus:text-white",
                day_today: "bg-white/10 text-white",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-md transition-colors text-white",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              }}
            />
          </PopoverContent>
        </Popover>
      ) : field.type === 'tel' ? (
         <PhoneInput 
            value={(value as string) || ''}
            onChange={(val) => onChange(field.name, val)}
            placeholder={field.placeholder}
            className="bg-bg-tertiary/50 border-white/10 focus:border-accent-violet/50 h-10"
         />
      ) : (
        <Input
          type={field.type}
          className="bg-bg-tertiary/50 border-white/10 focus:border-accent-violet/50"
          placeholder={field.placeholder}
          value={(value as string) || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field.name, e.target.value)}
        />
      )}
    </div>
  );
};
