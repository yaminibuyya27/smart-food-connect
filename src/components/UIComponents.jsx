import React from 'react';

export const Button = ({ children, disabled = false, onClick, className, variant }) => (
  <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded ${className} ${variant === 'ghost' ? 'bg-transparent' : 'bg-blue-500 text-white'}`}>
    {children}
  </button>
);

export const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }) => <div className={`p-4 border-b ${className}`}>{children}</div>;
export const CardContent = ({ children, className = '' }) => <div className={`p-4 ${className}`}>{children}</div>;
export const CardFooter = ({ children, className = '' }) => <div className={`p-4 border-t ${className}`}>{children}</div>;
export const CardTitle = ({ children, className = '' }) => <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
export const CardDescription = ({ children, className = '' }) => <p className={`text-gray-500 ${className}`}>{children}</p>;

export const Input = ({ id, value, disabled, placeholder, onChange, type = 'text' }) => (
  <input
    id={id}
    value={value}
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    disabled={disabled}
    className="w-full px-3 py-2 border rounded"
  />
);

export const Label = ({ htmlFor = null, children }) => (
  <label htmlFor={htmlFor} className="block mb-1">
    {children}
  </label>
);

export const RadioGroup = ({ children }) => <div className="space-y-2">{children}</div>;
export const RadioGroupItem = ({ id, value, name, handleOptionChange }) => (
  <input type="radio" id={id} name={name} value={value} onChange={handleOptionChange} className="mr-2" />
);

export const Select = ({ children, onValueChange }) => (
  <select onChange={(e) => onValueChange(e.target.value)} className="w-full px-3 py-2 border rounded">
    {children}
  </select>
);

export const SelectTrigger = ({ children }) => <div>{children}</div>;
export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

export const Badge = ({ children, className, variant }) => {
  const variantStyles = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800',
    warning: 'bg-orange-100 text-orange-800',
    success: 'bg-green-100 text-green-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant] || variantStyles.default} ${className || ''}`}>
      {children}
    </span>
  );
};
