import { cn } from "@/lib/utils";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  className?: string;
}

const CircularProgress = ({ percentage, size = 200, className }: CircularProgressProps) => {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  const circumference = 2 * Math.PI * (size / 2 - 12);
  const offset = circumference - (safePercentage / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-blue-100 dark:text-blue-900"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="none"
          stroke="url(#waterGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-blue-700 dark:text-blue-300">
          {safePercentage}%
        </span>
        <span className="text-sm text-blue-500 dark:text-blue-400 mt-1">
          Niveau d'eau
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;