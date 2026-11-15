import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

const fieldBase = [
  'w-full rounded-[var(--radius-control)] border border-white/12 bg-white/[0.04]',
  'text-paper placeholder:text-paper-faint',
  'transition-[border-color,background-color,box-shadow] duration-150',
  'focus:border-sky/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(141,185,240,0.16)]',
  'focus:outline-none',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: ReactNode
  /** Rendered after the field, e.g. a clear button. */
  trailing?: ReactNode
}

export function Input({ label, hint, error, icon, trailing, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-paper">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-paper-faint" aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={[
            fieldBase,
            'h-11 px-3.5 text-sm',
            icon ? 'pl-10' : '',
            trailing ? 'pr-11' : '',
            error ? 'border-sky/70' : '',
            className,
          ].join(' ')}
          {...rest}
        />
        {trailing && (
          <span className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</span>
        )}
      </div>
      {error ? (
        <span className="text-xs text-sky" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-paper-faint">{hint}</span>
      ) : null}
    </div>
  )
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export function Textarea({ label, hint, id, className = '', ...rest }: TextareaProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-paper">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[fieldBase, 'min-h-28 resize-y px-3.5 py-2.5 text-sm', className].join(' ')}
        {...rest}
      />
      {hint && <span className="text-xs text-paper-faint">{hint}</span>}
    </div>
  )
}
