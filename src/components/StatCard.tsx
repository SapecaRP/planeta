import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color?: 'blue' | 'orange' | 'green';
}

export function StatCard({ title, value, color = 'blue' }: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return 'text-orange-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
        {title}
      </div>
      <div className={`text-3xl font-bold ${getColorClasses(color)}`}>
        {value}
      </div>
    </div>
  );
}