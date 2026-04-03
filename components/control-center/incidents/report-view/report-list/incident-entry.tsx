'use client';

interface IncidentButtonProps {
  id: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

export function IncidentEntry({
  id,
  isSelected = false,
  onClick,
}: IncidentButtonProps) {
  return (
    <button
      onClick={() => onClick?.(id)}
      className={`w-full px-4 py-2 text-left rounded-md font-medium transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {id}
    </button>
  );
}

export default IncidentEntry;
