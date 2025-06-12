import React from 'react';

const Input = ({ as = 'input', value, onChange, placeholder, className = '', rows, ...props }) => {
  const commonProps = {
    value,
    onChange,
    placeholder,
    className: `w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${className}`,
    ...props,
  };

  if (as === 'textarea') {
    return <textarea {...commonProps} rows={rows} />;
  }
  return <input {...commonProps} type={props.type || 'text'} />;
};

export default Input;