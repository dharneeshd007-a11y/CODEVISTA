import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import InputField from './InputField';

export default function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputField
        {...props}
        type={showPassword ? 'text' : 'password'}
      />
      <button
        type="button"
        className="absolute right-3 top-[34px] p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex="-1"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
