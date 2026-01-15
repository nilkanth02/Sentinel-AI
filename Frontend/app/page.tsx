'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  FileText,
  Filter,
  Shield,
  ShieldCheck,
  Waypoints,
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const sectionFade = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Design intent: the landing should feel like an engineering console entry point, not a consumer marketing page. */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter:blur(0.75px)]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">SentinelAI</div>
              <div className="text-xs text-muted-foreground">AI Safety Console</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Landing page">
            <Link href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How it works
            </Link>
            <Link href="#capabilities" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Capabilities
            </Link>
            <Link href="#preview" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Product preview
            </Link>
            <Link href="#trust" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Why SentinelAI
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/logs">View risk logs</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Open console
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 pb-14 pt-14 sm:pb-20 sm:pt-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-5 lg:col-span-6"
            >
              <motion.div variants={sectionFade}>
                <Badge variant="secondary" className="font-mono">
                  Production AI risk monitoring
                </Badge>
              </motion.div>
              <motion.h1 variants={sectionFade} className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Understand and control AI risk in production.
              </motion.h1>
              <motion.p variants={sectionFade} className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                SentinelAI observes AI interactions, scores risk, and produces investigation-ready logs so engineering teams can
                audit decisions, explain outcomes, and respond quickly.
              </motion.p>
              <motion.div variants={sectionFade} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Enter the console
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#preview">See a preview</Link>
                </Button>
              </motion.div>

              <motion.div variants={sectionFade} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-card/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Outcome</div>
                  <div className="mt-1 text-sm font-medium text-foreground">Actionable investigations</div>
                </div>
                <div className="rounded-lg border bg-card/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Workflow</div>
                  <div className="mt-1 text-sm font-medium text-foreground">Logs → signals → reason</div>
                </div>
                <div className="rounded-lg border bg-card/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Trust</div>
                  <div className="mt-1 text-sm font-medium text-foreground">Explainable decisions</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Design intent: show that SentinelAI is a tool, not a brochure. Keep visuals calm and UI-like. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
              className="lg:col-span-6"
            >
              <Card className="overflow-hidden">
                <div className="border-b bg-muted/20 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">Investigation snapshot</div>
                      <div className="text-xs text-muted-foreground">One decision, fully traceable.</div>
                    </div>
                    <Badge variant="outline" className="font-mono">risk 0.82</Badge>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border bg-card/40 p-3">
                      <div className="text-xs text-muted-foreground">Decision</div>
                      <div className="mt-1 text-sm font-medium text-foreground">block</div>
                    </div>
                    <div className="rounded-lg border bg-card/40 p-3">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="mt-1 text-sm font-medium text-foreground">93%</div>
                    </div>
                    <div className="rounded-lg border bg-card/40 p-3">
                      <div className="text-xs text-muted-foreground">Signals</div>
                      <div className="mt-1 text-sm font-medium text-foreground">3</div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="text-xs font-medium text-muted-foreground">Primary reason</div>
                    <div className="mt-1 text-sm text-foreground">
                      Detected high-risk content patterns and policy violations; action taken to prevent unsafe response.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-card/40 p-4">
                      <div className="text-xs font-medium text-muted-foreground">Prompt</div>
                      <div className="mt-2 h-2 w-11/12 rounded bg-muted" />
                      <div className="mt-2 h-2 w-9/12 rounded bg-muted" />
                      <div className="mt-2 h-2 w-10/12 rounded bg-muted" />
                    </div>
                    <div className="rounded-lg border bg-card/40 p-4">
                      <div className="text-xs font-medium text-muted-foreground">Response</div>
                      <div className="mt-2 h-2 w-10/12 rounded bg-muted" />
                      <div className="mt-2 h-2 w-8/12 rounded bg-muted" />
                      <div className="mt-2 h-2 w-11/12 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section id="how" className="px-4 py-16 sm:py-20">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={sectionFade}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How it works</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              A simple pipeline: capture interactions, score risk, and surface investigation-ready insights.
            </p>
          </motion.div>

          {/* Design intent: make the data flow obvious in one glance. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3"
          >
            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Waypoints className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">AI application</div>
                    <div className="text-sm text-muted-foreground">
                      Your agents, LLM gateway, or app runtime where prompts and responses occur.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">SentinelAI</div>
                    <div className="text-sm text-muted-foreground">
                      Policy checks + risk scoring + signal extraction to explain why an action was taken.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <BarChart3 className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Risk insights</div>
                    <div className="text-sm text-muted-foreground">
                      A console for triage, investigations, and audit exports—ready for production workflows.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Core capabilities */}
      <section id="capabilities" className="px-4 py-16 sm:py-20">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={sectionFade}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Core capabilities</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Built for engineering teams that need clarity, not hype.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2"
          >
            <motion.div variants={sectionFade}>
              <Card className="group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Risk scoring & decisions</div>
                    <div className="text-sm text-muted-foreground">
                      Consistent risk scores with a clear decision output (allow / warn / escalate / block).
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Investigation-ready logs</div>
                    <div className="text-sm text-muted-foreground">
                      Every event is a report: prompt, response, signals, confidence, and rationale.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Filter className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Triage and filtering</div>
                    <div className="text-sm text-muted-foreground">Find what matters: by risk, decision, flags, and time.</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Trends and baselines</div>
                    <div className="text-sm text-muted-foreground">
                      Watch risk drift over time and compare against the baseline you define.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Product preview */}
      <section id="preview" className="px-4 py-16 sm:py-20">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={sectionFade}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Product preview</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              A safety console built for investigation workflows.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-2"
          >
            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Dashboard</div>
                    <div className="mt-1 text-xs text-muted-foreground">Answer: “Is my AI system safe right now?”</div>
                  </div>
                  <Badge variant="secondary" className="font-mono">overview</Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="text-xs text-muted-foreground">Critical alerts</div>
                    <div className="mt-1 text-2xl font-semibold text-foreground">2</div>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="text-xs text-muted-foreground">Avg risk</div>
                    <div className="mt-1 text-2xl font-semibold text-foreground">0.46</div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border bg-card/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Risk score trend</span>
                    <span className="font-mono">7d</span>
                  </div>
                  <div className="mt-3 h-16 rounded bg-muted" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Risk logs</div>
                    <div className="mt-1 text-xs text-muted-foreground">Answer: “What happened, and what do I do next?”</div>
                  </div>
                  <Badge variant="outline" className="font-mono">audit</Badge>
                </div>

                <div className="mt-5 space-y-2">
                  {[
                    { id: '8421', risk: '0.82', decision: 'block', flags: 'policy_violation • jailbreak' },
                    { id: '8417', risk: '0.71', decision: 'escalate', flags: 'pii • exfiltration' },
                    { id: '8413', risk: '0.44', decision: 'warn', flags: 'unverified_claims' },
                  ].map((row) => (
                    <div key={row.id} className="rounded-lg border bg-card/40 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <Badge variant="secondary" className="font-mono">{row.risk}</Badge>
                          <Badge variant="outline" className="text-xs">{row.decision}</Badge>
                          <span className="truncate text-xs text-muted-foreground">Event #{row.id}</span>
                        </div>
                        <span className="hidden text-xs text-muted-foreground sm:inline">Investigate</span>
                      </div>
                      <div className="mt-2 truncate text-xs text-muted-foreground">{row.flags}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Why SentinelAI */}
      <section id="trust" className="px-4 py-16 sm:py-20">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={sectionFade}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Why SentinelAI</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Trust comes from clear evidence: what happened, what signals were detected, and why an action was taken.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3"
          >
            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Explainability by default</div>
                    <div className="text-sm text-muted-foreground">
                      Decisions are paired with signals and plain-language rationale so teams can validate outcomes.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Audit-ready exports</div>
                    <div className="text-sm text-muted-foreground">
                      Export individual events as structured JSON for incident reviews and compliance workflows.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={sectionFade}>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Shield className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">Production workflow first</div>
                    <div className="text-sm text-muted-foreground">
                      Built for triage: filters, investigations, and prioritized lists of what to look at next.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 pt-6">
        <div className="container mx-auto">
          <Card className="mx-auto max-w-3xl bg-gradient-to-r from-primary/10 to-primary/5 p-10 text-center">
            {/* Design intent: calm invitation to use the product; no forced signup language. */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Explore SentinelAI</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Open the console to review recent risk events, investigate decisions, and export evidence.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open console
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/logs">View logs</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">SentinelAI</span>
              <span className="text-xs text-muted-foreground">AI safety console</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link href="#how" className="text-muted-foreground hover:text-foreground">
                How it works
              </Link>
              <Link href="#capabilities" className="text-muted-foreground hover:text-foreground">
                Capabilities
              </Link>
              <Link href="#trust" className="text-muted-foreground hover:text-foreground">
                Why SentinelAI
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Open console
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">&copy; 2024 SentinelAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
