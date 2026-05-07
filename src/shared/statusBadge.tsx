export function StatusBadge({
  label,
  value,
  isGood,
}: {
  label: string;
  value: string | boolean | number;
  isGood?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-600 dark:text-gray-400">{label}:</span>
      <span
        className={`font-medium ${
          isGood !== undefined
            ? isGood
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
            : "text-gray-800 dark:text-gray-300"
        }`}
      >
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
}
