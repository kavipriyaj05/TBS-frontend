// ═══ FILE: src/components/shared/LoadingSpinner.jsx ═══
// Reusable loading spinner with optional text — shared component
const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm'
    : 'flex items-center justify-center py-20';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-gray-700 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-3 border-transparent border-t-rose-500 rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
