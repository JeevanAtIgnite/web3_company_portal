import { useState, useRef, useEffect } from 'react';
import { ChevronDown, UserCog, Check } from 'lucide-react';
import type { Persona, PersonaId } from '../types';

interface Props {
  personas: Persona[];
  selectedPersona: Persona;
  onPersonaChange: (id: PersonaId) => void;
}

export function PersonaSwitcher({ personas, selectedPersona, onPersonaChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <UserCog className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className="text-slate-700 font-medium">{selectedPersona.label}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedPersona.badgeColor}`}
        >
          {selectedPersona.avatarInitials}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-enter absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
          <div className="px-3 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Switch Persona
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Demo only — simulates role-based access control
            </p>
          </div>

          {personas.map((persona) => {
            const isSelected = persona.id === selectedPersona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  onPersonaChange(persona.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left ${
                  isSelected ? 'bg-slate-50' : ''
                }`}
              >
                <span
                  className={`inline-flex text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 mt-0.5 ${persona.badgeColor}`}
                >
                  {persona.avatarInitials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{persona.label}</p>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">{persona.description}</p>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
