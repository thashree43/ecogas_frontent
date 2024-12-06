
const LOGO = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 150"
    className="h-16 w-auto"
  >
    <defs>
      <linearGradient id="eco-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#2E7D32" />
      </linearGradient>
      <linearGradient id="flame-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#81C784" />
        <stop offset="100%" stopColor="#A5D6A7" />
      </linearGradient>
    </defs>
    
    {/* Flame and Gas Cylinder */}
    <g transform="translate(20, 20)">
      <path 
        d="M30 100 
           Q50 70, 40 50 
           C35 30, 50 10, 60 0 
           Q70 10, 65 30 
           Q60 50, 80 60 
           Q90 70, 70 90 
           Q50 110, 30 100" 
        fill="url(#flame-gradient)" 
      />
      
      <rect 
        x="10" 
        y="50" 
        width="80" 
        height="100" 
        rx="10" 
        ry="10" 
        fill="url(#eco-gradient)" 
        stroke="#2E7D32" 
        strokeWidth="3"
      />
    </g>
    
    {/* Text */}
    <text 
      x="150" 
      y="100" 
      fontFamily="Arial, sans-serif" 
      fontSize="48" 
      fontWeight="bold" 
      fill="#2E7D32"
    >
      <tspan x="150" textAnchor="middle" dy="0">ECO</tspan>
      <tspan x="150" textAnchor="middle" dy="50">GAS</tspan>
    </text>
  </svg>
);

export default LOGO;