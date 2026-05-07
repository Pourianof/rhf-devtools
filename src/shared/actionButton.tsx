export function ActionButton({
  onClick,
  label,
  icon: Icon,
  variant = "outline",
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  icon?: React.FC<{ className: string }>;
  variant?: "outline" | "danger" | "primary" | "success";
  disabled?: boolean;
}) {
  const variants = {
    outline:
      "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white border-none",
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white border-none",
    success: "bg-green-500 hover:bg-green-600 text-white border-none",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200
        flex items-center gap-1.5
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
