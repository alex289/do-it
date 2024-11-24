import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<SVGElement> {
  size?: number;
}

export function Spinner({ size = 24, className, ...props }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn('animate-spin text-primary', className)}
      {...props}
    />
  );
}
