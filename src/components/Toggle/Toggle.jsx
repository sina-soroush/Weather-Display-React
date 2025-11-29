import { useState } from 'react';
import './Toggle.scss';

const Toggle = ({ 
  checked = false, 
  onChange,
  id,
  className = ''
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  
  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`toggle ${className}`}>
      <input 
        className="toggle__input" 
        id={toggleId}
        type="checkbox" 
        checked={isChecked}
        onChange={handleChange}
      />
      <label className="toggle__switch" htmlFor={toggleId}></label>
    </div>
  );
};

export default Toggle;
