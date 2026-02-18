const Badge = ({ children, color = 'red' }) => {
  const colors = {
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <span className={`${colors[color]} px-2 py-1 rounded-md text-xs font-bold`}>
      {children}
    </span>
  );
};

export default Badge;
