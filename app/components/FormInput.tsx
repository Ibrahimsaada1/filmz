'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface FormInputProps {
  id: string
  label: string
  type: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
  autoComplete?: string
}

export function FormInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  autoComplete,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full px-4 py-2 bg-gray-800 border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-red-500 
            ${error ? 'border-red-500' : 'border-gray-700'}
          `}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 