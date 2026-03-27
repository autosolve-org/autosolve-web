import { type FC, useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { 
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { 
  type ProfileSection, 
  type ProfileField as ProfileFieldType 
} from '../../utils/profileFields';
import { formatLearnedTextarea, normalizeDataLearned, parseLearnedTextarea } from '../../utils/dataLearned';

interface ProfileFormProps {
  activeSection: ProfileSection;
  formData: Record<string, unknown>;
  onFieldChange: (name: string, value: unknown) => void;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (group: string) => void;
  isLocating: boolean;
  onDetectLocation: () => Promise<void>;
  isSaving: boolean;
  showSaveSuccess: boolean;
}

const AutoResizeTextarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [props.value]);

  return (
    <textarea 
      {...props}
      ref={ref}
      rows={1}
      className={`bg-transparent outline-none resize-none overflow-hidden block ${props.className || ''}`}
    />
  );
};

const CustomFieldRow: FC<{ 
  labelKey: string; 
  value: string; 
  onChange: (key: string, val: string) => void;
  onRename: (oldKey: string, newKey: string) => void;
  onDelete: (key: string) => void;
}> = ({ labelKey, value, onChange, onRename, onDelete }) => {
  const [localKey, setLocalKey] = useState(labelKey);

  const handleKeyBlur = () => {
    if (localKey !== labelKey && localKey.trim() !== '') {
      onRename(labelKey, localKey.trim());
    } else {
      setLocalKey(labelKey);
    }
  };

  return (
    <div className="flex relative items-start hover:bg-white/5 -mx-4 px-4 rounded transition-colors group py-1">
      <input 
        type="text"
        value={localKey}
        onChange={e => setLocalKey(e.target.value)}
        onBlur={handleKeyBlur}
        aria-label="Clave de dato"
        placeholder="clave"
        className="text-accent-cyan font-semibold bg-transparent outline-none w-[160px] md:w-[200px] shrink-0 py-1.5 focus:bg-white/5 rounded px-2 -ml-2 transition-colors"
      />
      <span className="text-accent-cyan/50 py-1.5 pr-3 select-none -ml-1">:</span>
      
      <AutoResizeTextarea 
        value={value}
        onChange={e => onChange(labelKey, e.target.value)}
        aria-label={labelKey}
        className="text-white flex-1 py-1.5 min-w-0 placeholder:text-white/10 focus:bg-white/5 rounded px-2 -mx-2 transition-colors"
      />

      <button 
        onClick={() => onDelete(labelKey)} 
        className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 p-1.5 ml-2 transition-opacity h-fit mt-0.5"
        title="Eliminar campo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ProfileForm: FC<ProfileFormProps> = ({
  activeSection,
  formData,
  onFieldChange,
  isLocating,
  onDetectLocation,
  isSaving,
  showSaveSuccess,
}) => {
  // Group fields if section has groups
  const groupedFields: Record<string, ProfileFieldType[]> = {};
  activeSection.fields.forEach(field => {
    const groupName = field.group || 'General';
    if (!groupedFields[groupName]) groupedFields[groupName] = [];
    groupedFields[groupName].push(field);
  });

  const groupKeys = Object.keys(groupedFields);

  // Dynamic Fields
  const customData = normalizeDataLearned(formData.data_learned);
  const customKeys = Object.keys(customData);

  const handleCustomChange = (key: string, val: string) => {
    const options = parseLearnedTextarea(val);
    onFieldChange('data_learned', { ...customData, [key]: options });
    onFieldChange(key, options[0] || undefined);
  };

  const handleCustomRename = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const newData = { ...customData };
    newData[newKey] = newData[oldKey];
    delete newData[oldKey];
    onFieldChange('data_learned', newData);
    onFieldChange(newKey, newData[newKey]?.[0] || undefined);
    // Remove the old flattened entry to prevent it being added back during save
    onFieldChange(oldKey, undefined);
  };

  const handleCustomDelete = (key: string) => {
    const newData = { ...customData };
    delete newData[key];
    onFieldChange('data_learned', newData);
    // Remove the flattened entry that could cause it to be added back during save
    onFieldChange(key, undefined); 
  };

  const [newFieldText, setNewFieldText] = useState('');

  const handleNewFieldKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
       e.preventDefault();
       const val = newFieldText;
       const colonIdx = val.indexOf(':');
       if (colonIdx > 0) {
          const k = val.substring(0, colonIdx).trim();
          const v = val.substring(colonIdx + 1).trim();
          if (k) {
             handleCustomChange(k, v);
             setNewFieldText('');
          }
       }
    }
  };

  return (
    <section className="bg-bg-primary/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden font-mono text-[13px] leading-relaxed relative animate-scale-in">
      {/* OVERLAY */}
      {(isSaving || showSaveSuccess) && (
        <div className="absolute inset-0 z-50 bg-bg-primary/80 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300">
          {isSaving ? (
             <div className="flex flex-col items-center gap-6">
               <div className="w-12 h-12 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin"></div>
               <span className="text-accent-cyan font-bold tracking-[0.2em] font-sans text-sm animate-pulse">GUARDANDO...</span>
             </div>
          ) : (
             <div className="flex flex-col items-center gap-6 animate-scale-in">
               <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                 <Sparkles className="w-6 h-6" />
               </div>
               <span className="text-green-400 font-bold tracking-[0.2em] font-sans text-sm">GUARDADO EXITOSO</span>
             </div>
          )}
        </div>
      )}

      {/* macOS window controls mock */}
      <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2 select-none">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        </div>
        <div className="text-white/30 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 font-sans font-bold flex-1 justify-end">
           PROFILE.MD
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-accent-violet">#</span> {activeSection.id}
          </h1>
          <div className="text-white/40 text-[12px] uppercase tracking-wider font-bold">
            ## {activeSection.description}
          </div>
        </div>

        {groupKeys.map(groupName => (
          <div key={groupName} className="mb-10 last:mb-0">
            {groupKeys.length > 1 && (
              <div className="text-white/20 select-none mb-4 flex items-center gap-2">
                <span className="text-accent-violet hidden md:inline">##</span> {groupName}
              </div>
            )}
            
            <div className="space-y-1">
              {groupedFields[groupName].map(field => (
                <div key={field.name} className="flex relative items-start -mx-4 px-4 rounded transition-colors py-1">
                  {/* Fixed Label - un-deletable text */}
                  <div className="text-accent-violet select-none w-[160px] md:w-[200px] shrink-0 py-1.5 flex items-center font-semibold">
                    {field.label}
                    <span className="text-accent-violet/50 ml-1">:</span>
                  </div>
                  
                  {/* Editable Value */}
                  {field.type === 'textarea' ? (
                    <AutoResizeTextarea 
                      value={(formData[field.name] as string) || ''}
                      onChange={(e) => {
                        onFieldChange(field.name, e.target.value);
                        if (!field.readOnly) {
                          onFieldChange('data_learned', { ...customData, [field.name]: parseLearnedTextarea(e.target.value) });
                        }
                      }}
                      readOnly={!!field.readOnly}
                      placeholder={field.placeholder || `...`}
                      aria-label={field.label}
                      className={`text-white flex-1 py-1.5 min-w-0 placeholder:text-white/10 rounded px-2 -mx-2 transition-colors ${field.readOnly ? 'opacity-70 cursor-not-allowed' : 'focus:bg-white/5'}`}
                    />
                  ) : (
                    <input 
                      type={field.type}
                      value={(formData[field.name] as string) || ''}
                      onChange={(e) => {
                        onFieldChange(field.name, e.target.value);
                        if (!field.readOnly) {
                          onFieldChange('data_learned', { ...customData, [field.name]: parseLearnedTextarea(e.target.value) });
                        }
                      }}
                      readOnly={!!field.readOnly}
                      placeholder={field.placeholder || `...`}
                      aria-label={field.label}
                      className={`text-white flex-1 py-1.5 min-w-0 placeholder:text-white/10 rounded px-2 -mx-2 transition-colors bg-transparent outline-none ${field.readOnly ? 'opacity-70 cursor-not-allowed' : 'focus:bg-white/5'}`}
                    />
                  )}
                  
                  {field.required && (
                    <div className="absolute right-0 top-3 opacity-30 select-none text-[10px] text-red-400 pr-2 pointer-events-none">
                      required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}


        {/* JSONB / Dynamic Extra Information */}
        <div className="mt-10 pt-8 border-t border-white/5 relative">
          <div className="text-white/20 select-none mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white/10 font-bold tracking-wider">//</span>
              <span className="ml-1 font-sans italic text-white/50">Info Adicional</span>
            </div>
            
            <button 
              onClick={onDetectLocation} 
              disabled={isLocating}
              className="text-accent-cyan flex items-center gap-2 hover:bg-accent-cyan/10 px-3 py-1.5 rounded-lg transition-all bg-accent-cyan/5 border border-accent-cyan/20 w-fit shadow-lg shadow-accent-cyan/5 font-sans font-medium text-[11px]"
            >
               {isLocating ? <Sparkles className="w-3 h-3 animate-spin"/> : <MapPin className="w-3 h-3"/>}
               {isLocating ? 'Detectando...' : 'Autocompletar Ubicación'}
            </button>
          </div>

          <div className="space-y-1">
            {customKeys.map(key => (
               <CustomFieldRow 
                 key={key} 
                 labelKey={key} 
                 value={formatLearnedTextarea(customData[key])} 
                 onChange={handleCustomChange}
                 onRename={handleCustomRename}
                 onDelete={handleCustomDelete}
               />
            ))}

            {/* New Line Input */}
             <div className="flex relative items-start mt-4 bg-black/20 border border-dashed border-white/10 rounded-lg p-2.5 hover:border-accent-cyan/30 transition-colors focus-within:border-accent-cyan/50 focus-within:bg-accent-cyan/5">
                <div className="text-accent-cyan/50 select-none shrink-0 mr-3 flex items-center font-bold">
                   +
                </div>
                <input 
                  type="text"
                  className="bg-transparent text-white outline-none flex-1 placeholder:text-white/20 text-sm"
                  placeholder="Ejemplo: 'Disponibilidad: Inmediata' y presiona Enter..."
                  value={newFieldText}
                  onChange={(e) => setNewFieldText(e.target.value)}
                  onKeyDown={handleNewFieldKeyDown}
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
