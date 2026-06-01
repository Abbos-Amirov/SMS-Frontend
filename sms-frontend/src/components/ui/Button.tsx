import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'default' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
  loading?: boolean;
  block?: boolean;
  iconLeft?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn--primary',
  default: '',
  ghost: 'btn--ghost',
  danger: 'btn--danger',
};

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  block = false,
  iconLeft,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    variantClass[variant],
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <span className="btn-spinner" aria-hidden /> : iconLeft}
      {children}
    </button>
  );
}
