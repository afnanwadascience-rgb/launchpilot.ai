import * as React from 'react';
import { cn } from '@/lib/utils';
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(({ className, ...props }, ref) => <textarea className={cn('control', className)} ref={ref} {...props}/>);
Textarea.displayName = 'Textarea';
