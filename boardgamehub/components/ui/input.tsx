import { cn } from '@/lib/utils'

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-50 dark:bg-input/30',
        className
      )}
      {...props}
    />
  )
}

export { Input }
