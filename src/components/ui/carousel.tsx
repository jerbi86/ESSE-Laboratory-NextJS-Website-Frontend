"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Orientation = "horizontal" | "vertical"

type CarouselCtx = {
  orientation: Orientation
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  registerContent: (el: HTMLDivElement | null) => void
}

const CarouselContext = React.createContext<CarouselCtx | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("useCarousel must be used within a <Carousel />")
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: Orientation
    opts?: any
  }
>(({ orientation = "horizontal", className, children, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollPrev(scrollLeft > 0)
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

  const scrollBy = React.useCallback((dir: 1 | -1) => {
    const el = contentRef.current
    if (!el) return
    const amount = Math.max(240, Math.min(el.clientWidth * 0.9, 600))
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }, [])

  const scrollPrev = React.useCallback(() => scrollBy(-1), [scrollBy])
  const scrollNext = React.useCallback(() => scrollBy(1), [scrollBy])

  const registerContent = React.useCallback((el: HTMLDivElement | null) => {
    contentRef.current = el
    updateScrollState()
  }, [updateScrollState])

  React.useEffect(() => {
    const el = contentRef.current
    if (!el) return
    updateScrollState()
    const onScroll = () => updateScrollState()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [contentRef, updateScrollState])

  return (
    <CarouselContext.Provider
      value={{
        orientation: orientation || "horizontal",
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        registerContent,
      }}
    >
      <div
        ref={ref}
        className={cn("relative isolate overflow-visible", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, _ref) => {
  const { registerContent } = useCarousel()
  return (
    <div
      ref={registerContent}
      className={cn(
        "flex flex-nowrap items-stretch gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-px-24 md:scroll-px-32 px-16 md:px-24 py-10 md:py-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x select-none",
        className
      )}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "snap-start shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 overflow-visible first:ml-8 md:first:ml-12 last:mr-8 md:last:mr-12",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "hidden sm:flex absolute h-8 w-8 rounded-full z-30",
        orientation === "horizontal"
          ? "left-2 sm:left-0 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "hidden sm:flex absolute h-8 w-8 rounded-full z-30",
        orientation === "horizontal"
          ? "right-2 sm:right-0 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
}
