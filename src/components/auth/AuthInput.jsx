const stateStyles = {
  default:
    'border-stone-300 focus:border-emerald-700 focus:ring-emerald-100 dark:border-zinc-700 dark:focus:border-emerald-600 dark:focus:ring-emerald-950',
  error:
    'border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-950',
  success:
    'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-100 dark:border-emerald-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950',
}

export default function AuthInput({
  id,
  label,
  type = 'text',
  placeholder,
  helperText,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  rightAction,
  value,
  onChange,
  onBlur,
  autoComplete,
}) {
  const inputState = error ? 'error' : success ? 'success' : 'default'
  const describedBy = error
    ? `${id}-error`
    : helperText
      ? `${id}-helper`
      : undefined

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-stone-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 sm:text-base ${icon ? 'pl-10' : ''} ${rightAction ? 'pr-16' : ''} ${stateStyles[inputState]}`}
        />

        {rightAction && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightAction}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${id}-helper`} className="text-sm text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      )}

      {!error && success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
      )}
    </div>
  )
}
