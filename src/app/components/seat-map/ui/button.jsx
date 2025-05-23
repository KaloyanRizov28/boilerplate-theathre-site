// src/components/ui/button.js

import { forwardRef } from 'react'


export const Button = ({ className = '', variant = 'default', size = 'md', children, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: 'bg-white text-black hover:bg-gray-200',
    ghost: 'hover:bg-gray-800',
    outline: 'border border-gray-700 hover:bg-gray-800',
  }
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-8 text-base',
    lg: 'h-12 px-12 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}