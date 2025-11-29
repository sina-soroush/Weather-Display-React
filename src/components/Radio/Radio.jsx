import './Radio.scss';

const Radio = ({ 
  checked = false,
  onChange,
  name,
  id,
  value,
  className = ''
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`radio ${className}`}>
      <input 
        className="radio__input"
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="radio__btn" htmlFor={radioId}></label>
    </div>
  );
};

export default Radio;
