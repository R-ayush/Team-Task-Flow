import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500/20 text-primary-300 border border-primary-500/30',
        high: 'bg-red-500/20 text-red-300 border border-red-500/30',
        medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        low: 'bg-green-500/20 text-green-300 border border-green-500/30',
        todo: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        in_progress:
          'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        done: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        outline: 'border border-slate-600 text-slate-300',
        admin: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
        member: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
