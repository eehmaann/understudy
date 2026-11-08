import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-md bg-muted bg-[linear-gradient(100deg,transparent_35%,color-mix(in_oklab,var(--gold)_18%,transparent)_50%,transparent_65%)] bg-size-[200%_100%]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
