import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: number;
  icon?: ReactNode;
  loading?: boolean;
}

export default function SummaryCard({
  title,
  value,
  subValue,
  change,
  icon,
  loading = false,
}: SummaryCardProps) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <div className="flex items-baseline">
              {loading ? (
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                  {subValue && (
                    <p className="ml-2 text-sm font-medium text-gray-500">{subValue}</p>
                  )}
                </>
              )}
            </div>
            {typeof change !== 'undefined' && (
              <div className="flex items-baseline mt-1">
                <div
                  className={`text-sm font-semibold ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
                </div>
                <div className="ml-1 text-xs text-gray-500">from last month</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 