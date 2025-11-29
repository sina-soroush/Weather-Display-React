import './Graph.scss';

const Graph = ({ 
  data = [58, 80, 45, 83, 66],
  className = ''
}) => {
  return (
    <div className={`graph spaced-container ${className}`}>
      {data.map((value, index) => (
        <div 
          key={index}
          className="graph__line"
          style={{
            height: `${value}%`
          }}
        >
          <div 
            className="graph__fill"
            style={{
              height: `${Math.max(value - 8, 0)}%`
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Graph;
