export function TypeBadge({ typeLabel }: { typeLabel: string }) {
  return (
    <span className="text-[10px] font-mono px-1 py-0.5 rounded shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
      {typeLabel}
    </span>
  );
}
