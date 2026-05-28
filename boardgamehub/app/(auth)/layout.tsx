import { Dices } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px]">
      {/* Left branding panel — desktop only */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[oklch(0.06_0.02_265)] p-10">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(oklch(0.62_0.28_272_/_0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62_0.28_272_/_0.05) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Dices className="size-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold tracking-tight text-base">BoardGameHub</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Board game tracking, reinvented
          </div>
          <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
            Your board game<br />
            <span className="text-primary">command center.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
            Track your collection, log every match, and see who truly rules the table.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 flex gap-8 pt-6 border-t border-white/5">
          {[
            { label: 'Collection', desc: 'Every game you own' },
            { label: 'Matches', desc: 'Results & scores' },
            { label: 'Stats', desc: 'Who wins the most' },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-sm font-semibold text-foreground/80">{f.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col min-h-screen border-l border-border/40 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-4 border-b border-border/50">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
            <Dices className="size-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold tracking-tight">BoardGameHub</span>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[380px]">{children}</div>
        </div>

        <p className="pb-6 text-center text-xs text-muted-foreground/40">
          © 2026 BoardGameHub
        </p>
      </div>
    </div>
  )
}
