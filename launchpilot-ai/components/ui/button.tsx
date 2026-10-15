import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('btn', {
  variants: {
    variant: { default: '', destructive: '', outline: 'btn-secondary', secondary: 'btn-secondary', ghost: 'btn-ghost', link: 'btn-ghost' },
    size: { default: '', sm: 'btn-small', lg: 'btn-large', icon: 'icon-btn' }
  },
  defaultVariants: { variant: 'default', size: 'default' }
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}/>;
});
Button.displayName = 'Button';
