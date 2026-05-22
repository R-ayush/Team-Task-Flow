import { cn } from '../../lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('rounded-lg bg-slate-700/50 animate-pulse', className)}
      {...props}
    />
  )
}

export { Skeleton }
