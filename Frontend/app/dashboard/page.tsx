'use client'

import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import Link from 'next/link'
import { AnimatedCard, Badge, Button, Skeleton } from '@/components/ui'
import { motion } from 'framer-motion'
import { ShieldAlert, AlertTriangle, Activity, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { useRiskLogs } from '@/hooks/useRiskLogs'
import { 
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function DashboardPageModern() {
  const {
    data: logs = [],
    isLoading,
    isError,
    error,
  } = useRiskLogs({ limit: 200 })

  const { kpis, trendData, topFlags, recentLogs } = useMemo(() => {
    const safeLogs = Array.isArray(logs) ? logs : []

    const parsed = safeLogs
      .map((log: any) => {
        const created = log?.created_at ? new Date(log.created_at) : null
        const risk = typeof log?.final_risk_score === 'number' ? log.final_risk_score : 0
        const flags = Array.isArray(log?.flags) ? log.flags : []
        return { ...log, _created: created, _risk: risk, _flags: flags }
      })
      .filter((log: any) => log._created instanceof Date && !Number.isNaN(log._created.getTime()))

    const totalEvents = parsed.length
    const criticalAlerts = parsed.filter((l: any) => l._risk >= 0.8).length
    const avgRisk = totalEvents
      ? parsed.reduce((sum: number, l: any) => sum + l._risk, 0) / totalEvents
      : 0

    const now = new Date()
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    const eventsToday = parsed.filter((l: any) => isSameDay(l._created, now)).length

    const recent = [...parsed]
      .sort((a: any, b: any) => b._created.getTime() - a._created.getTime())
      .slice(0, 5)

    const dayKey = (d: Date) => d.toISOString().slice(0, 10)
    const byDay = new Map<string, { sumRisk: number; count: number }>()
    for (const l of parsed) {
      const key = dayKey(l._created)
      const prev = byDay.get(key) || { sumRisk: 0, count: 0 }
      byDay.set(key, { sumRisk: prev.sumRisk + l._risk, count: prev.count + 1 })
    }

    const last7: { date: string; riskScore: number; logs: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = dayKey(d)
      const entry = byDay.get(key)
      last7.push({
        date: key,
        riskScore: entry && entry.count ? entry.sumRisk / entry.count : 0,
        logs: entry?.count || 0,
      })
    }

    const flagCounts = new Map<string, number>()
    for (const l of parsed) {
      for (const f of l._flags) {
        flagCounts.set(String(f), (flagCounts.get(String(f)) || 0) + 1)
      }
    }

    const flagsSorted = Array.from(flagCounts.entries())
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      kpis: {
        totalEvents,
        criticalAlerts,
        avgRisk,
        eventsToday,
      },
      trendData: last7,
      topFlags: flagsSorted,
      recentLogs: recent,
    }
  }, [logs])

  const status = useMemo(() => {
    // Design intent: communicate "Is my AI safe right now?" in one glance.
    if (kpis.criticalAlerts > 0 || kpis.avgRisk >= 0.7) {
      return {
        label: 'Needs attention',
        description: 'High-risk events detected. Review critical alerts and recent activity.',
        badgeVariant: 'destructive' as const,
      }
    }

    if (kpis.avgRisk >= 0.4) {
      return {
        label: 'Monitor closely',
        description: 'Risk levels are elevated. Investigate common flags and trend direction.',
        badgeVariant: 'secondary' as const,
      }
    }

    return {
      label: 'Stable',
      description: 'No critical alerts detected. Continue monitoring for drift and anomalies.',
      badgeVariant: 'outline' as const,
    }
  }, [kpis.avgRisk, kpis.criticalAlerts])

  const kpiCards = useMemo(
    () => [
      {
        key: 'total',
        title: 'Total observations',
        value: isLoading ? null : kpis.totalEvents,
        helper: 'Captured AI decisions analyzed in the current window (up to 7 days).',
        icon: ShieldAlert,
        accentClass:
          'from-foreground/5 via-transparent to-transparent',
        iconClass: 'bg-muted text-foreground',
      },
      {
        key: 'critical',
        title: 'Critical alerts',
        value: isLoading ? null : kpis.criticalAlerts,
        helper: 'Events with risk score ≥ 0.80 requiring immediate review.',
        icon: AlertTriangle,
        accentClass: 'from-destructive/10 via-transparent to-transparent',
        iconClass: 'bg-destructive/10 text-destructive',
      },
      {
        key: 'avg',
        title: 'Average risk score',
        value: isLoading ? null : kpis.avgRisk.toFixed(2),
        helper: 'Mean risk across captured events. Use trends to spot drift.',
        icon: Activity,
        accentClass: 'from-primary/10 via-transparent to-transparent',
        iconClass: 'bg-primary/10 text-primary',
      },
      {
        key: 'today',
        title: 'Events today',
        value: isLoading ? null : kpis.eventsToday,
        helper: 'Volume of decisions observed today (local time).',
        icon: CheckCircle2,
        accentClass: 'from-emerald-500/10 via-transparent to-transparent',
        iconClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      },
    ],
    [isLoading, kpis.avgRisk, kpis.criticalAlerts, kpis.eventsToday, kpis.totalEvents]
  )

  const recentHighRisk = useMemo(() => {
    const safe = Array.isArray(recentLogs) ? recentLogs : []
    const high = safe.filter((l: any) => typeof l?._risk === 'number' && l._risk >= 0.7)
    return (high.length ? high : safe).slice(0, 6)
  }, [recentLogs])

  return (
    <AppLayoutModern>
      <div className="space-y-8">
        {/* Design intent: give immediate context + confidence without feeling like marketing copy. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Risk Overview</h1>
              <Badge variant={status.badgeVariant}>{status.label}</Badge>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              SentinelAI continuously captures and scores AI decisions in production so engineering teams can audit safety,
              explain outcomes, and investigate risk quickly.
            </p>
            <p className="text-xs text-muted-foreground">{status.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="default">
              <Link href="/logs">
                Investigate logs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/baselines">Review baselines</Link>
            </Button>
          </div>
        </motion.div>

        {isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </div>
        )}

        {/* Design intent: KPIs should feel authoritative (value + meaning), not decorative. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card, index) => {
            const Icon = card.icon
            return (
              <AnimatedCard
                key={card.key}
                delay={index * 0.06}
                className="relative overflow-hidden p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.accentClass}`} />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-muted-foreground">{card.title}</div>
                    {card.value === null ? (
                      <Skeleton className="mt-2 h-7 w-16" />
                    ) : (
                      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{card.value}</div>
                    )}
                    <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{card.helper}</div>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </AnimatedCard>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Trend Chart */}
          <AnimatedCard delay={0.32} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                {/* Design intent: explain the chart in one sentence so it "reads" like a report. */}
                <h3 className="text-lg font-semibold text-foreground">Risk score trend</h3>
                <p className="text-xs text-muted-foreground">Daily average risk score (higher means more escalation)</p>
              </div>
              <Badge variant="secondary" className="font-mono">7d</Badge>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.38, ease: 'easeOut' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#888888"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const v = (payload[0] as any).value
                        return (
                          <div className="rounded-md border bg-popover p-2 shadow-lg">
                            <p className="text-sm font-medium text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground">Avg risk: {Number(v).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              Events: {(payload[0] as any).payload?.logs || 0}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="riskScore"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatedCard>

          {/* Flag Frequency Chart */}
          <AnimatedCard delay={0.38} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Top risk signals</h3>
                <p className="text-xs text-muted-foreground">Most common flags observed across recent events</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : topFlags.length > 0 ? (
                topFlags.map((flag) => (
                  <div
                    key={flag.flag}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-primary/60" />
                      <span className="text-sm font-medium text-foreground">{flag.flag}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{flag.count}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No flags available yet.</p>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Design intent: this section answers "Where should I investigate?" */}
        <AnimatedCard delay={0.44} className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent high-risk activity</h3>
              <p className="text-xs text-muted-foreground">
                Prioritized events to review. Click a row to open the full investigation report.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/logs">View all logs</Link>
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentHighRisk.length > 0 ? (
              recentHighRisk.map((log: any) => {
                const id = log?.id
                const risk = typeof log?._risk === 'number' ? log._risk : 0
                const decision = String(log?.decision || 'unknown')
                const flags = Array.isArray(log?._flags) ? log._flags : []
                const created = log?._created instanceof Date ? log._created : null

                const riskVariant =
                  risk >= 0.8 ? 'destructive' : risk >= 0.6 ? 'default' : risk >= 0.4 ? 'secondary' : 'outline'

                return (
                  <Link
                    key={String(id)}
                    href={`/logs/${id}`}
                    className="group flex items-center justify-between gap-4 rounded-lg border bg-card/50 p-4 transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={riskVariant} className="font-mono">
                          {risk.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {decision}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Event #{String(id)}</span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-xs text-muted-foreground">
                          {created ? created.toLocaleString() : '—'}
                        </span>
                        {flags.length > 0 && (
                          <span className="truncate text-xs text-muted-foreground">{flags.slice(0, 3).join(' • ')}</span>
                        )}
                        {flags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{flags.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                      <span className="hidden sm:inline">Investigate</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                No events captured yet. Once AI systems are connected, SentinelAI will automatically log decisions here.
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>
    </AppLayoutModern>
  )
}
