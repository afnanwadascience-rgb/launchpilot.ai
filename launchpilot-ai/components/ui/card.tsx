import * as React from 'react';
import { cn } from '@/lib/utils';
export function Card({ className, ...props }: React.ComponentProps<'div'>) { return <div className={cn('panel', className)} {...props}/>; }
export function CardHeader({ className, ...props }: React.ComponentProps<'div'>) { return <div className={cn('panel-head', className)} {...props}/>; }
export function CardContent({ className, ...props }: React.ComponentProps<'div'>) { return <div className={cn('panel-body', className)} {...props}/>; }
