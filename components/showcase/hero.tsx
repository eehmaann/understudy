import { DoubleRule, Eyebrow, MarqueeBulbs } from '@/components/debut/ornaments'

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="spotlight absolute inset-0 -z-10 animate-spotlight-in" />
      <div aria-hidden="true" className="velvet absolute inset-y-0 left-0 -z-10 w-[8%] opacity-80 md:w-[12%]" />
      <div aria-hidden="true" className="velvet absolute inset-y-0 right-0 -z-10 w-[8%] opacity-80 md:w-[12%]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-10 py-24 text-center sm:py-32">
        <Eyebrow>Now showing · Version 1.0</Eyebrow>
        <h1 id="hero-title" className="font-serif text-display-xl font-medium text-balance sm:text-display-2xl">
          <span className="italic">Debut</span>
        </h1>
        <DoubleRule label="A design system in twenty scenes" className="w-full max-w-md" />
        <p className="max-w-xl text-body-lg text-pretty text-muted-foreground">
          Tokens and components for building 20-slide, 20-second PechaKucha self-introductions — where you are the star,
          and the AI agent is your stage manager in the wings.
        </p>
        <MarqueeBulbs total={20} current={6} label="Example marquee progress" className="justify-center" />
      </div>
    </section>
  )
}
