import './ProgressBar.scss';

const ProgressBar = ({ 
  progress = 40,
  showLabel = true,
  className = ''
}) => {
  return (
    <div className={`progress ${className}`}>
      <div 
        className="progress__fill"
        style={{ width: `${progress}%` }}
      >
        {showLabel && (
          <span className="progress__label">{progress}%</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
