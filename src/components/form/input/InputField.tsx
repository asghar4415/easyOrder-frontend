import React, { FC, InputHTMLAttributes } from "react";

// 1. Single Interface that extends standard HTML attributes
// This automatically includes 'value', 'onChange', 'onBlur', 'id', 'name', etc.
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input: FC<InputProps> = ({
  className = "",
  success = false,
  error = false,
  hint,
  type = "text",
  disabled = false,
  ...props // 2. "props" collects everything else: value, onChange, placeholder, etc.
}) => {
  
  // Base styles
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 transition-all dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  // State-based styles
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="w-full relative">
      <input
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...props} // 3. IMPORTANT: Spread props here. This applies 'value', 'onChange', etc.
      />

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs font-medium ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;