import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Needs Verification', label: 'Needs Verification', icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { value: 'Under Review', label: 'Under Review', icon: Clock, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { value: 'Resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
];

export default function ConflictStatus({ status, onChange, interactive = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0];
  const Icon = currentOption.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!interactive) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentOption.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {currentOption.label}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-dark focus:ring-brand-500 ${currentOption.color}`}
        title="Click to change conflict status"
      >
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        <Icon className="w-3.5 h-3.5" />
        <span>{currentOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-card border border-surface-border shadow-2xl py-1 z-30 animate-fade-in backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-surface-border/50">
            Change Status
          </div>
          {STATUS_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = option.value === status;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (onChange) onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-slate-300 hover:bg-surface-border/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <OptionIcon className="w-3.5 h-3.5" />
                  <span>{option.label}</span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
