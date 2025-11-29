import './Input.scss';

const Input = ({ 
  type = 'text',
  value,
  placeholder,
  onChange,
  className = '',
  variant = 'oval-lg',
  ...props 
}) => {
  return (
    <input 
      className={`input ${variant} ${className}`}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      {...props}
    />
  );
};

export default Input;
