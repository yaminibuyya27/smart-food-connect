import React from 'react';

export const Button = ({ children, onClick, className, variant }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className} ${variant === 'ghost' ? 'bg-transparent' : 'bg-blue-500 text-white'}`}>
    {children}
  </button>
);

export const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
export const CardContent = ({ children }) => <div className="p-4">{children}</div>;
export const CardFooter = ({ children }) => <div className="p-4 border-t">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
export const CardDescription = ({ children }) => <p className="text-gray-500">{children}</p>;

export const Input = ({ id, placeholder, onChange, type = 'text' }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    className="w-full px-3 py-2 border rounded"
  />
);

export const Label = ({ htmlFor, children }) => (
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
