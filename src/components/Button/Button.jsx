import './Button.scss';

const Button = ({ 
  children, 
  variant = 'oval-lg', 
  icon, 
  iconPosition = 'right',
  onClick,
  className = '',
  ...props 
}) => {
  const renderContent = () => {
    if (variant === 'icon-btn') {
      return icon;
    }
    
    if (icon) {
      return iconPosition === 'left' ? (
        <>
          {icon}
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {children && <span>{children}</span>}
          {icon}
        </>
      );
    }
    
    return children;
  };

  return (
    <button 
      className={`button ${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
